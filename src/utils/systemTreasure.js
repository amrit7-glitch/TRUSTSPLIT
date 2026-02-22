import { Wallet } from "../model/wallet.model";


export const initTreasury = async ()=>{

    const exist = await Wallet.findOne({type:"system"})
    
    if(!exist){
        await Wallet.create({
            type:"system",
            availableBalance:1000000
        });
         console.log("treasury created")
    }
}