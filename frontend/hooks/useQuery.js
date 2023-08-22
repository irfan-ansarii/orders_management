import { useCallback } from "react";
import { useRouter } from "next/router";

const useQuery = () => {
  const router = useRouter();

  const onChange = useCallback(({ key, value, replace = true }) => {
    let queryParams = router.query;

    if (!value) {
      delete queryParams[key];
    } else {
      queryParams[key] = value;
    }

    router.replace({ query: queryParams });
  });

  return { onChange, value: router.query };
};

export default useQuery;
