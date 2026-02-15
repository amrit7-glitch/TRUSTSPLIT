import mongoose from "mongoose"
import { DB_NAME } from "../constants"

const connectDb = async ()=>{
try {
    const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
   // console.log(connectionResponse)
   console.log(`connect at host ${connectionResponse.connection.host}`)
} catch (error) {
    console.log(error)
}
}

export default connectDb;