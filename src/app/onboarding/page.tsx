"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

/**
 * Fonts: this drops in Google Fonts via a <link> tag for portability.
 * In production, swap for next/font/google (Fraunces, Inter, JetBrains Mono)
 * so they're self-hosted and don't shift layout on load.
 */
function OnboardingFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
    />
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<
    { type: "error" | "success"; message: string } | null
  >(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-derive the slug from the name until the person edits it directly.
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const createOrganization = api.organization.create.useMutation();

  const isSlugValid = slug.length === 0 || /^[a-z0-9-]+$/.test(slug);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: "error", message: "Give the organization a name to continue." });
      nameInputRef.current?.focus();
      return;
    }
    if (!slug || !isSlugValid) {
      setStatus({ type: "error", message: "URL can only contain lowercase letters, numbers, and hyphens." });
      return;
    }

    try {
      await createOrganization.mutateAsync({ name, slug });
      setStatus({ type: "success", message: `${name} is ready. Redirecting you in…` });
      setName("");
      setSlug("");
      setSlugTouched(false);
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "That didn't go through — the URL may already be taken. Try another.",
      });
    }
  };

  return (
    <>
      <OnboardingFonts />
      <main
        className="min-h-screen px-6 py-16 sm:py-24"
        style={{ background: "#FBFAF6", color: "#1C1B19" }}
      >
        <div className="mx-auto w-full max-w-[440px]">
          {/* Mark + eyebrow */}
          <div className="mb-10 flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="24" height="24" rx="3" stroke="#1B4332" strokeWidth="1.4" />
              <path d="M8 18V8.5L13 6l5 2.5V18" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.75 18v-4.5h4.5V18" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#B08D3F" }}
            >
              New workspace
            </span>
          </div>

          <h1
            className="text-[32px] leading-[1.15] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Create your organization
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed" style={{ color: "#6F6A62" }}>
            Set a name and a URL below. Both can be changed later from settings.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="org-name"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6F6A62" }}
              >
                Name
              </label>
              <input
                id="org-name"
                ref={nameInputRef}
                type="text"
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors"
                style={{
                  borderColor: "#E4DFD4",
                  borderRadius: 6,
                  color: "#1C1B19",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#1B4332")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E4DFD4")}
              />
            </div>

            <div>
              <label
                htmlFor="org-slug"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6F6A62" }}
              >
                URL
              </label>
              <div
                className="flex items-center border bg-white pl-3.5 pr-3.5 transition-colors"
                style={{
                  borderColor: isSlugValid ? "#E4DFD4" : "#9B3B2E",
                  borderRadius: 6,
                }}
              >
                <span
                  className="whitespace-nowrap text-[13px]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#A6A199" }}
                >
                  app.example.com/
                </span>
                <input
                  id="org-slug"
                  type="text"
                  placeholder="acme-inc"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value.toLowerCase());
                  }}
                  className="w-full bg-transparent py-2.5 text-[13px] outline-none"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1C1B19" }}
                />
              </div>
              <p className="mt-1.5 text-xs" style={{ color: isSlugValid ? "#A6A199" : "#9B3B2E" }}>
                {isSlugValid
                  ? "Lowercase letters, numbers, and hyphens only."
                  : "Only lowercase letters, numbers, and hyphens are allowed."}
              </p>
            </div>

            {/* Nameplate preview — the one place this form shows what it's actually building */}
            <div
              className="flex items-center justify-between border px-4 py-3"
              style={{ borderColor: "#E4DFD4", borderRadius: 6, background: "#F3F0E8" }}
            >
              <div className="min-w-0">
                <div
                  className="truncate text-[15px]"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
                >
                  {name.trim() || "Your organization"}
                </div>
                <div
                  className="truncate text-[12px]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6F6A62" }}
                >
                  app.example.com/{slug || "your-url"}
                </div>
              </div>
              <span
                className="ml-3 shrink-0 text-[10px] uppercase tracking-[0.14em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#B08D3F" }}
              >
                Preview
              </span>
            </div>

            <button
              type="submit"
              disabled={createOrganization.isPending}
              className="w-full py-2.5 text-[14px] font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "#1B4332", borderRadius: 6 }}
              onMouseEnter={(e) => {
                if (!createOrganization.isPending) e.currentTarget.style.background = "#163728";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1B4332";
              }}
            >
              {createOrganization.isPending ? "Creating…" : "Create organization"}
            </button>

            {status && (
              <p
                role="status"
                className="text-[13px]"
                style={{ color: status.type === "error" ? "#9B3B2E" : "#1B4332" }}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </main>
    </>
  );
}