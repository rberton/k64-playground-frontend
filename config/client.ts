/**
 * Apollo Client Configuration
 * @author Romain Berton <romain.berton@gmail.com>
 */

import { ApolloClient } from "apollo-client";
import { split, ApolloLink, concat } from "apollo-link";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import withApollo from "next-with-apollo";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import { WebSocketLink } from "apollo-link-ws";
import Cookies from "js-cookie";
import { SERVER, WEB_SOCKET_LINK } from "./env";

interface Definition {
  kind: string;
  operation?: string;
}

let authToken = null;

const httpLink = new HttpLink({
  fetch,
  uri: SERVER,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: authToken || null,
    },
  });

  // Add onto payload for WebSocket authentication
  (operation as any & { authToken: string | undefined }).authToken = authToken;

  return forward(operation);
});

const webSocketLink: any = process.browser
  ? new WebSocketLink({
      uri: WEB_SOCKET_LINK,
      options: {
        reconnect: true,
      },
    })
  : null;

/**
 * Set Token
 * @param token
 */

export const setToken = (token: string) => {
  try {
    authToken = token ? `Bearer ${token}` : null;
    Cookies.set("token", authToken, { expires: 7 });
  } catch (error) {
    throw new Error();
  }
};

/**
 * Set Token In Request
 * @param token
 */

export const setTokenInRequest = (token: string) => {
  try {
    authToken = token || null;

    return authToken;
  } catch (error) {
    throw new Error();
  }
};

/**
 * Destroy Token
 * For logout purpose
 */

export const destroyToken = () => {
  try {
    Cookies.remove("token");
    authToken = null;
  } catch (error) {
    throw new Error();
  }
};

const link = process.browser
  ? split(
      ({ query }) => {
        const { kind, operation }: Definition = getMainDefinition(query);

        return kind === "OperationDefinition" && operation === "subscription";
      },
      webSocketLink,
      httpLink
    )
  : httpLink;

export default withApollo(
  ({ initialState }): ApolloClient<NormalizedCacheObject> =>
    new ApolloClient({
      link: concat(authMiddleware, link),
      cache: new InMemoryCache().restore(initialState || {}),
    })
);
