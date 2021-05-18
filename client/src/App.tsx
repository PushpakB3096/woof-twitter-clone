import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Users from "./components/Users";
import Landing from "./components/Landing";

import "./App.css";

// config to connect to backend
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URI}`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/users">
            <Users />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
