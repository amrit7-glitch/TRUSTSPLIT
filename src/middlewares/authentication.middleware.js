import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../model/user.model.js"

const verifyJWT = asyncHandler(async (req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
       // console.log(token)
    if(!token){
        throw new ApiError(401,"unauthorizd request");
    }
    
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN)
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401,"invalid access token")
    }
    
    req.user = user
    next();
    
    } catch (error) {
        throw new ApiError(401,error.message || "invalid access token")
    }



})

export {verifyJWT} 