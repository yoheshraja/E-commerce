const express=require("express")
const User =require("../model/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const generateJwt=(user,res)=>{
    const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m"
    }
  );

  // Refresh Token
  const refreshToken = jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );
  res.cookie("token", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: false,
    sameSite: "lax"
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7*24*60*60* 1000,
    secure: false,
    sameSite: "lax"
  });
}
const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if (!name || !email || !password){
        return res.json({
            success:false,
            message:"Fill all Fields"
        })
    }
    const ExistUser=await User.findOne({email})
    if(ExistUser){
        return res.json({
            success:false,
            message:"User already Exist"
        })
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const newUser=User({
        name,email,password:hashedPassword
    })
    await newUser.save()
    return res.status(201).json({
        success:true,
        message:"Registered Successfully"
    })
}
const login=async(req,res) => {
    const {email,password}=req.body;
    const ExistUser=await User.findOne({email})
    if(!ExistUser){
        return res.status(404).json({
            success:false,
            message:"User Not Found"
        })
    }
    const match=await bcrypt.compare(password,ExistUser.password)
    if(!match){
        return res.json({
            success:false,
            message:"Password is Invalid"
        })
    }
    generateJwt(ExistUser,res)
    
    return res.status(200).json({
        success: true,
        message: "Login Successful",
         user: {
            _id: ExistUser._id,
            name: ExistUser.name,
            email: ExistUser.email,
            phoneNumber: ExistUser.phoneNumber,
            role: ExistUser.role
        }
    });
}
const logout=(req,res)=>{
   res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
      return res.status(200).json({
        success: true,
        message: "Logout Successful"
    });
}
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.log("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Can't get users"
    });
  }
};
const changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update role"
    });
  }
};

const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found"
      });
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );
    const user = await User.findById(decode.userId)
      .select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false,
      sameSite: "lax"
    });
    return res.status(200).json({
      success: true,
      message: "Access token refreshed"
    });
  } catch (error) {
    console.log("Refresh Token Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};
module.exports={
    generateJwt,login,register,logout,getAllUsers,changeRole,deleteUser,refreshToken
}