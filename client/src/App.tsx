import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./App.css";

// config to connect to backend
const client = new ApolloClient({
  uri: `${process.env.BACKEND_URI}`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>App</div>
    </ApolloProvider>
  );
}

export default App;
