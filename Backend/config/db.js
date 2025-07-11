import mongoose from "mongoose";

const connectDB =()=>{
    try {
        const connection = mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Mongo DB connected Succesfully");
        })
        .catch(()=>{
            console.log("Error in connecting DB");
        })
    } catch (error) {
        console.log("Erro in th connection DB",error);
    }
}

export default connectDB;
