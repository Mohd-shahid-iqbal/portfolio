import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./index";

const meta = {
  title: "Design System/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", size: "md", children: "Get In Touch" },
};

export const Secondary: Story = {
  args: { variant: "secondary", size: "md", children: "View Projects" },
};

export const Outline: Story = {
  args: { variant: "outline", size: "md", children: "Download CV" },
};

export const Ghost: Story = {
  args: { variant: "ghost", size: "md", children: "Learn More" },
};

export const Large: Story = {
  args: { variant: "primary", size: "lg", children: "Let's Build Together" },
};

export const Small: Story = {
  args: { variant: "outline", size: "sm", children: "View Source" },
};
