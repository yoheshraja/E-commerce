import React, { useEffect, useState } from 'react'
import api from './api'
import {Link,useNavigate}from 'react-router-dom'
import OrderPage from './OrderPage'
function AddToCart() {
    const navigate=useNavigate()
    const [carts, setCart] = useState([])
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const [loading, setLoading] = useState(false)
    const [validatecart,setValidateCart]=useState(true)
    const showToast = (msg, type = "success") => {
        setMessage(msg)
        setMessageType(type)

        setTimeout(() => {
            setMessage("")
        }, 3000)
    }

    useEffect(() => {
        getCart()
    }, [])

    const getCart = async () => {
        try {
            setLoading(true)
            const res = await api.get("/getCart")
            setCart(res.data.cart)
        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to get cart",
                "danger"
            )
        } finally {
            setLoading(false)
        }
    }

    const IncreaseQty = async (id) => {
        try {

            setLoading(true)
            const res = await api.put(`/increase/${id}`)

            showToast(
                res.data.message,
                "success"
            )

            if (res.data.success) {
                await getCart()
            }

        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to increase quantity",
                "danger"
            )

        } finally {
            setLoading(false)
        }
    }

    const DecreaseQty = async (id) => {
        try {
            setLoading(true)

            const res = await api.put(`/decrease/${id}`)

            showToast(
                res.data.message,
                "success"
            )

            if (res.data.success) {
                await getCart()
            }

        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to decrease quantity",
                "danger"
            )

        } finally {
            setLoading(false)
        }
    }

    const removeCart = async (id) => {
        try {
            setLoading(true)

            const res = await api.delete(`/deleteCart/${id}`)

            showToast(
                res.data.message,
                "success"
            )

            if (res.data.success) {
                await getCart()
            }

        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to remove product",
                "danger"
            )

        } finally {
            setLoading(false)
        }
    }

    const removeAllCart = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to remove all cart items?"
        )

        if (!confirmed) {
            return
        }

        try {
            setLoading(true)

            const res = await api.delete("/clearAll")

            showToast(
                res.data.message,
                "success"
            )

            if (res.data.success) {
                setCart([])
            }

        } catch (error) {
            console.log(error)

            showToast(
                error?.response?.data?.message || "Failed to clear cart",
                "danger"
            )

        } finally {
            setLoading(false)
        }
    }
    // validate the cart has products
    useEffect(()=>{
        if (carts.length>0) {
        setValidateCart(false)
    }else{
        setValidateCart(true)
    }
    },[carts])
    const order=()=>{
        const total=carts.reduce((sum,cart)=>sum+cart.productId.price*cart.quantity,0)
        navigate("/order",{state:{total:total,carts}})
    }
    return (
        <>
            <div className="container-fluid px-3 py-4">

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

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2 className="mb-0">
                        Cart
                    </h2>

                    <button
                        onClick={removeAllCart}
                        className="btn btn-outline-danger btn-sm"
                    >
                        Remove All
                    </button>

                </div>
                <Link to="/" className='btn btn-outline-secondary mb-3'>Back</Link>
                {carts.length===0 && (<h2 className='d-flex justify-content-center'>Cart is Empty</h2>)}
                {loading && (
                    <div className="text-center mb-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>
                    </div>
                )}

                <div className="d-flex flex-column gap-3">

                    {carts.map((cart) => (

                        <div
                            className="card w-100 shadow-sm border-0"
                            style={{ height: "200px" }}
                            key={cart._id}
                        >

                            <div className="row g-0 h-100">

                                {/* IMAGE */}
                                <div className="col-4 col-md-2 d-flex align-items-center justify-content-center">

                                    <img
                                        src={`http://localhost:3000/uploads/${cart.productId.image[0]}`}
                                        className="img-fluid rounded"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "contain"
                                        }}
                                        alt={cart.productId.name}
                                    />

                                </div>

                                {/* PRODUCT INFORMATION */}
                                <div className="col-8 col-md-10 h-100">

                                    <div className="card-body p-3 h-100">

                                        <h5 className="card-title mb-2">
                                            {cart.productId?.name}
                                        </h5>

                                        <p className="card-text fw-semibold mb-2">
                                            ₹{cart.productId.price}
                                        </p>

                                        <p className="card-text mb-2 text-truncate">
                                            {cart.productId.description
                                                .split(" ")
                                                .slice(0, 10)
                                                .join(" ")}
                                            {cart.productId.description.split(" ").length > 10
                                                ? "..."
                                                : ""}
                                        </p>

                                        <div className="d-flex gap-3 mb-2 flex-wrap">

                                            <span>
                                                <strong>Stock:</strong>{" "}
                                                {cart.productId.stock}
                                            </span>

                                            <span>
                                                <strong>Category:</strong>{" "}
                                                {cart.productId.category}
                                            </span>

                                            <span>
                                                <strong>Brand:</strong>{" "}
                                                {cart.productId.brand}
                                            </span> 
                                        
                                            <p>Sub Total: {cart.productId.price*cart.quantity}</p>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">

                                            <button
                                                onClick={() =>
                                                    DecreaseQty(cart._id)
                                                }
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                -
                                            </button>

                                            <span className="fw-semibold">
                                                {cart.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    IncreaseQty(cart._id)
                                                }
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() =>
                                                    removeCart(cart._id)
                                                }
                                                className="btn btn-outline-danger btn-sm ms-2"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
                    <div>
                        <button disabled={validatecart} className='btn btn-outline-success mt-3'  onClick={order}>Place Order</button>
                    </div>
            </div>
        </>
    )
}

export default AddToCart