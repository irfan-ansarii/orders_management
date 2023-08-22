import { ThemeProvider } from "../context/useTheme";
import { SessionProvider } from "../context/useSession";
import { AppSettingProvider } from "../context/useAppSettting";
import AppLayout from "../layouts/AppLayout";

/** styles */
import "../styles/antd.min.css";
import "../styles/globals.css";
import "antd/dist/reset.css";
import "../styles/utility.css";
import "simplebar-react/dist/simplebar.min.css";

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <AppSettingProvider>
      <ThemeProvider>
        <SessionProvider>
          {getLayout(<Component {...pageProps} />)}{" "}
        </SessionProvider>
      </ThemeProvider>
    </AppSettingProvider>
  );
}
