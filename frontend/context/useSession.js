import { useState, createContext, useContext, useEffect } from "react";
import { useProfileData } from "../hooks/data/useUserData";
import { getAppConfig } from "../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  // app configuration
  const config = getAppConfig();

  // profile data hook
  const { trigger, data, isMutating } = useProfileData();

  // login function declaration
  const login = ({ data, redirectURL }) => {
    Cookies.set("_TOKEN", data.jwt);

    if (redirectURL) {
      window.location.replace(redirectURL);
      return;
    }

    const userRole = data?.user.userRole;
    window.location.replace(
      userRole === "admin" ? config.adminURL : config.riderURL
    );
  };

  // logout function declaration
  const logout = ({ redirectURL }) => {
    Cookies.remove("_TOKEN");
    window.location.replace(redirectURL || config.loginURL);
  };

  // session validation function
  const authenticate = () => {
    const token = Cookies.get("_TOKEN");
    if (!token) {
      setSession(false);
      return;
    }

    trigger("authenticateToken", {
      populateCache: true,
      onSuccess: () => {
        setSession(true);
      },
      onError: (err) => {
        if (err.response) {
          setSession(false);
          Cookies.remove("_TOKEN");
        } else {
          setSession(true);
        }
      },
    });
  };

  // start session validation if prev and new route is not same
  const handleLoading = (e) => {
    authenticate();
    const currentPath = window.location.pathname;
    const newPath = e.split("?")?.[0]?.toString();
    if (newPath !== currentPath) setLoading(true);
  };

  useEffect(() => {
    authenticate();
  }, []);

  useEffect(() => {
    if (!isMutating) setLoading(false);
  }, [isMutating]);

  useEffect(() => {
    router.events.on("routeChangeStart", handleLoading);
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));

    return () => {
      router.events.off("routeChangeStart", handleLoading);
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  }, [router.events]);

  return (
    <SessionContext.Provider
      value={{
        login,
        logout,
        session,
        loading,
        isValidating: isMutating,
        user: data?.data,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
