import * as React from "react";

interface UseSupabaseResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * Generic hook that fetches data from a Supabase service on mount.
 * Returns { data, loading, error, refetch, setData }.
 *
 * `setData` allows optimistic local updates while `refetch` re-fetches from the server.
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T[]>,
  fallback: T[] = [],
): UseSupabaseResult<T> {
  const [data, setData] = React.useState<T[]>(fallback);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = React.useCallback(() => {
    setLoading(true);
    setError(null);
    queryFn()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Supabase query failed, using fallback data:", err);
        setError(err?.message ?? "Failed to fetch data");
        // Keep fallback data on error so the UI still works
        setData((prev) => (prev.length > 0 ? prev : fallback));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFn]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, setData };
}
