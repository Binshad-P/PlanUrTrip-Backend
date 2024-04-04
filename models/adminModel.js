import mongoose from "mongoose";
const adminSchema=new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true, // Ensures emails are unique
      },
      password: {
        type: String,
        required: true,
      },
     
    });
    
    
    const Admin = mongoose.model("Admin", adminSchema);
    
    export default Admin