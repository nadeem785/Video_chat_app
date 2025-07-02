
import mongoose from 'mongoose'

export const connectDB= async()=>{
    try{
     const conn=await mongoose.connect(process.env.MONGODB_URI)
     console.log("mogo db conneced: ",conn.connection.host)
    }
    catch(err){
console.log("mogodb connection error: ",err)
    }
}