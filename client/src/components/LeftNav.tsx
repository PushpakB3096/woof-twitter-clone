import React from 'react'
import { Link } from 'react-router-dom'

import WoofLogo from '../styles/assets/woof-logo.png'
import "../styles/leftNav.css"

const LeftNav = () => {
    return (
        <div>
            {/* Woof logo goes here */}
            <Link to="/users">
                <img src={WoofLogo} alt="logo" style={{ width: "40px" }} />
            </Link>
            {/* Link to take user to home page */}
            <Link to="/users">
                <h2>
                    <i className="fa fa-home" aria-hidden="true"></i>
                    <span className="title">Home</span>
                </h2>
            </Link>
            {/* Link to take user to profile page */}
            <Link to="/profile">
                <h2>
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span className="title">Profile</span>
                </h2>
            </Link>
            {/* Link to take user to messages page */}
            <Link to="/messages">
                <h2>
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                    <span className="title">Messages</span>
                </h2>
            </Link>
            {/* Link to take user to notifications page */}
            <Link to="/notifications">
                <h2>
                    <i className="fa fa-bell" aria-hidden="true"></i>
                    <span className="title">Notifications</span>
                </h2>
            </Link>
            {/* Link to take user to more options */}
            <Link to="/more">
                <h2>
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                    <span className="title">More</span>
                </h2>
            </Link>
            <button style={{ marginRight: "10px", marginTop: "30px" }}>
                <span style={{ padding: "15px 70px 15px 70px" }}>Woof!</span>
            </button>
        </div>
    )
}

export default LeftNav
