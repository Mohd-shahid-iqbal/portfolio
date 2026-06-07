import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardBody } from "./index";

const meta = {
  title: "Design System/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <p className="text-slate-300">A glass morphism card component used throughout the portfolio.</p>
      </div>
    ),
  },
};

export const WithHover: Story = {
  args: {
    hover: true,
    glow: true,
    children: (
      <div>
        <h3 className="text-white font-semibold mb-2">Hover Me</h3>
        <p className="text-slate-400 text-sm">This card lifts and glows on hover.</p>
      </div>
    ),
  },
};

export const ProjectCard: Story = {
  render: () => (
    <Card hover glow className="max-w-sm">
      <CardHeader>
        <h3 className="text-white font-bold text-lg">Pocketful Trading Platform</h3>
        <p className="text-indigo-400 text-sm mt-1">Real-time trading dashboard</p>
      </CardHeader>
      <CardBody>
        <p className="text-slate-400 text-sm">
          High-performance system handling 6000+ live stock streams with WebSockets.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["React", "WebSockets", "Tailwind", "MFE"].map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs bg-indigo-500/15 text-indigo-300 rounded border border-indigo-500/30">
              {t}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  ),
};
