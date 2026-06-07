import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "./index";

const meta = {
  title: "Design System/SectionHeading",
  component: SectionHeading,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "What I Do",
    title: "Technical Skills",
    subtitle: "A curated set of tools and technologies I use to build exceptional digital experiences.",
    align: "center",
  },
};

export const LeftAligned: Story = {
  args: {
    eyebrow: "Career",
    title: "Professional Experience",
    align: "left",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Get In Touch",
    align: "center",
  },
};
