import { Router } from "express";
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import verifyToken from "../middlewares/token.middleware.js";
import bcrypt from 'bcrypt';
const route = Router();

route.post('/signup',async(req,res)=>{
    const {email,password,confrimPassword} = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailPattern.test(email)) return res.status(400).json({"message":"Email is incorrect"})
    if(password.length < 8) return res.status(400).json({"message":"Password should be atleast 8 characters"})
    if(!password === confrimPassword) return res.status(400).json({"message":"Password and ConfrimPassword should match"})

    const existUser = await User.findOne({email:email})
    if(existUser){
        return res.status(400).json({"message":"User Already Exists"});
    }
    const payload = {email}
    const token = jwt.sign(payload,'secert999',{expiresIn : '1h'}) 

    const user = User.create({email,password,confrimPassword});

    return res.status(200).json({
        "email":email,
        "token":token
    })
    
})
route.get('/login', verifyToken ,async (req,res)=>{
    const {email,password} = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.+[^\s@]+$/
    if(!emailPattern.test(email)) return res.status(400).json({"message":"Email is incorrect"});
    const user  = await User.findOne({email:email})
    
    if(!user){
        return res.send("User doesn't exists.Please signup");
    }
    if(!password === user.password){
        return res.status(402).json({"message":"Password or email is incorrect"});
    }
    return res.status(201).json({"message":"Login Successfull"});

})
route.put('/update', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
route.delete('/delete',(req,res)=>{

})
export default route