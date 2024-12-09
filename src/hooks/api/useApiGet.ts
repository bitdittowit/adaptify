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

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios.get<T>(url)
      .then((response) => setData(response.data))
      .catch((err) => setError(err));
  }, [url]);

  return { data, error };
}

export default useApiGet;
