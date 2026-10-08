const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        default:null
    },
    googleId:{
        type:String,
        default:null
    },
    profileImage:{
        type:String,
        default:null
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User"
    }
},{timestamps:true})
module.exports=mongoose.model("User",userSchema)