import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";
import { Link } from "react-router-dom";
function Register() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {

        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                message: "Passwords must match"
            });
            return;
        }

        try {
            const res = await api.post("/register", data);

            setMessage(res?.data?.message);

        } catch (error) {
            setMessage(
                error?.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">

            <div
                className="card shadow-lg border-0"
                style={{ width: "100%", maxWidth: "450px" }}
            >

                <div className="card-body p-4 p-md-5">

                    <div className="text-center mb-4">
                        <h2 className="fw-bold">
                            Create Account
                        </h2>

                        <p className="text-muted mb-0">
                            Register to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">
                                Name
                            </label>

                            <input
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                placeholder="Enter your name"
                                {...register("name", {
                                    required: "Name is required"
                                })}
                            />

                            {errors.name && (
                                <div className="invalid-feedback">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Email */}
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

                        {/* Phone */}
                        <div className="mb-3">
                            <label className="form-label">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                className={`form-control ${
                                    errors.phoneNumber ? "is-invalid" : ""
                                }`}
                                placeholder="Enter your phone number"
                                {...register("phoneNumber", {
                                    required: "Phone number is required"
                                })}
                            />

                            {errors.phoneNumber && (
                                <div className="invalid-feedback">
                                    {errors.phoneNumber.message}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
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

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="form-label">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                className={`form-control ${
                                    errors.confirmPassword
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="Confirm your password"
                                {...register("confirmPassword", {
                                    required:
                                        "Confirm password is required"
                                })}
                            />

                            {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                    {errors.confirmPassword.message}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold"
                        >
                            Create Account
                        </button>

                    </form>
                    <div className="text-center mt-3">
    <span>Already have an account? </span>
    <Link to="/login">
        Login
    </Link>
</div>
                    {message && (
                        <div className="alert alert-info text-center mt-4 mb-0">
                            {message}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Register;