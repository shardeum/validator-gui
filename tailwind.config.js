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
                forest: {
                    ...require("daisyui/src/colors/themes")["[data-theme=forest]"],
                    primary: "#1d4ed8",
                    "primary-focus": "#1d4ed8",
                    error: "#ef4444",
                    "--bc": '0 11.727% 30.608%',
                    "base-100": "#000000",

                    '.btn': {
                        'text-transform': 'capitalize',
                        'border-radius': '0',
                    },
                    '.btn-primary': {
                        color: 'white'
                    },
                    '.btn-error': {
                        color: 'white'
                    },
                    '.toggle': {
                        "--tglbg": "#f3f4f6",
                        "--bc": '0 11.727% 30.608%'
                    }
                },
            },
        ]
    },
    plugins: [require("daisyui")],
}
