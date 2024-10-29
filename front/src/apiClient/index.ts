import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const BACK_URL = process.env.REACT_APP_BACK_URL || "http://localhost:8080";

export const Client = new ApolloClient({
  link: new HttpLink({
    uri: BACK_URL + "/query",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
