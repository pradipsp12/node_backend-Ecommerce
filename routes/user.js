const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const User = require('../models/user');

// find all user

router.get('/', asyncHandler(async(req, res)=>{
    try {
       const users = await User.find();
       res.status(200).json({success: true, message:'success', data: users}); 
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}))

// Register User 

router.post('/register', asyncHandler(async(req, res)=>{
    const {name, password} = req.body;
    
    if (!name || !password){
        res.status(401).json({ success:false, message: 'Name, and password are required.'});
    }
    try {
        const user = new User({name, password});
        const newUser = await user.save();
        res.json({success: true, message:'New user created successfully', newUser})
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}));

//login

router.post('/login', asyncHandler(async(req, res)=>{
    const {name, password}= req.body;

    try {
        const user = await User.findOne({name});
        if(!user){
            res.status(401).json({success: false, message:'User not fount'});
        }
        // password check
        if(user.password != password){
            res.status(401).json({success: false, message:'Invalid Password'});
        }
        res.json({success: true, message:'Login successful', data: user});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}))

// get User by Id

router.get('/:id', asyncHandler(async(req, res)=>{
    
    try {
        const userId = req.params.id;
        console.log(userId);
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({success:false, message:'User not Found'});
        }
        res.json({success: true, message:'User fetch successfully', data:user});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}))

// update user

router.put('/:id', asyncHandler(async(req, res)=>{
    try {
        const userId = req.params.id;
        const {name, password} = req.body;
        if(!name || !password){
            res.status(404).json({success:false, message:'name and password required'});
        }
        const user = await User.findByIdAndUpdate(userId,{name,password}, {new:true});
        res.json({success: true, message: 'user updated successfully', data: user});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}))

//delete user 

router.delete('/:id', asyncHandler(async(req, res)=>{
    try {
        const userId = req.params.id
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            res.status(404).json({success:false, message:'User Not Fount'});
        }
        res.json({success:true, message:'User Deleted SuccessFully'});

    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}))

module.exports = router;