"use client";

import { useEffect, useState } from "react";

/**
 * Assumes Fraunces / Inter / JetBrains Mono are already loaded once,
 * globally, in the root layout (see OnboardingPage's font note) —
 * no need to re-link them per page.
 */
function useGreeting() {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return greeting;
}

export default function DashboardPage() {
  const greeting = useGreeting();

  return (
    <div>
      <p
        className="text-[11px] font-medium uppercase tracking-[0.14em]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#B08D3F" }}
      >
        Dashboard
      </p>

      <h1
        className="mt-2 text-[28px] leading-tight"
        style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "#1C1B19" }}
      >
        {greeting}.
      </h1>

      <p className="mt-2 text-[15px]" style={{ color: "#6F6A62" }}>
        Here's what's happening across Team Wiki.
      </p>

      <div
        className="mt-10 flex flex-col items-start justify-between gap-4 border px-6 py-8 sm:flex-row sm:items-center"
        style={{
          borderColor: "#E4DFD4",
          borderStyle: "dashed",
          borderRadius: 6,
          background: "#F3F0E8",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: 17,
              color: "#1C1B19",
            }}
          >
            No pages yet
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "#6F6A62" }}>
            Start your team's first wiki page — everyone with access will see it here.
          </p>
        </div>

        <button
          type="button"
          className="shrink-0 px-4 py-2 text-[13px] font-medium text-white transition-colors"
          style={{ background: "#1B4332", borderRadius: 6 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#163728")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1B4332")}
        >
          New page
        </button>
      </div>
    </div>
  );
}