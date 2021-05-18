import React from "react";
import { gql, useQuery } from "@apollo/client";

// gql query to fetch all users
const USERS_QUERY = gql`
  query USERS_QUERY {
    allUsers {
      id
      name
    }
  }
`;

interface User {
  id: number;
  name: string;
}

const Users = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      {data.allUsers.map((user: User) => (
        <p>{user.name}</p>
      ))}
    </div>
  );
};

export default Users;
