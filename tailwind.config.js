const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

// TODO: 개발하면서 spacing 추가
const spacing = [...[...Array(1001).keys()]];

const convertSpacing = (spacing) =>
  [...new Set(spacing)].reduce((res, space) => {
    res[space] = `${space}px`;
    return res;
  }, {});
const convertSpacingWithoutPx = (spacing) =>
  [...new Set(spacing)].reduce((res, space) => {
    res[space] = `${space}`;
    return res;
  }, {});

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  safelist: [
    "bg-red-100",
    "bg-green-100",
    "bg-gray-100",
    "bg-blue",
    "bg-orange-100",
    "bg-brown-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-purple-100",
  ],
  theme: {
    // TODO: 반응형 break point에 맞게 설정. sm은 항상 0
    screens: {
      sm: "0px",
      md: "848px",
      lg: "1280px",
    },

    extend: {
      rotate: {
        4: "4deg",
      },

      colors: {
        ...defaultTheme.colors,

        blue: "#A9DFFC",

        // TODO: color setting
        black: "#1a1a1a",
        white: "#ffffff",

        //Grayscale
        gray10: "#0e0e12",
        gray8: "#1c1c23",
        gray7: "#353542",
        gray6: "#4e4e61",
        gray5: "#666680",
        gray4: "#83839c",
        gray3: "#a2a2b5",
        gray2: "#c1c1cd",
        gray1: "#eoeoe6",

        //Primary
        primary10: "#5e00f5",
        primary50: "#7722ff",
        primary2: "#924eff",
        primary10: "#ad7bff",
        primary5: "#c9a7ff",
        primary0: "#e4d3ff",

        //Accent
        accent10: "#ff7966",
        accent5: "#ffa699",
        accent0: "#ffd2cc",

        //Secondary
        secondary10: "#00fad9",
        secondary5: "#7dffee",
      },

      fontFamily: {
        sans: ["Pretendard", ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        ...convertSpacing([...Array(101).keys()]),
      },

      fontWeight: {
        thin: 100,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      spacing: {
        ...defaultTheme.spacing,
        ...convertSpacing(spacing),
      },

      width: (theme) => ({ ...defaultTheme.width, ...theme("spacing") }),
      height: (theme) => ({ ...defaultTheme.height, ...theme("spacing") }),

      minWidth: (theme) => ({ ...defaultTheme.minWidth, ...theme("spacing") }),
      maxWidth: (theme) => ({ ...defaultTheme.maxWidth, ...theme("spacing") }),

      minHeight: (theme) => ({
        ...defaultTheme.minHeight,
        ...theme("spacing"),
      }),
      maxHeight: (theme) => ({
        ...defaultTheme.maxHeight,
        ...theme("spacing"),
      }),

      lineHeight: (theme) => ({
        ...defaultTheme.lineHeight,
        ...convertSpacing([...Array(101).keys()]),
      }),

      borderRadius: (theme) => ({
        ...defaultTheme.lineHeight,
        ...convertSpacing([...Array(101).keys()]),
      }),
      borderWidth: (theme) => ({
        ...defaultTheme.borderWidth,
        ...convertSpacing([...Array(21).keys()]),
      }),

      animation: (theme) => ({
        ...defaultTheme.animation,
      }),
      keyframes: (theme) => ({
        ...defaultTheme.keyframes,
      }),

      boxShadow: (theme) => ({
        ...defaultTheme.boxShadow,
      }),

      zIndex: (theme) => ({
        ...defaultTheme.zIndex,
        ...convertSpacingWithoutPx([...Array(101).keys()]),
      }),
    },
  },
  truncate: {
    lines: { 2: "2", 3: "3", 4: "4" },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled", "active"],
      borderColor: ["disabled", "active"],
      textColor: ["disabled", "active"],
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({});
      addComponents({
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".absolute-center": {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        ".absolute-center-x": {
          left: "50%",
          transform: "translateX(-50%)",
        },
        ".absolute-center-y": {
          top: "50%",
          transform: "translateY(-50%)",
        },

        ".clickable": {
          cursor: "pointer",
        },
        ".non-clickable": {
          cursor: "not-allowed",
          userSelect: "none",
        },

        ".transition-color": {
          transitionProperty: "background-color,border-color,color,fill,stroke",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "150ms",
        },

        "text-gradient-blue-left": {
          background: "linear-gradient(180deg, #A9DFFC 0%, #A9DFFC 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },

        // TODO: font setting
        ".font-r-4": { fontSize: "4px", lineHeight: "8px", fontWeight: 400 },
        ".font-r-8": { fontSize: "8px", lineHeight: "16px", fontWeight: 400 },
        ".font-r-12": { fontSize: "12px", lineHeight: "16px", fontWeight: 400 },
        ".font-r-14": { fontSize: "14px", lineHeight: "20px", fontWeight: 400 },
        ".font-r-16": { fontSize: "16px", lineHeight: "24px", fontWeight: 400 },
        ".font-r-24": { fontSize: "24px", lineHeight: "32px", fontWeight: 400 },
        ".font-r-28": { fontSize: "28px", lineHeight: "38px", fontWeight: 400 },

        ".font-m-20": { fontSize: "20px", lineHeight: "32px", fontWeight: 500 },

        ".font-sb-12": {
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 600,
        },
        ".font-sb-14": {
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 600,
        },
        ".font-sb-16": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
        },
        ".font-sb-18": {
          fontSize: "18px",
          lineHeight: "26px",
          fontWeight: 600,
        },
        ".font-sb-20": {
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: 600,
        },
        ".font-sb-28": {
          fontSize: "28px",
          lineHeight: "38px",
          fontWeight: 600,
        },

        ".font-b-72": {
          fontSize: "72px",
          lineHeight: "108px",
          fontWeight: 700,
        },
        ".font-b-56": { fontSize: "56px", lineHeight: "56px", fontWeight: 700 },

        ".font-b-40": { fontSize: "40px", lineHeight: "40px", fontWeight: 700 },
        ".font-b-32": { fontSize: "32px", lineHeight: "48px", fontWeight: 700 },
        ".font-b-24": { fontSize: "24px", lineHeight: "36px", fontWeight: 700 },
        ".font-b-20": { fontSize: "20px", lineHeight: "32px", fontWeight: 700 },
      });

      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
