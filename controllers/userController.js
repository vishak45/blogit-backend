const User = require('../models/users');
const bycrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');   

exports.registerUser=async(req,res)=>{
    try{
    const{name,email,password}=req.body;
    let userExist= await User.findOne({email});
    if(userExist){
        return res.status(400).json({message:"User already exists"});
    }
    const passwordHash= await bycrypt.hash(password,10);
    const user= await User.create({
        name,
        email,
        password:passwordHash
    });
    await user.save();
    return res.status(201).json({message:"User created successfully"}); 

}catch(error){
    return res.status(500).json({message:"Internal server error"});
}

}

exports.loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch= await bycrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        return res.status(200).json({message:"Login successful",token,user});    
    }catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
}