/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                bgWeb: '#01162D',
                primary: '#88BFE8',
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
                opacity: 'opacity 1s ease-in-out',
                cloud1: 'cloud1 23.5s ease-in-out 0.1s infinite',
                cloud2: 'cloud2 18.5s ease-in-out 0.1s infinite',
                cloud3: 'cloud3 14.5s ease-in-out 0.1s infinite',
                pulse2: 'pulse2 1.5s ease-in-out infinite',
                noopacity: 'noopacity 1s ease-in-out',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                opacity: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                noopacity: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                cloud1: {
                    '0%': {
                        transform: 'translateX(-250%)',
                    },
                    '100%': {
                        transform: 'translateX(400%)',
                    },
                },
                cloud2: {
                    '0%': {
                        transform: 'translateX(-150%)',
                    },
                    '100%': {
                        transform: 'translateX(350%)',
                    },
                },
                cloud3: {
                    '0%': {
                        transform: 'translateX(-100%)',
                    },
                    '100%': {
                        transform: 'translateX(350%)',
                    },
                },
                pulse2: {
                    '50%': {
                        opacity: '0.9',
                    },
                },
            },
        },
        screens: {
            xxs: '285px',
            // => @media (min-width: 285px) { ... }

            xs: '365px',
            // => @media (min-width: 365px) { ... }

            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
    },
    plugins: [],
};
