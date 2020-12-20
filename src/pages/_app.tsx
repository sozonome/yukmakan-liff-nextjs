import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { LiffProvider } from "react-liff";

import Layout from "../components/layout";

import customTheme from "../styles/customTheme";

const liffId = process.env.MY_LIFF_ID;
const stubEnabled = process.env.NODE_ENV !== "production";

const MyApp = ({ Component, pageProps }) => {
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

export default MyApp;
