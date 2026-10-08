const Product = require("../model/product")
const Cart = require("../model/cart")

const AddToCart = async (req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user._id
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        if (product.stock < 1) {
            return res.status(400).json({
                success: false,
                message: "Out of stock"
            })
        }
        const cart = await Cart.findOne({
            userId,
            productId
        })
        if (cart) {
            if (cart.quantity >= product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum stock reached"
                })
            }
            cart.quantity += 1
            await cart.save()
            return res.status(200).json({
                success: true,
                message: "Quantity increased"
            })
        }

        await Cart.create({
            userId,
            productId,
            quantity: 1
        })
        return res.status(201).json({
            success: true,
            message: "Product added to cart"
        })
    } catch (error) {
        console.log("Add To Cart Error:", error)
     return res.status(500).json({
            success: false,
           message: "Failed to add product to cart"
        })
    }
}
const getCart = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await Cart.find({ userId }).populate("productId")
        return res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        console.log("Get Cart Error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to get cart"
        })
    }
}
const increaseCart = async (req, res) => {
    try {
        const cartId = req.params.id
        const userId = req.user._id
        const cart = await Cart.findOne({_id: cartId,userId}) .populate("productId")
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        if (cart.quantity >= cart.productId.stock) {
            return res.status(400).json({
                success: false,
                message: "Maximum stock reached"
            })
        }
        cart.quantity += 1
        await cart.save()
        return res.status(200).json({
            success: true,
            message: "Quantity increased"
        })

    } catch (error) {

        console.log("Increase Cart Error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to increase quantity"
        })
    }
}

const decreaseCart = async (req, res) => {
    try {
        const cartId = req.params.id
        const userId = req.user._id
        const cart = await Cart.findOne({
            _id: cartId,
            userId
        })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        if (cart.quantity > 1) {
            cart.quantity -= 1
            await cart.save()
        }else{
             return res.status(200).json({
            success: true,
            message: "minimum quantity is one"
        })
        }
        return res.status(200).json({
            success: true,
            message: "Quantity decreased"
        })

    } catch (error) {

        console.log("Decrease Cart Error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to decrease quantity"
        })
    }
}
const removeCart = async (req, res) => {
    try {
        const cartId = req.params.id
        const userId = req.user._id
        const cart = await Cart.findOneAndDelete({
            _id: cartId,
            userId
        })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
   }
        return res.status(200).json({
            success: true,
            message: "Cart item removed"
           })

    } catch (error) {
        console.log("Remove Cart Error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to remove cart item"
        })
 }
}
const removeallCart = async (req, res) => {
    try {
        const userId = req.user._id
        await Cart.deleteMany({
            userId
        })
        return res.status(200).json({
            success: true,
            message: "All cart items removed"
        })

    } catch (error) {
        console.log("Clear Cart Error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        })
    }
}


module.exports = {
    AddToCart,
    getCart,
    increaseCart,
    decreaseCart,
    removeCart,
    removeallCart
}