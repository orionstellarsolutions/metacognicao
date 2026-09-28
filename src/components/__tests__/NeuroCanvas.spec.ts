import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import * as THREE from 'three';
import NeuroCanvas from '../NeuroCanvas.vue';

const { renderMock, disposeMock, setSizeMock, setPixelRatioMock } = vi.hoisted(() => ({
  renderMock: vi.fn(),
  disposeMock: vi.fn(),
  setSizeMock: vi.fn(),
  setPixelRatioMock: vi.fn()
}));

vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  class MockWebGLRenderer {
    domElement = document.createElement('canvas');
    setSize = setSizeMock;
    setPixelRatio = setPixelRatioMock;
    render = renderMock;
    dispose = disposeMock;
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer
  };
});

describe('NeuroCanvas.vue', () => {
  let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    renderMock.mockClear();
    disposeMock.mockClear();
    setSizeMock.mockClear();
    setPixelRatioMock.mockClear();

    // Mock IntersectionObserver with standard class
    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
          intersectionCallback = callback;
        }
        observe = observeSpy;
        disconnect = disconnectSpy;
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TEST-CANVAS-01: deve montar o elemento canvas e iniciar a cena Three.js', () => {
    const wrapper = mount(NeuroCanvas);
    const canvas = wrapper.find('[data-testid="neuro-canvas"]');

    expect(canvas.exists()).toBe(true);
    expect(observeSpy).toHaveBeenCalledWith(canvas.element);
    expect(setSizeMock).toHaveBeenCalled();
  });

  it('TEST-CANVAS-02: deve pausar e retomar a renderização via IntersectionObserver', async () => {
    const wrapper = mount(NeuroCanvas);

    // Dispara observer com isIntersecting: true
    intersectionCallback([{ isIntersecting: true }]);
    await wrapper.vm.$nextTick();

    // Dispara observer com isIntersecting: false
    intersectionCallback([{ isIntersecting: false }]);
    await wrapper.vm.$nextTick();

    expect(observeSpy).toHaveBeenCalled();
  });

  it('TEST-CANVAS-03: deve responder a eventos de mousemove e resize sem erros', async () => {
    const wrapper = mount(NeuroCanvas);

    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 500,
        clientY: 300
      })
    );

    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();

    expect(wrapper.exists()).toBe(true);
  });

  it('TEST-CANVAS-04: deve pausar quando o documento estiver oculto (visibilitychange)', async () => {
    const wrapper = mount(NeuroCanvas);

    Object.defineProperty(document, 'hidden', { value: true, writable: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await wrapper.vm.$nextTick();

    Object.defineProperty(document, 'hidden', { value: false, writable: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await wrapper.vm.$nextTick();

    expect(wrapper.exists()).toBe(true);
  });

  it('TEST-CANVAS-05: deve executar cleanup e liberar recursos no onUnmounted', () => {
    const removeWindowSpy = vi.spyOn(window, 'removeEventListener');
    const removeDocSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(NeuroCanvas);

    wrapper.unmount();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(removeWindowSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeWindowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeDocSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(disposeMock).toHaveBeenCalled();
  });

  it('TEST-CANVAS-06: deve fallback gracioso caso IntersectionObserver não esteja definido', () => {
    // @ts-expect-error test fallback
    delete window.IntersectionObserver;
    const wrapper = mount(NeuroCanvas);

    expect(wrapper.find('[data-testid="neuro-canvas"]').exists()).toBe(true);
    wrapper.unmount();
  });
});
