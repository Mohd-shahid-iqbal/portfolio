import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";

const meta = {
  title: "Design System/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "TypeScript", variant: "default" },
};

export const Indigo: Story = {
  args: { children: "React", variant: "indigo" },
};

export const Violet: Story = {
  args: { children: "Next.js", variant: "violet" },
};

export const Cyan: Story = {
  args: { children: "WebSockets", variant: "cyan" },
};

export const Emerald: Story = {
  args: { children: "Node.js", variant: "emerald" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      {(["default", "indigo", "violet", "cyan", "emerald", "amber", "rose"] as const).map(
        (v) => (
          <Badge key={v} variant={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Badge>
        )
      )}
    </div>
  ),
};
