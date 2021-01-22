import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import UserService from "../services/user.service";

const Home = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{"Welcome to Home page - " + currentUser.user.firstName}</h3>
            </header>
        </div>
    );
};

export default Home;