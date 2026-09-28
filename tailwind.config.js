export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,astro}'],
    theme: {
        extend: {
            colors: {
                orion: {
                    bg: '#0a0d14',
                    border: '#1a1f2e',
                    orange: '#FF5B00',
                },
                brand: {
                    purple: '#4a148c',
                    light: '#7c43bd',
                    dark: '#12005e',
                    accent: '#ffb300',
                    teal: '#00897b',
                    bg: '#f8fafc',
                }
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
