import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

function Filter({ onFilterChange }) {

    const { register, watch } = useForm({
        defaultValues: {
            search: "",
            category: "",
            sortBy: "price",
            order: "desc"
        }
    });

    const search = watch("search");
    const category = watch("category");
    const sortBy = watch("sortBy");
    const order = watch("order");

    useEffect(() => {
        onFilterChange({
            search,
            category,
            sortBy,
            order
        });
    }, [search, category, sortBy, order, onFilterChange]);

   return (
    <div className="container my-4 px-3">
        <div className="card border-0 shadow-sm">
            <div className="card-body">

                <div className="row g-3">

                    {/* Search */}
                    <div className="col-12 col-lg-4">
                        <label className="form-label fw-semibold">
                            Search Product
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            {...register("search")}
                        />
                    </div>

                    {/* Category */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <label className="form-label fw-semibold">
                            Category
                        </label>

                        <select
                            className="form-select"
                            {...register("category")}
                        >
                            <option value="">All Categories</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Toys">Toys</option>
                            <option value="Sports">Sports</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label className="form-label fw-semibold">
                            Sort By
                        </label>

                        <select
                            className="form-select"
                            {...register("sortBy")}
                        >
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                            <option value="brand">Brand</option>
                        </select>
                    </div>

                    {/* Order */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <label className="form-label fw-semibold">
                            Order
                        </label>

                        <select
                            className="form-select"
                            {...register("order")}
                        >
                            <option value="desc">High to Low</option>
                            <option value="asc">Low to High</option>
                        </select>
                    </div>

                </div>

            </div>
        </div>
    </div>
);
}

export default Filter;