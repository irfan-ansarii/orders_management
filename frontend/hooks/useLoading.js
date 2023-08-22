import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/router";

const useLoading = (dependency = []) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const timer = useRef(null);

  const hideLoading = () => {
    timer.current = setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    setLoading(true);
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => hideLoading());
    router.events.on("routeChangeError", () => hideLoading());

    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => hideLoading());
      router.events.off("routeChangeError", () => hideLoading());
    };
  }, dependency);

  useEffect(() => {
    hideLoading();
    return () => clearTimeout(timer.current);
  }, []);

  return loading;
};

export default useLoading;
