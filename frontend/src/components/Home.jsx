import React, { useEffect, useState, useCallback } from "react";
import api from "./api";
import { Link } from "react-router-dom";
import Filter from "./Filter";
import Navbar from "./Navbar";

function Home() {
    const [products, setProduct] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        sortBy: "price",
        order: "desc"
    });

    // Pagination state
    const [pagination, setPagination] = useState({
        totalPages: 1,
        hasNextPage: false,
        hasPrevious: false
    });

    const [page, setPage] = useState(1);
    const limit = 10;

    // Get products whenever filter or page changes
    useEffect(() => {
        getProduct();
    }, [filters, page]);

    // Receive filter values from Filter component
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setPage(1);
    }, []);

    // Fetch products
    const getProduct = async () => {
        try {
            setLoading(true);

            const res = await api.get("/getAllProduct", {
                params: {
                    ...filters,
                    page,
                    limit
                }
            });

            if (res.data.success) {
                setProduct(res.data.products);

                setPagination({
                    totalPages: res.data.pagination.totalPages,
                    hasNextPage: res.data.pagination.hasNextPage,
                    hasPrevious: res.data.pagination.hasPrevious
                });
            }

        } catch (error) {
            console.log(error);

            setMessage(
                error?.response?.data?.message ||
                "Unable to fetch products"
            );
        } finally {
            setLoading(false);
        }
    };

    // Create page number array
    const pageNumbers = Array.from(
        { length: pagination.totalPages },
        (_, index) => index + 1
    );

    return (
        
        <div className="container-fluid px-0">
<Navbar/>
            {/* Heading */}
            <div className="container mt-4 mb-3">
                <h2 className="fw-bold">Products</h2>
            </div>

            {/* Filter */}
            <Filter
                onFilterChange={handleFilterChange}
            />

            {/* Loading */}
            {loading && (
                <div className="text-center my-4">
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

            {/* Products */}
            <div className="container px-3">

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">

                    {products.map((product) => (

                        <div
                            className="col"
                            key={product._id}
                        >
                            <div className="card h-100 shadow-sm">

                                {/* Product image */}
                                <img
                                    src={`http://localhost:3000/uploads/${product.image[0]}`}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{
                                        height: "180px",
                                        objectFit: "contain"
                                    }}
                                />

                                {/* Product body */}
                                <div className="card-body d-flex flex-column p-3">

                                    <h6
                                        className="card-title mb-2"
                                        style={{
                                            minHeight: "48px"
                                        }}
                                    >
                                        {product.name}
                                    </h6>

                                    <p className="card-text fw-semibold mb-3">
                                        ₹{product.price}
                                    </p>

                                    <Link
                                        to={`/singleProduct/${product._id}`}
                                        className="btn btn-primary btn-sm mt-auto w-100"
                                    >
                                        View Product
                                    </Link>

                                </div>

                            </div>
                        </div>

                    ))}

                </div>

                {/* No products */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-5">
                        <h5 className="text-muted">
                            No products found
                        </h5>
                    </div>
                )}

            </div>

            {/* Message */}
            {message && (
                <div className="container mt-3">
                    <div className="alert alert-danger">
                        {message}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="container mt-4 mb-5">

                <nav>
                    <ul className="pagination justify-content-center flex-wrap">

                        {/* Previous */}
                        <li
                            className={`page-item ${
                                !pagination.hasPrevious
                                    ? "disabled"
                                    : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                disabled={!pagination.hasPrevious}
                                onClick={() =>
                                    setPage(prev => prev - 1)
                                }
                            >
                                Previous
                            </button>
                        </li>

                        {/* Page numbers */}
                        {pageNumbers.map((number) => (

                            <li
                                key={number}
                                className={`page-item ${
                                    page === number
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPage(number)}
                                >
                                    {number}
                                </button>
                            </li>

                        ))}

                        {/* Next */}
                        <li
                            className={`page-item ${
                                !pagination.hasNextPage
                                    ? "disabled"
                                    : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                disabled={!pagination.hasNextPage}
                                onClick={() =>
                                    setPage(prev => prev + 1)
                                }
                            >
                                Next
                            </button>
                        </li>

                    </ul>
                </nav>

            </div>

        </div>
    );
}

export default Home;