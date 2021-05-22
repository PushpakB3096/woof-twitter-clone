import React from 'react'
import { gql, useQuery } from "@apollo/client";
import CreateProfile from '../components/CreateProfile';

// query to fetch the loggedin user's data
export const ME_QUERY = gql`
    query currentProfile {
        currentProfile {
            id
            bio
            location
            website
            avatar
        }
    }
`
const Profile = () => {
    const { loading, error, data } = useQuery(ME_QUERY);

    if (loading) return <p>Loading...</p>

    if (error) return <p>{error.message}</p>

    console.log(data)

    return (
        <div className="container">
            <h1>Profile</h1>
            <CreateProfile />
        </div>
    )
}

export default Profile
