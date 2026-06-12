import mongoose from "mongoose";

const connectdb= async ()=>{
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
}
export {connectdb};