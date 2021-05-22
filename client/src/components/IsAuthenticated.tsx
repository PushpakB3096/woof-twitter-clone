import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Redirect } from "react-router";

// gql query to fetch the current user
export const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`;

// defining prop types
interface Props {
  children?: React.ReactNode;
}

const IsAuthenticated = ({ children }: Props) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);

  // showing loading message when data is being fetched
  if (loading) return <p>Loading...</p>;
  // showing error
  if (error) return <p>{error.message}</p>;

  // if the user is not logged in, the redirect back to the landing page
  if (!data.me) {
    return <Redirect to={{ pathname: "/landing" }} />;
  }

  // if the user is logged in, the show the component protected by this nav guard
  return <>{children}</>;
};

export default IsAuthenticated;
