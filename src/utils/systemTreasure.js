import { Wallet } from "../model/wallet.model.js";
import {User} from "../model/user.model.js"


export const initTreasury = async ()=>{

let systemUser = await User.findOne({username: "Bank"})


if(!systemUser){
    systemUser =  await User.create({
        username:"Bank",
        email:"bank@gmail.com",
        password:"3228",
        fullname:"Bank treasury"
    })
}


    const exist = await Wallet.findOne({userId:systemUser._id})
    
    if(!exist){
        await Wallet.create({
            userId: systemUser._id,
            type:"system",
            availableBalance:1000000
        });
         console.log("treasury created")
    } else{
        console.log("treasury already exit");
    }
}