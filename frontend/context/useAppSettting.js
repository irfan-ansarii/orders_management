import React, { useState, useEffect, createContext, useContext } from "react";
import capitalize from "capitalize";
import Head from "next/head";
import { getAppConfig } from "../utils";
import { useRouter } from "next/router";

const AppSettingContext = createContext(null);

export const AppSettingProvider = ({ children }) => {
  const router = useRouter();
  const config = getAppConfig();

  const [search, setSearch] = useState(false);
  const [filter, setFilter] = useState(null);
  const [action, setAction] = useState(null);
  const [pageTitle, setPageTitle] = useState("Home");

  const [headTitle, setHeadTitle] = useState(
    `${config.appTitle} - ${config.appDescription}`
  );

  const handleTitle = () => {
    const path = window.location.pathname;
    if (path !== "/") {
      const pathWithoutParam = path?.split("?")?.[0]?.toString();
      const final = pathWithoutParam?.split("/")?.[1];
      setPageTitle(capitalize(final));
      setHeadTitle(capitalize(final) + " - " + config.appTitle);
    }
    setAction(null);
  };

  useEffect(() => {
    handleTitle();
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", handleTitle);
    return () => router.events.off("routeChangeComplete", handleTitle);
  }, [router.events]);

  return (
    <AppSettingContext.Provider
      value={{
        pageTitle,
        setPageTitle,
        action,
        setAction,
        search,
        setSearch,
        filter,
        setFilter,
      }}
    >
      <Head>
        <title>{headTitle}</title>
      </Head>

      {children}
    </AppSettingContext.Provider>
  );
};

export const useAppSettting = () => {
  return useContext(AppSettingContext);
};
