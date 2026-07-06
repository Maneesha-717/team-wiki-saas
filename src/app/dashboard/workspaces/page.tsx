"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useCurrentOrganization } from "~/hooks/use-current-organization";

export default function WorkspacesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<
    { type: "error" | "success"; message: string } | null
  >(null);

  const createWorkspace = api.workspace.create.useMutation();
  const utils = api.useUtils();

  const { currentOrganization, isLoading: organizationLoading } = useCurrentOrganization();

  const { data: workspaces, isLoading: workspacesLoading } = api.workspace.getByOrganization.useQuery(
    { organizationId: currentOrganization?.id ?? "" },
    { enabled: !!currentOrganization },
  );

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!currentOrganization) {
      setStatus({ type: "error", message: "No organization selected." });
      return;
    }

    if (!name.trim()) {
      setStatus({ type: "error", message: "Workspace name is required." });
      return;
    }

    try {
      await createWorkspace.mutateAsync({
        name,
        description,
        organizationId: currentOrganization.id,
      });

      await utils.workspace.getByOrganization.invalidate({
        organizationId: currentOrganization.id,
      });

      setStatus({ type: "success", message: "Workspace created." });
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Failed to create workspace." });
    }
  };

  if (organizationLoading) {
    return <p className="text-sm text-neutral-500">Loading organization…</p>;
  }

  if (!currentOrganization) {
    return <p className="text-sm text-neutral-500">No organization found.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Workspaces</h1>
        <p className="mt-1 text-sm text-neutral-500">Create and manage your workspaces.</p>
      </div>

      <div className="max-w-lg rounded-md border border-neutral-200 p-5">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">Create workspace</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workspace-name" className="mb-1.5 block text-sm text-neutral-700">
              Name
            </label>
            <input
              id="workspace-name"
              type="text"
              placeholder="Product Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label htmlFor="workspace-description" className="mb-1.5 block text-sm text-neutral-700">
              Description <span className="text-neutral-400">(optional)</span>
            </label>
            <textarea
              id="workspace-description"
              rows={3}
              placeholder="What's this workspace for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
            />
          </div>

          <button
            type="submit"
            disabled={createWorkspace.isPending}
            className="rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {createWorkspace.isPending ? "Creating…" : "Create workspace"}
          </button>

          {status && (
            <p className={`text-sm ${status.type === "error" ? "text-red-600" : "text-neutral-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Your workspaces</h2>

        {workspacesLoading ? (
          <p className="text-sm text-neutral-500">Loading workspaces…</p>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">{workspace.name}</p>
                {workspace.description && (
                  <p className="mt-0.5 text-sm text-neutral-500">{workspace.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No workspaces yet.</p>
        )}
      </div>
    </div>
  );
}