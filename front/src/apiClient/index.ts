import { ApolloClient, InMemoryCache } from "@apollo/client";

const BACK_URL = process.env.REACT_APP_BACK_URL || "http://localhost:8080";

export const Client = new ApolloClient({
  uri: BACK_URL + "/query",
  cache: new InMemoryCache(),
});
