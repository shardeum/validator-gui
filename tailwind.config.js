/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                black: {
                    ...require("daisyui/src/colors/themes")["[data-theme=black]"],
                    primary: "#1d4ed8",
                    "primary-focus": "#1d4ed8",
                    error: "#ef4444",

                    '.btn': {
                        'text-transform': 'capitalize'
                    },
                    '.btn-primary': {
                        color: 'white'
                    },
                    '.btn-error': {
                        color: 'white'
                    }
                },
            },
        ]
    },
    plugins: [require("daisyui")],
}
