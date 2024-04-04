import mongoose from "mongoose";
const activitySchema=new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package', // Replace 'Package' with the actual name of the referenced model
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    day_activities:{
        type: [String],
        required: true,
    },
    image:{
        type: String,
        required: true,
    }

})
const Activity=mongoose.model("Activity",activitySchema)
export default Activity