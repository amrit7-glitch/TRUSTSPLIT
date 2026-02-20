import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import {User} from '../model/user.model.js'
import { Wallet } from '../model/wallet.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

const generateAccessAndRefreshToken = async(userId)=>{
     
    try {
        const user = await User.findById(userId);
    
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        //console.log(refreshToken,"   ",accessToken)
        
        // saving refreshToken into database 
        user.refreshToken = refreshToken
        user.save({validateBeforeSave:false})
    
        return {refreshToken,accessToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access or refresh token")
    }
}

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

        await Wallet.create({
            userId:user._id,
            
        })
    
        return res
        .status(200)
        .json(
            200,
            createdUser,
            "user registered succesfully"
        )
     
    




})

const loginUser = asyncHandler(async (req,res)=>{

    const {email,username,password} = req.body;

    if(!(email || username)){
        throw new ApiError(400,"username or email required")
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"user not found")
    }

        const isPasswordValid =  await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new ApiError(401,"password is not valid")
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,{
                loggedInUser,accessToken,refreshToken
            },"loggedIn succesfully")
        )

})

export {
    registerUser,
    loginUser

}
