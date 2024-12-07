import axios from "axios";
import { useEffect, useState } from "react";
import { Step } from "@/types";
import { ApiResult } from "@/types/api";

export function useSteps(): ApiResult<Step[]> {
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios.get<Step[]>('/api/steps')
      .then((response) => setSteps(response.data))
      .catch((err) => setError(err));
  }, []);

  return { data: steps, error };
}
