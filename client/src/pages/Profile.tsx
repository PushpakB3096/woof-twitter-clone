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
            user {
                name
                email
            }
        }
    }
`
const Profile = () => {
    const history = useHistory();
    const { loading, error, data } = useQuery(ME_QUERY);

    if (loading) return <p>Loading...</p>

    if (error) return <p>{error.message}</p>
    console.log(data.currentProfile)
    return (
        <div className="primary">
            <div className="left">Left Pane</div>
            <div className="profile">
                <div className="profile-info">
                    <div className="profile-head">
                        {/* arrow that will take you back to the previous page */}
                        <span className="back-arrow" onClick={() => history.goBack()}>
                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        </span>
                        {/* User's name appear here */}
                        <span className="nickname">
                            <h3>{data.currentProfile.user.name}</h3>
                        </span>
                    </div>
                    {/* show avatar here */}
                    <div className="avatar">
                        <i className="fa fa-user fa-5x" aria-hidden="true"></i>
                    </div>
                    {/* profile create/edit section */}
                    <div className="make-profile">
                        {/* Show update button if the profile already exists with an ID */}
                        {data.currentProfile && data.currentProfile.id ? <UpdateProfile /> : <CreateProfile />}
                    </div>

                    <h3 className="name">{data.currentProfile.user.name}</h3>

                    {data.currentProfile && data.currentProfile.id &&
                        <p>
                            <i className="fas fa-link"></i>
                            <Link to={{ pathname: `http://${data.currentProfile.website}` }} target="_blank">
                                {data.currentProfile.website}
                            </Link>
                        </p>
                    }
                    <div className="followers">
                        <p>384 following</p>
                        <p>10202 followers</p>
                    </div>
                </div>
            </div>
            <div className="right">
                Right Pane
            </div>
        </div>
    )
}

export default Profile
