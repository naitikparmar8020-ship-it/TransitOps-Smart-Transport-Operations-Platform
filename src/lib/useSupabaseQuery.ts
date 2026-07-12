import * as React from "react";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Tiny data-fetching hook for the Supabase API layer.
 *
 *   const { data: vehicles, loading, error } = useSupabaseQuery(() => vehiclesApi.list());
 *
 * `deps` controls when the query re-runs (like useEffect deps).
 */
export function useSupabaseQuery<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = [],
): QueryState<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => active && setData(res))
      .catch((e) => active && setError(e?.message ?? "Something went wrong"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}
