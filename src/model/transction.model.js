import mongoose ,{Schema} from 'mongoose'

const transctionSchema = new Schema({

    fromAccount:{
        type:mongoose.Types.ObjectId,
        ref:"Wallet"
    },
    toAccount:{
        type:mongoose.Types.ObjectId,
        ref:"Wallet"
    },
    type: {
        type: String,
        enum: ["deposit","trade","refund","transfer"],
        required: true
    },
    status:{
        type:String,
        enum:["pending","sucess","failed"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:true
    },
    paymentId:{
        type:String
    }


},{timestamps:true})

export const Transction = mongoose.model("Transction",{transctionSchema})