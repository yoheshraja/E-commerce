const express=require("express")
const router=express.Router()
const {authMiddleWare,checkAuth}=require("../middleware/authMiddleware")
const {AddToCart,
   getCart,
   increaseCart,
   decreaseCart,
   removeCart,
   removeallCart}=require("../controller/CartController")
router.get("/checkAuth", authMiddleWare, checkAuth)
router.post("/addCart/:productId", authMiddleWare, AddToCart)
router.get("/getCart", authMiddleWare, getCart)
router.put("/increase/:id", authMiddleWare, increaseCart)
router.put("/decrease/:id", authMiddleWare, decreaseCart)
router.delete("/deleteCart/:id", authMiddleWare, removeCart)
router.delete("/clearAll", authMiddleWare, removeallCart)

module.exports=router