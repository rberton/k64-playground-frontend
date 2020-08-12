import React, { Component } from "react";
import type { AppProps } from "next/app";
import {
  ApolloProvider,
  ApolloClient,
  NormalizedCache,
} from "@apollo/react-hooks";
import withData from "../config/client";

interface IProps {
  Component: typeof Component;
  pageProps: AppProps;
  apollo: ApolloClient<NormalizedCache>;
}

const CustomApp = ({ Component, pageProps, apollo }: IProps) => {
  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default withData(CustomApp);
