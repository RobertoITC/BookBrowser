

// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Custom hook for fetching data from an API endpoint.
 * @param url the resource URL
 * @param options fetch options (optional)
 * @returns { data, error, loading }
 */
function useFetch<T = unknown>(
  url: string,
  options?: RequestInit
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return { data, error, loading };
}

export default useFetch;