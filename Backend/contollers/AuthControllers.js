import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const userRegister = async (req,res)=>{
    const { firstName,lastName,mobile,email, password, confrimPassword } = req.body;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({ message: "Email is incorrect" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password should be at least 8 characters" });
      }
      if (password !== confrimPassword) {
        return res.status(400).json({ message: "Password and Confirm Password should match" });
      }
      if(!firstName){
        return res.status(400).json({message:"First Name is required"});
      }
      if(!mobile){
        return res.status(400).json({message:"Mobile number is required"});
      }
      const mobilePattern = /^[6-9]\d{9}$/;
      if(!mobilePattern.test(mobile)){
        return res.status(400).json({message:"Mobile number is incorrect"});
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: "User already exists" });
      }
    
      await User.create({ firstName,lastName,mobile, email, password, });
    
      return res.status(200).json({ message: "User signup successful" });
}

export const userLogin =  async(req,res)=>{
    const { email, password } = req.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Email is incorrect" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User doesn't exist. Please signup" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const payload = { email, id: user._id };
  const token = jwt.sign(payload, 'secret999', { expiresIn: '1h' });

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      firstName:user.firstName,
      lastName:user.lastName,
      mobile:user.mobile
    },
    token
  });
}

export const userUpdate = async(req,res)=>{
    const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    user.password = password; 
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const userDelete = async (req,res)=>{
    const userId = req.params.id;

    const user = await User.findOne({_id:userId});
    if(!user){
        return res.status(402).json({message:"No user Id provided"});
    }
    await User.deleteOne({_id:userId})
    return res.status(200).json({ message: "Deleted User succesfully"});
}
