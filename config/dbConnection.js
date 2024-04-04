import mongoose from "mongoose";
const dburl='mongodb://127.0.0.1:27017/PlanUrTrip'
export const connectDb=async()=>{
    try {
        mongoose.connect(dburl,{
        })
        console.log('Database connected successfulluy');
        
    } catch (error) {
        console.log("eroorrrrrrr");
        
    }
    }