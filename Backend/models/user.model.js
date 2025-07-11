import mongoose, { mongo } from "mongoose";
import bcrypt, { genSalt } from 'bcrypt';

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique : true
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});

userSchema.methods.checkPassword = function(enteredPassword){
    if(enteredPassword === this.password){
        return true;
    }
    return false;
}

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    try {
        const saltRounds = await genSalt(10);
        this.password = await bcrypt.hash(this.password,saltRounds)
        next();
    } catch (error) {
        console.log("Error in hashing the password",error);
    }
})
export default mongoose.model('User',userSchema)