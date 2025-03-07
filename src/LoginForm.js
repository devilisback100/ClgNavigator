import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { TbPasswordUser, TbPassword } from "react-icons/tb";
import "./LoginForm.css";

export default function Login() {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-form-toggle">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
                        Login
                    </button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
                        Signup
                    </button>
                </div>
                {isLogin ? (
                    <div className="login-form">
                        <h2>Login</h2>
                        <div className="login-input-group">
                            <FaRegUser className="login-icon" />
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="login-input-group">
                            <TbPasswordUser className="login-icon" />
                            <input type="password" placeholder="Password" />
                        </div>
                        <a href="#" className="login-forgot">Forgot password?</a>
                        <button>Login</button>
                        <p>
                            Not a member?{" "}
                            <a href="#" onClick={() => setIsLogin(false)}>
                                Signup now
                            </a>
                        </p>
                    </div>
                ) : (
                    <div className="login-form">
                        <h2>Signup</h2>
                        <div className="login-input-group">
                            <FaRegUser className="login-icon" />
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="login-input-group">
                            <TbPassword className="login-icon" />
                            <input type="password" placeholder="Password" />
                        </div>
                        <div className="login-input-group">
                            <TbPassword className="login-icon" />
                            <input type="password" placeholder="Confirm Password" />
                        </div>
                        <button>Sign up</button>
                    </div>
                )}
            </div>
        </div>
    );
}
