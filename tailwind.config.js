export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,astro}'],
    theme: {
        extend: {
            colors: {
                orion: {
                    bg: '#0a0d14',
                    border: '#1a1f2e',
                    orange: '#FF5B00',
                }
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
