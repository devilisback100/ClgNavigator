import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = ({ handleLogin }) => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/users/google-login`, {
                credential: credentialResponse.credential,
            });

            if (res.data.success) {
                handleLogin(res.data.data);  // ✅ Update user state instantly
                navigate("/profile");  // Redirect after login
            } else {
                alert("Login Failed! Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An error occurred. Please check your backend.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome to CMR Navigator</h2>
                <p>Login with your Google account to continue</p>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => alert("Google Login Failed")}
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default Login;
