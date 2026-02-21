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
    status:{
        type:String,
        enum:["pending","sucess","failed"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:true
    }


},{timestamps:true})

export const Transction = mongoose.model("Transction",{transctionSchema})