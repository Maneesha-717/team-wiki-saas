"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentOrganization } from "~/hooks/use-current-organization";

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

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-24 rounded" style={{ background: "#E4DFD4" }} />
      <div className="mt-3 h-7 w-56 rounded" style={{ background: "#E4DFD4" }} />
      <div className="mt-3 h-4 w-72 rounded" style={{ background: "#F3F0E8" }} />
      <div
        className="mt-10 h-28 rounded"
        style={{ background: "#F3F0E8", border: "1px dashed #E4DFD4" }}
      />
    </div>
  );
}

export default function DashboardPage() {
  const greeting = useGreeting();
  const { currentOrganization, isLoading } = useCurrentOrganization();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!currentOrganization) {
    return (
      <div className="flex flex-col items-start">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.14em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#B08D3F" }}
        >
          No organization
        </p>
        <h1
          className="mt-2 text-[26px] leading-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "#1C1B19" }}
        >
          You'll need an organization first
        </h1>
        <p className="mt-2 max-w-sm text-[15px]" style={{ color: "#6F6A62" }}>
          Organizations hold your team's workspaces and pages. Create one to get started.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex px-4 py-2 text-[13px] font-medium text-white transition-colors"
          style={{ background: "#1B4332", borderRadius: 6 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#163728")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1B4332")}
        >
          Create organization
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p
        className="text-[11px] font-medium uppercase tracking-[0.14em]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#B08D3F" }}
      >
        {currentOrganization.name}
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