import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true, // Ensures emails are unique
      },
      phone: {
        type: Number,
        required: true,
      },
      place: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
     
    });
    
    
    const User = mongoose.model("User", userSchema);
    
    export default User
