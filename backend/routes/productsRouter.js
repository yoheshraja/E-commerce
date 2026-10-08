const express=require("express")
const {authMiddleWare,Authorize}=require("../middleware/authMiddleware")
const upload=require("../middleware/upload")
const {NewProduct,Products,SingleProduct,UpdateProduct,deleteProduct}=require("../controller/productController")
const router=express.Router()

router.post("/addProduct",authMiddleWare,Authorize("Admin"),upload.array("image",5),NewProduct)
router.get("/getAllProduct",Products)
router.get("/getSingleProduct/:id",SingleProduct)
router.put("/updateProduct/:id",authMiddleWare,Authorize("Admin"),upload.array("image",5),UpdateProduct)
router.delete("/deleteProduct/:id",authMiddleWare,Authorize("Admin"),deleteProduct)
router.get("/adminAccess",authMiddleWare,Authorize("Admin"),(req, res) => {return res.status(200).json({
            success: true,
            message: "Admin Access Granted"
        });
    }
);
module.exports=router