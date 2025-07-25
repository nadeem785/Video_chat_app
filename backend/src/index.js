
import express from 'express'
import authRoutes from "./routes/auth.route.js"
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import cors from 'cors'
import path from "path"

const app= express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true //allow frontend to send cookies
}))

app.use(express.json())


app.use(cookieParser())


dotenv.config()

const port = process.env.PORT
const __dirname= path.resolve()
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

app.listen(port,()=>{
    console.log(`server is running on : ${port}`)
    connectDB()
})
