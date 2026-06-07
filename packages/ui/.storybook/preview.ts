import type { Preview } from "@storybook/react";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#03040a" },
        { name: "surface", value: "#0b0d1a" },
        { name: "light", value: "#f8fafc" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
