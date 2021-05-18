import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Users from "./components/Users";
import "./App.css";

// config to connect to backend
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URI}`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Users />
      </div>
    </ApolloProvider>
  );
}

export default App;
