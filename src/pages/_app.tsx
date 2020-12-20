import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import App from "next/app";
import { LiffProvider } from "react-liff";
import "fontsource-jost/latin.css";

import Layout from "../components/layout";

import customTheme from "../styles/customTheme";

const LIFF_ID = process.env.MY_LIFF_ID;
const stubEnabled = process.env.NODE_ENV !== "production";

const MyApp = ({ Component, pageProps, liffId }) => {
  return (
    <LiffProvider liffId={liffId} stubEnabled={stubEnabled}>
      <ChakraProvider theme={customTheme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </LiffProvider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const liffId = LIFF_ID;

  return { ...appProps, liffId };
};

export default MyApp;
