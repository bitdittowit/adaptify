import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types";
import { ApiResult } from "@/types/api";

export function useUser(): ApiResult<User> {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios.get<User>('/api/user')
      .then((response) => setUser(response.data))
      .catch((err) => setError(err));
  }, []);

  return { data: user, error };
}
