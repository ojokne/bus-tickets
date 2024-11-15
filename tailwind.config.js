/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)", // White
        foreground: "hsl(240, 100%, 10%)", // Darker navy
        card: "hsl(0, 0%, 100%)", // White
        "card-foreground": "hsl(240, 100%, 10%)", // Darker navy
        popover: "hsl(0, 0%, 100%)", // White
        "popover-foreground": "hsl(240, 100%, 10%)", // Darker navy
        primary: "hsl(240, 100%, 25%)", // Navy blue (#000080)
        "primary-foreground": "hsl(0, 0%, 100%)", // White
        secondary: "hsl(240, 60%, 95%)", // Light navy
        "secondary-foreground": "hsl(240, 100%, 20%)", // Slightly darker navy
        muted: "hsl(240, 60%, 95%)", // Light navy
        "muted-foreground": "hsl(240, 30%, 40%)", // Muted navy
        accent: "hsl(330, 100%, 50%)", // Bright pink (#FF007F)
        "accent-foreground": "hsl(0, 0%, 100%)", // White
        destructive: "hsl(0, 84%, 60%)", // Red
        "destructive-foreground": "hsl(0, 0%, 100%)", // White
        border: "hsl(240, 30%, 90%)", // Very light navy
        input: "hsl(240, 30%, 90%)", // Very light navy
        ring: "hsl(240, 100%, 25%)", // Navy blue

        // Chart colors that complement navy and pink
        "chart-1": "hsl(240, 100%, 25%)", // Navy
        "chart-2": "hsl(330, 100%, 50%)", // Pink
        "chart-3": "hsl(270, 60%, 50%)", // Purple
        "chart-4": "hsl(210, 80%, 50%)", // Blue
        "chart-5": "hsl(300, 70%, 50%)", // Magenta
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
