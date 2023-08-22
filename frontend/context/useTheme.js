import { useState, createContext, useContext, useEffect } from "react";
import { Layout } from "antd";
import { ConfigProvider, theme, Grid, App } from "antd";
import AntConfig from "../ant.config.json";
import { QueryClient, QueryClientProvider } from "react-query";

const { useBreakpoint } = Grid;

const ThemeContext = createContext(null);
const queryClient = new QueryClient();

export const ThemeProvider = ({ children }) => {
  const screen = useBreakpoint(0);

  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(true);

  const getMode = () => {
    if (
      localStorage.getItem("mode") === "dark" ||
      (!("mode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const onChange = (e) => {
    localStorage.setItem("mode", e);
    getMode();
  };

  useEffect(() => {
    getMode();
    setLoading(false);
  }, []);
  if (loading) {
    return;
  }
  return (
    <ThemeContext.Provider
      value={{
        screen,
        mode,
        onChange,
      }}
    >
      <ConfigProvider
        theme={{
          token: mode === "dark" ? AntConfig.dark : AntConfig.default,
          algorithm:
            mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App>
          <QueryClientProvider client={queryClient}>
            <Layout className={`main-layout mode-${mode} `}>{children}</Layout>
          </QueryClientProvider>
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
