require("dotenv").config()
const express=require("express")
const cors=require("cors")
const connectDB=require("./config/db")
const router=require("./routes/userRouter")
const cookieParser=require("cookie-parser")
const productRouter=require("./routes/productsRouter")
const CartRouter=require("./routes/cart")
const app=express()
const passport=require("passport")

app.use(cors({
    origin:"http://localhost:5173",credentials:true
}))
app.use(express.json())
app.use(passport.initialize())
app.use(cookieParser())
app.use("/uploads",express.static("Uploads"))
app.use("/api", router);
app.use("/api", productRouter);
app.use("/api",CartRouter)
connectDB()
app.listen(3000,()=>[
    console.log("server running...")
])