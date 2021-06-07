import { AppProps } from "next/app";
import "../styles/index.css";
import 'xterm/lib/xterm.css';
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
