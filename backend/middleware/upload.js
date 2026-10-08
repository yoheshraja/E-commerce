const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"Uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const fileFilter=(req,file,cb)=>{
    const allowed=["image/png","image/jpeg","image/webp"]
    if (allowed.includes(file.mimetype)) {
        cb(null,true)
    }
    else{
        cb(new Error("This type of image not Accepted"),false)
    }
}
const limits=5*1024*1024

const upload=multer({
    storage:storage,
    limits:limits,
    fileFilter:fileFilter
})
module.exports=upload