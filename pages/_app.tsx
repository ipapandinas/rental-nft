import "../styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { initializeApi, isApiConnected } from "ternoa-js";

import WalletSelectModal from "components/base/WalletSelectModal";
import { CHAIN_WSS } from "lib/constants";
import { store } from "redux/store";

import styles from "../styles/Home.module.css";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const initTernoaJs = async () => {
    if (isApiConnected()) {
      console.log("Ternoa-js connected");
    } else {
      await initializeApi(CHAIN_WSS);
      console.log("Ternoa-js initialized");
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    let shouldUpdate = true;
    if (shouldUpdate) {
      initTernoaJs();
    }
    return () => {
      shouldUpdate = false;
    };
  }, []);

  if (!isLoaded)
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Chain Init...</h1>
        </main>
      </div>
    );

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <WalletSelectModal />
    </Provider>
  );
}
