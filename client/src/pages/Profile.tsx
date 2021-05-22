import React from 'react'
import { Link, useHistory } from "react-router-dom"
import { gql, useQuery } from "@apollo/client";

import CreateProfile from '../components/CreateProfile';
import UpdateProfile from '../components/UpdateProfile';
import "../styles/profile.css"
import "../styles/primary.css"

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
    const history = useHistory();
    const { loading, error, data } = useQuery(ME_QUERY);

    if (loading) return <p>Loading...</p>

    if (error) return <p>{error.message}</p>

    return (
        <div className="primary">
            <div className="left">Left Nav</div>
            <div className="profile">
                <div className="profile-info">
                    <div className="profile-head">
                        {/* arrow that will take you back to the previous page */}
                        <span className="back-arrow" onClick={() => history.goBack()}>
                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
            </div>
            {/* Show update button if the profile already exists with an ID */}
            {data.currentProfile && data.currentProfile.id ? <UpdateProfile /> : <CreateProfile />}
        </div>
    )
}

export default Profile
