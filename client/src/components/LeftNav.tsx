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
            <Link to="/users">
                <h2>
                    <i className="fa fa-home" aria-hidden="true"></i>
                    <span className="title">Home</span>
                </h2>
            </Link>
        </div>
    )
}

export default LeftNav
