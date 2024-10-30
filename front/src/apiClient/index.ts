import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const BACK_URL = process.env.REACT_APP_BACK_URL || "http://localhost:8080";

const httpLink = new HttpLink({
  uri: BACK_URL + "/query",
});

const authLink = setContext((_, { headers }) => {
  const TOKEN = window.localStorage.getItem("_tarikihongan_token");
  const AUTHORIZATION = TOKEN ? `Bearer ${TOKEN}` : "";
  return {
    headers: {
      ...headers,
      Authorization: AUTHORIZATION,
    },
  };
});

export const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
