import { api } from "~/trpc/react";

export function useCurrentOrganization() {
  const {
    data: organizations,
    isLoading,
    error,
  } = api.organization.myOrganizations.useQuery();

  return {
    organizations: organizations ?? [],
    currentOrganization: organizations?.[0] ?? null,
    isLoading,
    error,
  };
}