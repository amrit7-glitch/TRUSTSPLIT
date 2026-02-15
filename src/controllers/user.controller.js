import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
import  app  from '../app.js';

const registerUser = asyncHandler(async (req,res)=>{

    
        
        const {username,fullname,email,password} = req.body;
    
        
    
        if(
            [username,email,fullname,password].some((field)=> field?.trim() ==="")
        ){
            throw new ApiError(400,"full field required");
        }
    
        // check if user already exist
       const userExist = await User.findOne({
            $or:[{email},{username}]
        })
    
        if(userExist){
            throw new ApiError(409,"user already register")
        }
    
        const user =  await User.create({
            fullname,
            username: username.toLowerCase(),
            email,
            password
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        //console.log(createdUser)
        if(!createdUser){
            throw new ApiError(400,"something went wrong while registering")
        }
    
        return res
        .status(200)
        .json(
            200,
            createdUser,
            "user registered succesfully"
        )
     
    




})

export {registerUser}
