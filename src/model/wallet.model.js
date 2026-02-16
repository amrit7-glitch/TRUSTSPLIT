import mongoose , {Schema} from "mongoose"

const walletSchema = new Schema({
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true,
            trim:true,

        },

        availableBalance:{
            type:Number,
            default:0
        },

        lockedBalance:{
            type:Number,
            dafault:0
        }
},{timestamps:true})

export const Wallet = mongoose.model("Wallet",walletSchema)