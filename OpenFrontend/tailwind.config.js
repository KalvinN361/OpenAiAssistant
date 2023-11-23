const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [
        './src/**/*.{html,js,jsx,ts,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            xxxs: '360px',
            xxs: '390px',
            xs: '413px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                gold: '#CD9F29',
                fire: '#F73718',
                khaki: '#f2ebc0',
                billBlue: '#252d66',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                sans: ['Helvetica', 'Arial', 'sans-serif'],
                barlow: ['Barlow'],
            },
            spacing: {
                '9/10': '90%',
            },
            maxWidth: {
                1920: '1920px',
            },
            screens: {
                xs: '390px',
                short: { raw: '(max-height: 669px)' },
                tall: { raw: '(min-height: 670px)' },
                giant: { raw: '(min-height: 852px)' },
                iphonex: {
                    min: '375px',
                    max: '812px',
                    raw: '(-webkit-min-device-pixel-ratio: 3)',
                },
            },
            zIndex: {
                1: '1',
                60: '60',
                70: '70',
                80: '80',
                90: '90',
                100: '100',
            },
        },
    },
    plugins: [],
};
