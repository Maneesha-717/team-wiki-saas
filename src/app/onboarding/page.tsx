"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

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
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-20">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Create your organization</h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          Set a name and a URL below. Both can be changed later from settings.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="org-name" className="mb-1.5 block text-sm text-neutral-700">
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
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label htmlFor="org-slug" className="mb-1.5 block text-sm text-neutral-700">
              URL
            </label>
            <div
              className={`flex items-center rounded-md border px-3 ${
                isSlugValid ? "border-neutral-200 focus-within:border-neutral-400" : "border-red-300"
              }`}
            >
              <span className="whitespace-nowrap text-sm text-neutral-400">app.example.com/</span>
              <input
                id="org-slug"
                type="text"
                placeholder="acme-inc"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase());
                }}
                className="w-full bg-transparent py-2 text-sm text-neutral-900 outline-none"
              />
            </div>
            <p className={`mt-1.5 text-xs ${isSlugValid ? "text-neutral-400" : "text-red-600"}`}>
              {isSlugValid
                ? `Your page will live at app.example.com/${slug || "your-url"}`
                : "Only lowercase letters, numbers, and hyphens are allowed."}
            </p>
          </div>

          <button
            type="submit"
            disabled={createOrganization.isPending}
            className="w-full rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createOrganization.isPending ? "Creating…" : "Create organization"}
          </button>

          {status && (
            <p
              role="status"
              className={`text-sm ${status.type === "error" ? "text-red-600" : "text-neutral-600"}`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}