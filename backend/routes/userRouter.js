const express=require("express")
const router=express.Router()
const {register,login,logout,getAllUsers,changeRole,deleteUser, refreshToken}=require("../controller/userController")
const passport=require("../middleware/passport")
const {generateJwt}=require("../controller/userController")
const  {authMiddleWare,Authorize}=require("../middleware/authMiddleware")

router.post("/register",register)
router.post("/login",login)
router.get("/google",passport.authenticate("google",{scope:["profile","email"],prompt:"consent"}))
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${process.env.CLIENT_URL}/login`,session:false}),
(req,res)=>{
    generateJwt(req.user,res)
    res.redirect(`${process.env.CLIENT_URL}/`)
})

router.post("/logout",logout)
router.post("/refresh", refreshToken);
router.get("/getAllUsers",authMiddleWare,Authorize("Admin"),getAllUsers);
router.put("/changeToAdmin/:id",authMiddleWare,Authorize("Admin"),changeRole);
router.delete("/deleteUser/:id",authMiddleWare,Authorize("Admin"),deleteUser);
module.exports=router