
import {StreamChat} from 'stream-chat'
import 'dotenv/config'


const apiKey= process.env.STREAM_API_KEY
const apiSecret= process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.log("errror stream api or secret missing")
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret)

export const  upsertStreamUser= async (userData)=>
{
try{
await streamClient.upsertUsers([userData]);
return userData
}
catch(err){
    console.log("error upseting",err)
}

}

export const generateStreamToken=(userId)=>{
    try{
        //ensure userid is string
const userIdStr= userId.toString()
return streamClient.createToken(userIdStr);
    }
    catch(err){
console.error("erorr generating the stream token ",err)

    }
}

