import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setContext } from "apollo-link-context";

import Users from "./components/Users";
import Landing from "./components/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import IsAuthenticated from "./components/IsAuthenticated";

import "./App.css";
import Profile from "./pages/Profile";

// config to connect to backend
const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_BACKEND_URI}`,
});

const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);

const client = new ApolloClient({
  link: link as any,
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
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          {/* the routes inside this will require authentication to access */}
          <IsAuthenticated>
            <Route exact path="/users">
              <Users />
            </Route>
            <Route exact path="/landing">
              <Landing />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
          </IsAuthenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
