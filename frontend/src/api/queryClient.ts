import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch in background to ensure fresh data
      gcTime: 1000 * 60 * 30, // Keep cache in memory for 30 minutes
      refetchOnWindowFocus: true, // Auto-sync when user returns to app
      refetchOnReconnect: true,
      retry: 1, // Only retry once on failure
    },
  },
});
