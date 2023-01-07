import { useState, useEffect } from "react";
import { api } from "../constants";

export function useApi<T>(path: string, initialValue?: T) {
  const [result, setResult] = useState<T | null>(initialValue ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(path)
      .then((r) => {
        if (!cancelled) {
          setResult(r.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setError(error.response.data);
        } else {
          setError(error.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { result, loading, error, setResult };
}
