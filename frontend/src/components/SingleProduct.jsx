import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from './api'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from './Navbar';

function SingleProduct() {

    const { user, authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProduct] = useState(null)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        getSingleProduct()
    }, [id])

    const showToast = (msg, type = "success") => {
        setMessage(msg)
        setMessageType(type)

        setTimeout(() => {
            setMessage("")
        }, 3000)
    }

    const getSingleProduct = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/getSingleProduct/${id}`)
            setProduct(res?.data.product)
        } catch (error) {
            console.log(error)
            showToast(
                error?.response?.data?.message || "Failed to get product",
                "danger"
            )
        } finally {
            setLoading(false)
        }
    }

    const AddToCart = async (productId) => {
        try {
            if (authLoading) {
                return;
            }

            if (!user) {
                navigate("/login");
                return;
            }

            // setTimeout(() => {
            // setLoading(true)
            // }, 2000);
            setLoading(true)

            const res = await api.post(`/addCart/${productId}`)

            showToast(
                res?.data?.message,
                "success"
            )

        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to add product",
                "danger"
            )

        } finally {
            setLoading(false)
        }
    }

    const BuyNow = (productId) => {
        if (authLoading) {
            return;
        }

        if (!user) {
            navigate("/login");
            return;
        }

        console.log(productId)
    }

    return (
        <>
            <div className="container-fluid px-3 px-lg-5 py-4">

                <Navbar/>

                {/* Bootstrap Toast */}
                {message && (
                    <div
                        className="toast-container position-fixed top-0 end-0 p-3"
                        style={{ zIndex: 9999 }}
                    >
                        <div
                            className={`toast show text-bg-${messageType}`}
                            role="alert"
                        >
                            <div className="d-flex">

                                <div className="toast-body">
                                    {message}
                                </div>

                                <button
                                    type="button"
                                    className="btn-close me-2 m-auto"
                                    onClick={() => setMessage("")}
                                ></button>

                            </div>
                        </div>
                    </div>
                )}

                <Link
                    to="/"
                    className="btn btn-outline-secondary mb-3"
                >
                    Back
                </Link>

                {loading && (
                    <p>Loading...</p>
                )}

                {products && (
                    <div className="row g-4">

                        {/* ================= DESKTOP IMAGES ================= */}
                        <div className="col-lg-6 d-none d-lg-block">

                            <div className="row g-2">

                                {products?.image.map((img, index) => (

                                    <div
                                        key={index}
                                        src={`http://localhost:3000/uploads/${img}`}
                                        className="col-6"
                                    >
                                        <div
                                            className="border rounded-2 overflow-hidden bg-light"
                                            style={{
                                                height: "250px"
                                            }}
                                        >
                                            <img
                                                src={img}
                                                className="w-100 h-100"
                                                alt="Image Not Found"
                                                style={{
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </div>
                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* ================= MOBILE + TABLET IMAGES ================= */}
                        <div className="col-12 d-lg-none">

                            <div
                                className="d-flex flex-nowrap overflow-auto gap-2 pb-2"
                                style={{
                                    scrollbarWidth: "thin"
                                }}
                            >

                                {products?.image.map((img, index) => (

                                    <div
                                        key={index}
                                        src={`http://localhost:3000/uploads/${img}`}
                                        className="flex-shrink-0"
                                        style={{
                                            width: "240px"
                                        }}
                                    >

                                        <div
                                            className="border rounded-2 overflow-hidden bg-light"
                                            style={{
                                                height: "250px"
                                            }}
                                        >

                                            <img
                                                src={`http://localhost:3000/uploads/${img}`}
                                                className="w-100 h-100"
                                                alt="Image Not Found"
                                                style={{
                                                    objectFit: "contain"
                                                }}
                                            />

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* ================= PRODUCT INFORMATION ================= */}
                        <div className="col-12 col-lg-6">

                            <div className="card border-0">

                                <div className="card-body pt-0">

                                    <h2 className="fw-bold mb-3">
                                        {products.name}
                                    </h2>

                                    <h3 className="fw-bold text-primary mb-4">
                                        ₹{products.price}
                                    </h3>

                                    <p className="mb-3">
                                        <strong>Description:</strong>
                                        <br />
                                        {products.description}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Stock:</strong>{" "}
                                        {products.stock}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Category:</strong>{" "}
                                        {products.category}
                                    </p>

                                    <p className="mb-4">
                                        <strong>Brand:</strong>{" "}
                                        {products.brand}
                                    </p>

                                    <div className="d-flex gap-2">

                                        <button
                                            onClick={() =>
                                                AddToCart(products._id)
                                            }
                                            className="btn btn-primary px-4"
                                        >
                                            Add To Cart
                                        </button>

                                        <button
                                            onClick={() =>
                                                BuyNow(products._id)
                                            }
                                            className="btn btn-warning px-4"
                                        >
                                            Buy Now
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </>
    )
}

export default SingleProduct