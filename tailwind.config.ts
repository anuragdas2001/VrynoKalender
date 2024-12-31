import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

const systemDefined = {
  padding: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },
  margin: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
    auto: "auto",
  },
  height: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
    auto: "auto",
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    full: "100%",
    screen: "100vh",
  },
  width: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
    auto: "auto",
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    full: "100%",
    screen: "100vw",
    min: "min-content",
    max: "max-content",
  },
  maxWidth: {
    0: "0rem",
    none: "none",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    prose: "65ch",
    "screen-sm": "640px",
    "screen-md": "768px",
    "screen-lg": "1024px",
    "screen-xl": "1280px",
    "screen-2xl": "1536px",
  },
  maxHeight: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
    full: "100%",
    screen: "100vh",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
  },
};

const customDefined = {
  padding: {
    4.5: "1.125rem",
    5.6: "1.406rem",
    6.5: "1.625rem",
    7.25: "1.875rem",
    7.5: "1.938rem",
    8.12: "2.125rem",
    8.5: "2.438rem",
    9.5: "2.375rem",
    14.5: "3.813rem",
    15: "3.75rem",
    21.5: "5.375rem",
    42: "10.5rem",
  },
  margin: {
    4.5: "1.25rem",
    5.5: "1.313rem",
    6.5: "1.625rem",
    7.5: "1.938rem",
    10.5: "2.563rem",
    11.5: "2.875rem",
    13: "3.25rem",
    15: "3.75rem",
    21.5: "5.375rem",
    84: "24.125rem",
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
  },
  height: {
    13: "3.25rem",
    15: "3.75rem",
    21.5: "5.375rem",
    57: "14.625rem",
    102: "33rem",
    "widgets-settings-modal": "443px",
  },
  width: {
    75: "19.938rem",
    85: "24.375rem",
    97: "30.188rem",
    100: "38.75rem",
  },
  maxWidth: {
    "table-column": "200px",
  },
  maxHeight: {
    84: "24.125rem",
    "widgets-settings-modal": "443px",
  },
};

module.exports = {
  content: [
    "./components/**/**/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./models/**/*.{js,ts,jsx,tsx}",
    "./stores/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    padding: {
      ...systemDefined.padding,
      ...customDefined.padding,
    },
    margin: {
      ...systemDefined.margin,
      ...customDefined.margin,
    },
    height: {
      ...systemDefined.height,
      ...customDefined.height,
    },
    width: {
      ...systemDefined.width,
      ...customDefined.width,
    },
    fontSize: {
      moreInfoHeading: ["11x", "17px"],
      moreInfoDetails: ["10px", "15px"],
      xs: ["12px", "18px"],
      xsm: ["13px", "20px"],
      sm: ["14px", "21px"],
      sl: ["15px", "21px"],
      base: ["16px", "24px"],
      md: ["18px", "27px"],
      lg: ["20px", "30px"],
      xl: ["24px", "32px"],
    },
    minHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      screen: "100vh",
      mobileContainer: "100vh-80px",
      tabletContainer: "100vh-86px",
      desktopContainer: "100vh-60px",
      navbar: "86px",
    },
    maxWidth: {
      ...systemDefined.maxWidth,
      ...customDefined.maxWidth,
    },
    maxHeight: {
      ...systemDefined.maxHeight,
      ...customDefined.maxHeight,
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      0.5: "0.5px",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2560px", //1440p
        "6xl": "3840px", //4k
      },
      backgroundImage: {
        bulkImport: "url('/bulkImport.png')",
      },
      gridTemplateRows: {
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridRow: {
        "span-11": "span 11 / span 11",
      },
      keyframes: {
        slide: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        slideClose: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
        modal_md: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(15%)",
          },
        },
        modal_lg: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(50%)",
          },
        },
      },
      animation: {
        slide: "slide 0.5s both ease-out",
        slideClose: "slideClose 0.5s both ease-out",
        modal_md: "modal_md 0.5s both ease-out",
        modal_lg: "modal_lg 0.5s both ease-out",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
      colors: {
        "vryno-card-heading-text": "#758DA5",
        "vryno-card-heading-background": "#DAEDFF",
        "vryno-orange": "#FA7921",
        "vryno-pink": "#FEF7F2",
        "vryno-danger": "#BE4A77",
        "vryno-orange-disabled": "#fcb381",
        "vryno-green": "#F9FFFC",
        "vryno-green-dark": "#43B58E",
        "vryno-gray": "#C4C4C4",
        "vryno-light-gray": "#f9fafb",
        "vryno-dark-gray": "#5B5B5B",
        "vryno-gray-secondary": "#BFBFBF",
        "vryno-icon": "#616161",
        "toast-error": "#F05454",
        "toast-warning": "#DE9E45",
        "vryno-warning-secondary": "#ffcc00",
        "toast-success": "#4DBE8D",
        "vryno-theme-blue": "#0068E6",
        "vryno-theme-blue-disable": "#b2d1f7",
        "vryno-theme-item-loading-background": "#d7e6fc",
        "vryno-theme-highlighter-blue": "#DCECFC",
        "vryno-theme-light-blue": "#2F98FF",
        "vryno-header-color": "#F0F7FA", //this one is soft light blue
        "vryno-theme-blue-secondary": "#0080FE",
        "vryno-medium-fade-blue": "#D3E6EF",
        "vryno-light-fade-blue": "#EAF4F9",
        "vryno-active-deal-blue": "#89B2DA",
        "vryno-label-gray": "#474747",
        "vryno-label-gray-secondary": "#667982",
        "vryno-gray-text": "#819EAB",
        "vryno-form-border-gray": "#DDE2E8",
        "vryno-icon-gray": "#C2C2C2",
        "vryno-placeholder": "#A6A6A6",
        "vryno-card-value": "#343434",
        "vryno-message": "#6B6B6B",
        "vryno-table-background": "#F0F8FF",
        "vryno-dropdown-icon": "#929292",
        "vryno-button-border": "#CECECE",
        "vryno-content-divider": "#C9C9C9",
        "vryno-activity-header": "#373737",
        "vryno-dropdown-hover": "#F8FBFF",
        "vryno-delete-icon": "#B23939",
        "toast-info-color": "#3498db",
        "toast-success-color": "#07bc0c",
        "toast-warning-color": "#f1c40f",
        "toast-error-color": "#e74c3c",
        "vryno-select-bg": "#D6E5FA",
        "vryno-select": "#F5F9FF",
        "vryno-slate-color": "#7D8E9F",
        "vryno-search-highlighter": "#D6E5FA",
        "vryno-instance-header": "#818181",
        "vryno-number-box-background": "#D4EAFF",
        "vryno-number-color": "#446A8F",
        "vryno-field-disabled": "#FAFAFA",
        "vryno-active-kanban-card": "#f6f6f6",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/forms")'
    // require("@tailwindcss/typography"),
  ],
};

