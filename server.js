import express from "express";
import { connectDb } from "./config/dbConnection.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from './routes/adminRouter.js'
import packageRouter from './routes/packageRouter.js'
import activityRouter from './routes/activityRouter.js'
import cors from 'cors'
import Razorpay from "razorpay";
const app=express()
connectDb()
app.use(express.json())//data fecth from body
app.use(cors())
const options = {
    origin: ['http://localhost:5173/','http://192.168.1.24:5173/'],
    }
app.use(cors(options))
app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/trip',packageRouter,activityRouter)

// export const instance=new Razorpay({
    // key_id:process.env.RAZOPAY_API_KEY,
    // key_secret:process.env.RAZOPAY_API_SECRET
// })
app.listen(6001,()=>{

    console.log('server started on port 6001')
})