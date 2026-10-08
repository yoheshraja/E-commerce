const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    image:{type:[String],
        default:[]
    },
    name:String,
    price:Number,
    description:String,
    stock:Number,
    category:String,
    brand:String,
    IsActive:{
        type:String,
        enum:["true","false"],
        required:true
    }
},{timestamps:true})
module.exports=mongoose.model("Product",productSchema)