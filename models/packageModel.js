import mongoose  from "mongoose";
const packageSchema=new mongoose.Schema({
    city_name:{
        type:String,
        required:true
    },
    short_description:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    season:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    highlights:{
        type:String,
        required:true
    },
 

})

const Package=mongoose.model("Package",packageSchema)
export default Package