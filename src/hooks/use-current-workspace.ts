"use client";

import { api } from "~/trpc/react";
import { useCurrentOrganization } from "./use-current-organization";

export function useCurrentWorkspace() {
  const {
    currentOrganization,
    isLoading: organizationLoading,
  } = useCurrentOrganization();

  const { data: workspaces, isLoading: workspaceLoading } =
    api.workspace.getByOrganization.useQuery(
      {
        organizationId: currentOrganization?.id ?? "",
      },
      {
        enabled: !!currentOrganization,
      },
    );

  return {
    currentWorkspace: workspaces?.[0] ?? null,
    workspaces: workspaces ?? [],
    isLoading: organizationLoading || workspaceLoading,
  };
}