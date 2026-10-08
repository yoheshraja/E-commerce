const express = require("express")
const Product = require("../model/product")
const fs = require("fs")
const path = require("path")
const NewProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category, brand, IsActive } = req.body;
        if (!req.files) {
            return res.json({
                success: false,
                message: "Image is Required"
            })
        }
        const images = req.files.map(file => file.filename)
        if (!name || !price || !description || !stock || !category || !brand || !IsActive) {
            return res.json({
                success: false,
                message: "Fill All Fields"
            })
        }
        const newProduct = await Product.create({
            name, price, description, stock, image: images, category, brand, IsActive
        })
        return res.status(201).json({
            success: true,
            message: "Product Created",
            product:newProduct
        })
    } catch (error) {
        console.log("Error in the Product Creation", error)
        if (req.files) {
            req.files.map(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path)
                }
            })
        }
        return res.json({
            success: true,
            message: "Can't Create Product"
        })
    }
}
const Products = async (req, res) => {
    try {
        const page = Number(req.query.page)||1;
        const limit = Number(req.query.limit)||10;
        const search = req.query.search||"";
        const category = req.query.category||"";
        const sortBy = req.query.sortBy||"price";
        const order = req.query.order||"desc";
        const filter = {}
        let sort={}
        const skip = (page - 1) * limit
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
        }
        }
        if (category) {
        filter.category=category}
        sort[sortBy]=order=="desc"?-1:1;
        const totalProducts=await Product.countDocuments(filter)
        const totalPages=Math.ceil(totalProducts/limit)
        const products=await Product.find(filter).sort(sort).skip(skip).limit(limit)
        let hasPrevious=page>1
        let hasNextPage=page<totalPages
        res.json({
            success:true,
            pagination:{
                pages:page,
                limit:limit,
                hasNextPage:hasNextPage,
                hasPrevious:hasPrevious,
                totalPages:totalPages
            },
            products:products
        })
    } catch (error) {
        console.log("Error in Get All Product", error)
        return res.json({
            success: false,
            message: "Can't get Product"
        })
    }
}
const SingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        return res.status(200).json({
            success: true,
            product: product
        })
    } catch (error) {
        console.log("Error in Get Single Product", error)
        return res.json({
            success: true,
            message: "Can't get Product"
        })
    }
}
const UpdateProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        const { name, price, description, stock, category, brand, IsActive } = req.body;
        if (!product) {
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        const fields = {}
        if (name != undefined) {
            fields.name = name
        }
        if (price != undefined) {
            fields.price = price
        }
        if (description != undefined) {
            fields.description = description
        }
        if (stock != undefined) {
            fields.stock = stock
        }
        if (category != undefined) {
            fields.category = category
        }
        if (brand != undefined) {
            fields.brand = brand
        }
        if (IsActive != undefined) {
            fields.IsActive = IsActive
        }
        if (req.files && req.files.length > 0) {
            fields.image = req.files.map(file => file.filename);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true })
        if (req.files && req.files.length > 0) {

            product.image.forEach(imageName => {

                const oldImage = path.join(
                    __dirname,
                    "../Uploads",
                    imageName
                );

                if (fs.existsSync(oldImage)) {
                    fs.unlinkSync(oldImage);
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product Updated",
            product: updateProduct

        })
    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        return res.status(500).json({
            success: false,
            message: "Product Not Update"
        })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        if (product.image && product.image.length > 0) {
            product.image.map((image) => {
                const img = path.join(__dirname, "../Uploads", image)
                if (fs.existsSync(img)) {
                    fs.unlinkSync(img)
                }
            })
        }

        await Product.findByIdAndDelete(id)
        return res.json({
            success: true,
            message: "Product Deleted"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Product Not Deleted"
        })
    }
}
module.exports = {
    NewProduct,
    deleteProduct,
    SingleProduct,
    UpdateProduct,
    Products
}