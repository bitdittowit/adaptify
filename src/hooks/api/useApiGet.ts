import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResult, InitialData } from "@/types/api";

const ARRAY_ROUTES = new Set([
  '/api/tasks',
]);

function useApiGet<T>(url: string): ApiResult<T> {
  const [data, setData] = useState<T | InitialData<T>>(() =>
    ARRAY_ROUTES.has(url) ?
      [] as InitialData<T> :
      null as InitialData<T>
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get<T>(url)
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null as InitialData<T>);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, error, loading };
}

export default useApiGet;
