import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    fullname:{
        type:String,
        required:true,
        
        trim:true,
       
    },
    email:{
        
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
            required:[true,"password is required"],


    },
    balance:{
        type:String,

    },

    refreshToken:{
        type:String
    }
},{timestamp:true})

// using pre middleware/hooks before post saving or writing to the database
userSchema.pre("save",async function(){
        if(!this.isModified("password")) return;

       this.password =  await bcrypt.hash(this.password,10)
})

// check correct password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model("User",userSchema)