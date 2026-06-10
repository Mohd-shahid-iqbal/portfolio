// ─── Block types ────────────────────────────────────────────────────────────

export type Block =
  | { type: "p";      text: string }
  | { type: "h2";     text: string }
  | { type: "h3";     text: string }
  | { type: "quote";  text: string }
  | { type: "tip";    text: string }
  | { type: "steps";  items: { title: string; text: string }[] }
  | { type: "bullets"; items: string[] }
  | { type: "code";   lang: string; text: string };

// ─── Helper functions (use these when writing posts) ────────────────────────

export const p       = (text: string): Block => ({ type: "p", text });
export const h2      = (text: string): Block => ({ type: "h2", text });
export const h3      = (text: string): Block => ({ type: "h3", text });
export const quote   = (text: string): Block => ({ type: "quote", text });
export const tip     = (text: string): Block => ({ type: "tip", text });
export const bullets = (items: string[]): Block => ({ type: "bullets", items });
export const code    = (lang: string, text: string): Block => ({ type: "code", lang, text });
export const steps   = (
  items: { title: string; text: string }[]
): Block => ({ type: "steps", items });

// ─── Post schema ────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  color: "indigo" | "violet" | "cyan";
  readTime: string;
  content: Block[];
}

// ─── Posts ──────────────────────────────────────────────────────────────────
// To publish a new post: add an object to this array. Nothing else needed.

export const blogPosts: BlogPost[] = [
  {
    slug: "tab-throttling-websockets",
    title:
      "We Built a Real-Time Trading Platform. It Worked Great — Until Users Switched Tabs.",
    description:
      "Here's the browser behavior nobody talks about, and how we fixed tab throttling, task queue dumping, and stale data in a live WebSocket trading dashboard.",
    date: "June 2025",
    tags: ["WebSockets", "Performance", "Browser APIs", "React"],
    color: "indigo",
    readTime: "5 min read",
    content: [
      p(
        "Users would switch to another tab, come back to the platform, and the app would freeze for a few seconds. Charts stuttered. Live prices lagged. In a trading environment, that's not a UX annoyance — that's money."
      ),

      h2("What was actually happening?"),

      p("Two browser behaviors were working against us simultaneously."),

      steps([
        {
          title: "Tab Throttling",
          text: "When a tab goes into the background, browsers deliberately throttle network requests and JavaScript execution to save resources. This delays WebSocket message processing — so while the user is away, your real-time data pipeline is silently choking.",
        },
        {
          title: "Task Queue Dumping",
          text: "While the tab is inactive, the browser queues up all deferred tasks. The moment the user returns? The browser dumps that entire backlog at once. Hundreds of queued tasks fire simultaneously — and the main thread gets crushed.",
        },
      ]),

      p("Result: the app freezes right when the user needs it most."),

      h2("How we solved it"),

      steps([
        {
          title: "Page Visibility API",
          text: "We used document.visibilitychange to detect tab switches. When the tab goes hidden, we pause non-critical processing. When it returns, we resume gracefully instead of letting the browser flood the thread.",
        },
        {
          title: "WebSocket heartbeat management",
          text: "We kept the socket connection alive but buffered incoming data during background state, then replayed only the latest snapshot on return — not the full backlog.",
        },
        {
          title: "Task throttling on resume",
          text: "Instead of processing all queued updates at once, we used a controlled queue with requestIdleCallback to spread the work across frames.",
        },
        {
          title: "Stale data detection",
          text: "On tab focus, we check timestamp deltas and trigger a fresh data fetch if the gap exceeds our threshold. No stale prices painted as live.",
        },
      ]),

      code(
        "js",
        `document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseNonCriticalUpdates();
  } else {
    const delta = Date.now() - lastUpdateTimestamp;
    if (delta > STALE_THRESHOLD_MS) {
      fetchLatestSnapshot();
    } else {
      resumeFromBuffer();
    }
  }
});`
      ),

      quote(
        "Browsers are not passive containers. They actively manage your app's resources in the background — and if you don't account for that, your users pay the price at the worst possible moment."
      ),

      h2("The lesson"),

      p(
        "If you're building anything real-time — trading platforms, live dashboards, collaborative tools — the Page Visibility API isn't optional. It's essential."
      ),

      tip(
        "Pair visibilitychange with a WebSocket ping/pong heartbeat so you also detect silent disconnections that happen while the tab is hidden."
      ),
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
