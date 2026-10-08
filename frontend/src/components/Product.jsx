import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from './api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Product() {

  const [accessMessage, setAccessMessage] = useState("")
  const [accessAllowed, setAccessAllowed] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    getProduct()
  }, [])

  // Toast
  const showToast = (msg, type = "success") => {
    setMessage(msg)
    setMessageType(type)

    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  const onSubmit = async (data) => {

    const formdata = new FormData()

    formdata.append("name", data.name)
    formdata.append("price", data.price)
    formdata.append("description", data.description)
    formdata.append("stock", data.stock)
    formdata.append("category", data.category)
    formdata.append("brand", data.brand)
    formdata.append("IsActive", data.IsActive)

    if (data.image && data.image.length > 0) {
      for (let i = 0; i < data.image.length; i++) {
        formdata.append("image", data.image[i])
      }
    }

    let res

    try {

      setLoading(true)

      if (selected) {
        res = await api.put(`/updateProduct/${selected}`, formdata)
      } else {
        res = await api.post("/addProduct", formdata)
      }

      if (res.data.success) {

        showToast(
          res?.data?.message,
          "success"
        )

        reset({
          name: "",
          price: "",
          description: "",
          stock: "",
          category: "",
          brand: "",
          IsActive: "",
          image: null
        })

        setSelected(null)

        if (selected) {
          setAllProducts(prev =>
            prev.map(product =>
              product._id === selected
                ? res.data.product
                : product
            )
          )
        } else {
          setAllProducts(prev => [
            ...prev,
            res.data.product
          ])
        }
      }

    } catch (error) {

      console.log(error)

      showToast(
        error?.response?.data?.message ||
        "Something went wrong",
        "danger"
      )

    } finally {
      setLoading(false)
    }
  }

  const getProduct = async () => {

    try {

      setLoading(true)

      const res = await api.get("/getAllProduct")

      setAllProducts(res?.data.products)

    } catch (error) {

      console.log(error)

      showToast(
        error?.response?.data?.message ||
        "Can't get products",
        "danger"
      )

    } finally {

      setLoading(false)

    }
  }

  const updateProduct = async (product) => {

    setSelected(product._id)

    reset({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      IsActive: product.IsActive
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const deleteProduct = async (id, name) => {

    try {

      setLoading(true)

      const confirmed = window.confirm(
        `Are you sure want to delete product: ${name}`
      )

      if (!confirmed) {
        return
      }

      const res = await api.delete(`/deleteProduct/${id}`)

      if (res.data.success) {

        setAllProducts(prev =>
          prev.filter(product => product._id != id)
        )

        showToast(
          res?.data?.message,
          "success"
        )
      }

    } catch (error) {

      console.log(error)

      showToast(
        error?.response?.data?.message ||
        "Failed to delete product",
        "danger"
      )

    } finally {

      setLoading(false)

    }
  }

  const logout = async () => {

    try {

      console.log("working")

      const res = await api.post("/logout")

      showToast(
        res?.data?.message,
        "success"
      )

      setTimeout(() => {
        navigate("/login")
      }, 2000)

    } catch (error) {

      console.log(error)

      showToast(
        error?.response?.data?.message ||
        "Logout failed",
        "danger"
      )

    }
  }

  const checkAdminAccess = async () => {

    try {

      const res = await api.get("/adminAccess")

      if (res.data.success) {
        setAccessAllowed(true)
      }

    } catch (error) {

      setAccessAllowed(false)

      const errorMessage =
        error?.response?.data?.message ||
        "Access Denied"

      setAccessMessage(errorMessage)

      showToast(
        errorMessage,
        "danger"
      )

    } finally {

      setCheckingAccess(false)

    }
  }

  if (checkingAccess) {
    return (
      <div className="text-center mt-5">
        <p>Checking access...</p>
      </div>
    )
  }

  if (!accessAllowed) {
    return (
      <div className="container mt-5">

        {/* Access Denied Toast */}
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

      </div>
    )
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold mb-0">
          Product Management
        </h2>

      </div>

      {loading && (
        <div className="text-center mb-3">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Toast */}
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

      {/* Product Form */}
      <div className="card shadow-sm border-0 mb-5">

        <div className="card-header bg-primary text-white">

          <h4 className="mb-0">
            {selected ? "Update Product" : "Add Product"}
          </h4>

        </div>

        <div className="card-body p-4">

          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className="row g-3">

              {/* Images */}
              <div className="col-12">

                <label className="form-label fw-semibold">
                  Product Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  {...register("image", {
                    required: selected
                      ? false
                      : "Image is Required"
                  })}
                />

              </div>

              {/* Name */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Enter name"
                  className="form-control"
                  {...register("name", {
                    required: "name is Required"
                  })}
                />

              </div>

              {/* Price */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Price
                </label>

                <input
                  type="number"
                  placeholder="Enter price"
                  className="form-control"
                  {...register("price", {
                    required: "price is Required"
                  })}
                />

              </div>

              {/* Description */}
              <div className="col-12">

                <label className="form-label fw-semibold">
                  Description
                </label>

                <textarea
                  placeholder="Enter description"
                  className="form-control"
                  rows="3"
                  {...register("description", {
                    required: "description is Required"
                  })}
                />

              </div>

              {/* Stock */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Stock
                </label>

                <input
                  type="number"
                  placeholder="Enter stock"
                  className="form-control"
                  {...register("stock", {
                    required: "stock is Required"
                  })}
                />

              </div>

              {/* CATEGORY - ONLY LOGIC CHANGE */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  className="form-select"
                  {...register("category", {
                    required: "category is Required"
                  })}
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Laptop">
                    Laptop
                  </option>

                  <option value="Mobile">
                    Mobile
                  </option>

                  <option value="Toys">
                    Toys
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Books">
                    Books
                  </option>

                </select>

              </div>

              {/* Brand */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Brand
                </label>

                <input
                  type="text"
                  placeholder="Enter brand"
                  className="form-control"
                  {...register("brand", {
                    required: "brand is Required"
                  })}
                />

              </div>

              {/* IsActive */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Status
                </label>

                <select
                  className="form-select"
                  {...register("IsActive", {
                    required: "IsActive is Required"
                  })}
                >

                  <option value="">
                    Select Status
                  </option>

                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Not Active
                  </option>

                </select>

              </div>

              {/* Submit */}
              <div className="col-12">

                <button
                  type="submit"
                  className="btn btn-primary px-4"
                >
                  {selected ? "Update Product" : "Add Product"}
                </button>

                {selected && (
                  <button
                    type="button"
                    className="btn btn-secondary px-4 m-1"
                    onClick={() => {

                      setSelected(null)

                      reset({
                        name: "",
                        price: "",
                        description: "",
                        stock: "",
                        category: "",
                        brand: "",
                        IsActive: "",
                        image: null
                      })

                    }}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>

          </form>

        </div>

      </div>

      {/* Products */}
      <div>

        <h3 className="fw-bold mb-3">
          All Products
        </h3>

        <div className="row g-3">

          {allProducts.map((product) => (

            <div
              className="col-12 col-md-6 col-lg-4 shadow"
              key={product._id}
            >

              <div className="card h-100 shadow-sm border-0">

                <div className="card-body">

                  <h5 className="card-title fw-bold">
                    {product?.name}
                  </h5>

                  <p className="card-text text-muted mb-2">
                    Created: {product?.createdAt}
                  </p>

                  <div className="d-flex gap-2">

                    <button
                      onClick={() => updateProduct(product)}
                      className="btn btn-warning btn-sm"
                    >
                      Update
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product._id,
                          product.name
                        )
                      }
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Product