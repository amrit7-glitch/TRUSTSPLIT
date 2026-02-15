import dotenv from 'dotenv'
dotenv.config({ path: './.env' })


import connectDb from "./db/db.user.js";
import app from "./app.js"


connectDb()
.then(()=>{
     app.listen(process.env.PORT,()=>{
        console.log(`app listening on port ${process.env.PORT}`)
    })
}
   
)
.catch((error)=>{
        console.log("mongodb connection failed ",error)
}

)
