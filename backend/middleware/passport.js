const passport=require("passport")
const googleSt=require("passport-google-oauth20").Strategy
const User=require("../model/user")

passport.use(new googleSt({
   clientID:process.env.CLIENT_ID,
   clientSecret:process.env.CLIENT_SECRET,
   callbackURL:"http://localhost:3000/api/google/callback",
},async(accessToken,refreshToken,profile,done)=>{
try {
        const email=profile.emails?.[0].value;
    let user=await User.findOne({email})
    if (!user) {
        user=await User.create({
            name:profile.displayName,
            email:email,
            googleId:profile.id,
            profileImage:profile.photos[0]?.value
        })
    }
     return done(null,user)

} catch (error) {
    console.log("Error in the Passport middleware",error)
    return done(error,null)
}
}
)
)
module.exports=passport