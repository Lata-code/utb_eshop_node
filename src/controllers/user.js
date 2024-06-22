const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * signup API
 */
const signUp = async(req, res) => {
    try{
        const isUserExist = await User.findOne({email:req.body.email});
        if(isUserExist) return res.send("User is already register for this email !");
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            passwordHash:bcrypt.hashSync(req.body.password, 10),
            street:req.body.street,
            apartment:req.body.apartment,
            city:req.body.city,
            zip:req.body.zip,
            country:req.body.country,
            phone:req.body.phone,
            isAdmin:req.body.isAdmin

        })

        const userInfo = await user.save();
        if(!userInfo) return res.status(400).json({success:false, message:"User not Created !" })
        res.status(200).json({success:false, message:"User Created Succesfuly !", result:userInfo})

    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * getAllUser API
 */
const getAllUser = async (req, res) => {
    try{
        
        const user = await User.find();
        if(!user) return res.status(404).json({success:false, message:"No user Found !"});
        res.status(200).json({success:true, message:"All Users !", count:user.length, result:user})
    
    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * oneUserDetail API
 */
const oneUserDetail  = async (req, res) => {
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid userId !"})

        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({success:false, message:"User not Found For this ID !"})
        res.status(200).json({success:true, result: user})

    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * updateUser API
 */
const updateUser = async (req, res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({success:false, message:"Invalid User ID !"})
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!user) return res.status(404).json({success:false, message:"User Not Found For  this Id ! "})
        res.status(200).json({success:true, message:"User Updated Successfuly !", result:user})
    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * deleteUser API
 */
const deleteUser = async (req, res) => {
    try{

        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid userId !"})
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({success:false, message:"User not Esist for this Id !"})
        res.status(200).json({success:true,message:"User deleted succesfuly !"})
    
    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * signIn API
 */
const signIn = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email) return res.status(400).json({success:false, message:"Please Enter Your Email"})
        if(!password) return res.status(400).json({success:false, message:"Please Enter Your Password"})

        const user = await User.findOne({email:req.body.email});
        if(!user) return res.status(404).json({success:false, message:"User not found for this Email"})
        
        if(user && bcrypt.compareSync(password,user.passwordHash)){
            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign({id:user.id,isAdmin:user.isAdmin},secretKey, { expiresIn: '1d'})
            res.status(200).json({success:true, message:"User Logged In Successfulyn !", token:token})
        }else{
            res.status(200).json({success:true, message:" Wrong Password  !"})

        }
    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports = {
    signUp, 
    getAllUser,
    oneUserDetail,
    deleteUser,
    updateUser,
    signIn
}
