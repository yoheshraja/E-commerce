
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [message, setMessage] = useState("");

    const { setUser } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {

        try {

            const res = await api.post("/login", data);
            setMessage(res?.data?.message);
            if (res.data.success) {
            setUser(res.data.user);

    if (res.data.user.role === "Admin") {
        setTimeout(() => {
            navigate("/admin");
        }, 1500);
    } else {
        setTimeout(() => {
        navigate("/");
          }, 1500);
    }
}
        } catch (error) {

            setMessage(
                error?.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">

            <div
                className="card shadow-lg border-0"
                style={{
                    width: "100%",
                    maxWidth: "400px"
                }}
            >

                <div className="card-body p-4">

                    <div className="text-center mb-4">
                        <h2 className="fw-bold">
                            Login
                        </h2>

                        <p className="text-muted mb-0">
                            Login to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />

                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email.message}
                                </div>
                            )}

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required"
                                })}
                            />

                            {errors.password && (
                                <div className="invalid-feedback">
                                    {errors.password.message}
                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Login
                        </button>
                        

                    </form>
                    <div className="mt-3">
    <button
        type="button"
        className="btn btn-outline-dark w-100"
        onClick={() => {
            window.location.href = "http://localhost:3000/api/google";
        }}
    >
        Continue with Google
    </button>
</div>
                    <div className="text-center mt-3">
    <span>Don't have an account? </span>
    <Link to="/register">
        Register
    </Link>
</div>

                    {message && (
                        <div className="alert alert-info mt-3 mb-0 text-center">
                            {message}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Login;
