const { date } = require("joi");
const { validateInput } = require("../middlewares/validator");
const User = require('../models/userModel');
const { hashPassword, verifyPassword } = require("../utils/hashing");
const jwt = require('jsonwebtoken');

exports.signupSchema = (async(req,res)=>{
    const {email , password } = req.body;
    try{

        const {error, value} = validateInput.validate({email,password});

        if(error){
            return res.status(401).json({success:false,details:error.details[0].message})
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({success:false,details:'mail id already exist'});
        }

        const hashedpass = await hashPassword(password,12);

        const newUser = new User({
            email,
            password:hashedpass
        });

        let result = await newUser.save();
        result.password = undefined;

        return res.status(201).json({success:true,details:'your account has been created successfully',userInfo:result});

    }
    catch(err){
        console.log('error creating a user acount', err);
        return res.status(500)
        .json({
            sucess:false,
            details:'internal server error'
        })
    }
});

exports.loginSchema = (async(req,res)=>{
    const {email,password} = req.body;

    try{
        const {error,value} = validateInput.validate({email,password});

        if(error){
            return res.status(400).json({success:false,details:error.details[0].message})
        }

        let existingUser =await User.findOne({email}).select('+password');

        if(!existingUser){
             return res.status(404).json({success:false,details:'mail id does not exist'});
        }
        const verified = await verifyPassword(password,existingUser.password);

        if(!verified){
            return res.status(401).json({success:false,details:'password does not match for provided mail id'});
        }
        const token = jwt.sign({
            userID:existingUser._id,
            email:existingUser.email,
            verified:existingUser.verified
        },
        process.env.SECRET,
        { expiresIn :'8h'}
    );

        return res.cookie('Authorization','Bearer '+token,{expires: new Date(Date.now() + 8* 3600000),httponly:process.env.NODE_ENV === 'production',secure:process.env.NODE_ENV === 'production',samesight : 'strict'}).status(200)
        .json({
            success:true,
            token,
            details:'login succesfull'
    })

    }
    catch(err){
          console.log('error creating a user acount', err);
        return res.status(500)
        .json({
            success:false,
            details:'internal server error'
        })
    }
});
exports.logout = (async(req,res)=>{
    res.clearCookie('Authorization').status(200).json({
        sucess:true,
        details:'logged out succesfully'
    })
});