import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { AppRoutes } from "routes";
import { RecoilRoot } from "recoil";
import { Client } from "apiClient";

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={Client}>
        <RecoilRoot>
          <AppRoutes />
        </RecoilRoot>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
