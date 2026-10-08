const jwt=require("jsonwebtoken")
const User=require("../model/user")

const authMiddleWare=async (req,res,next) => {
    const token=req.cookies.token
    if (!token) {
        return res.status(404).json({
            success:false,
            message:"Please Login First"
        })
    }
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decode.userId).select("-password")
        if (!user) {
            return res.status(404).json({
            success:false,
            message:"User Not Found"
        })
        }
        req.user=user
        next()
    } catch (error) {
        console.log("Error in the authentication middleware",error)
         return res.json({
            success:false,
            message:"Invalid or Expired Token"
        })
    }
}
const Authorize= (...getAuth) => {
    return (req,res,next)=>{
         if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please Login First"
            });
        }
        if (!getAuth.includes(req.user.role)) {
            return res.status(403).json({
                success:false,
                message:"Access Denide" 
            })
        }
        next()
    }
}
const checkAuth = async (req,res) => {
    try {
        return res.status(200).json({
            success: true,
            user:req.user
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
module.exports={
    authMiddleWare,
    Authorize,
    checkAuth
}