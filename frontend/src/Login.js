import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css"; // Importing the CSS file

function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8081/login",
                { username, password },
                { withCredentials: true }
            );
            setUser(res.data.user);
        } catch (err) {
            console.error(err.response.data.error);
        }
    };

    return (
        
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="login-button" type="submit">
                    Login
                </button>
                <Link to="/register" className="register-link">
                    Don't have an account? Register
                </Link>
            </form>
        </div>
    );
}

export default Login;
