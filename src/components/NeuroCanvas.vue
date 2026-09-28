<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let particles: THREE.Points | null = null;
let lines: THREE.LineSegments | null = null;
let startTime = 0;
let animationFrameId: number | null = null;
let observer: IntersectionObserver | null = null;

let mouseX = 0;
let mouseY = 0;
let isVisible = false;

const animate = () => {
  if (!isVisible || !renderer || !scene || !camera || !particles || !lines) {
    return;
  }

  animationFrameId = requestAnimationFrame(animate);
  const elapsedTime = (performance.now() - startTime) * 0.001;

  particles.rotation.y = elapsedTime * 0.05;
  lines.rotation.y = elapsedTime * 0.05;

  camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
};

const startLoop = () => {
  if (!animationFrameId && isVisible) {
    if (!startTime) {
      startTime = performance.now();
    }
    animate();
  }
};

const stopLoop = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const handleMouseMove = (event: MouseEvent) => {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  mouseX = (event.clientX / width) * 2 - 1;
  mouseY = -(event.clientY / height) * 2 + 1;
};

const handleResize = () => {
  if (!canvasRef.value || !renderer || !camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight * 0.9;
  camera.aspect = width / (height || 1);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    stopLoop();
  } else if (isVisible) {
    startLoop();
  }
};

const initThreeJS = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.9 || 1), 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight * 0.9);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x7c43bd,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const linePositions: number[] = [];
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          linePositions.push(
            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a148c,
      transparent: true,
      opacity: 0.15
    });

    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible = true;
              startLoop();
            } else {
              isVisible = false;
              stopLoop();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    } else {
      isVisible = true;
      startLoop();
    }
  } catch (error) {
    // Graceful fallback for non-WebGL environments
    console.warn('[NeuroCanvas] WebGL context fallback:', error);
  }
};

const cleanup = () => {
  stopLoop();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);

  if (particles) {
    particles.geometry.dispose();
    if (Array.isArray(particles.material)) {
      particles.material.forEach((m) => m.dispose());
    } else {
      particles.material.dispose();
    }
  }

  if (lines) {
    lines.geometry.dispose();
    if (Array.isArray(lines.material)) {
      lines.material.forEach((m) => m.dispose());
    } else {
      lines.material.dispose();
    }
  }

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
};

onMounted(() => {
  initThreeJS();
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none md:pointer-events-auto opacity-60 z-0"
    data-testid="neuro-canvas"
    aria-label="Representação visual 3D interativa de redes cognitivas e sinapses"
  />
</template>
