import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

function OrderPage() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const location = useLocation();

    const [formInfo, setFormInfo] = useState(null);

    const { total, carts } = location.state;

    const onSubmit = (data) => {
        setFormInfo(data);

        console.log("Order information:", data);
        console.log("Products:", carts);
        console.log("Total:", total);
    };

    const onError = (errors) => {
        console.log("Form errors:", errors);
    };

    return (
        <div className="container mt-4">

            <div className="row">

                {/* LEFT SIDE - ORDER PRODUCTS */}
                <div className="col-md-7">

                    <h3 className="mb-4">Order Summary</h3>

                    {carts.map((cart) => (

                        <div
                            key={cart._id}
                            className="card mb-3 p-3"
                        >

                            <h5>
                                {cart.productId.name}
                            </h5>

                            <p className="mb-1">
                                Price: ₹{cart.productId.price}
                            </p>

                            <p className="mb-1">
                                Quantity: {cart.quantity}
                            </p>

                            <p className="fw-semibold">
                                Subtotal: ₹
                                {cart.productId.price * cart.quantity}
                            </p>

                        </div>

                    ))}

                    <div className="card p-3 mt-3">

                        <h4>
                            Total: ₹{total}
                        </h4>

                    </div>

                </div>


                {/* RIGHT SIDE - DELIVERY FORM */}
                <div className="col-md-5">

                    <div className="card p-4">

                        <h3 className="mb-4">
                            Delivery Address
                        </h3>

                        <form
                            onSubmit={handleSubmit(onSubmit, onError)}
                        >

                            {/* HOME */}
                            <div className="mb-3">

                                <label className="form-label">
                                    Home / Flat / Building
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("home", {
                                        required: "Home / Flat / Building is required"
                                    })}
                                />

                                {errors.home && (
                                    <p className="text-danger">
                                        {errors.home.message}
                                    </p>
                                )}

                            </div>


                            {/* STREET */}
                            <div className="mb-3">

                                <label className="form-label">
                                    Street / Area
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("street", {
                                        required: "Street / Area is required"
                                    })}
                                />

                                {errors.street && (
                                    <p className="text-danger">
                                        {errors.street.message}
                                    </p>
                                )}

                            </div>


                            {/* CITY */}
                            <div className="mb-3">

                                <label className="form-label">
                                    City
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("city", {
                                        required: "City is required"
                                    })}
                                />

                                {errors.city && (
                                    <p className="text-danger">
                                        {errors.city.message}
                                    </p>
                                )}

                            </div>


                            {/* STATE */}
                            <div className="mb-3">

                                <label className="form-label">
                                    State
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("state", {
                                        required: "State is required"
                                    })}
                                />

                                {errors.state && (
                                    <p className="text-danger">
                                        {errors.state.message}
                                    </p>
                                )}

                            </div>


                            {/* PIN CODE */}
                            <div className="mb-3">

                                <label className="form-label">
                                    PIN Code
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("pinCode", {
                                        required: "PIN Code is required",
                                        pattern: {
                                            value: /^[0-9]{6}$/,
                                            message: "PIN Code must contain 6 digits"
                                        }
                                    })}
                                />

                                {errors.pinCode && (
                                    <p className="text-danger">
                                        {errors.pinCode.message}
                                    </p>
                                )}

                            </div>


                            {/* PAYMENT METHOD */}
                            <div className="mb-4">

                                <label className="form-label">
                                    Payment Method
                                </label>

                                <select
                                    className="form-select"
                                    {...register("paymentMethod", {
                                        required: "Select a payment method"
                                    })}
                                >

                                    <option value="">
                                        Select Payment Method
                                    </option>

                                    <option value="COD">
                                        Cash on Delivery
                                    </option>

                                    <option value="ONLINE">
                                        Online Payment
                                    </option>

                                </select>

                                {errors.paymentMethod && (
                                    <p className="text-danger">
                                        {errors.paymentMethod.message}
                                    </p>
                                )}

                            </div>


                            {/* PLACE ORDER */}
                            <button
                                type="submit"
                                className="btn btn-success w-100"
                            >
                                Place Order
                            </button>

                        </form>

                    </div>

                </div>

            </div>


            {/* FORM DATA - FOR TESTING */}
            {formInfo && (

                <div className="card mt-4 p-3">

                    <h4>Entered Information</h4>

                    <pre>
                        {JSON.stringify(formInfo, null, 2)}
                    </pre>

                </div>

            )}

        </div>
    );
}

export default OrderPage;