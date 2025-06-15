const { validateInput } = require("../middlewares/validator");
const User = require('../models/userModel');
const { hashPassword } = require("../utils/hashing");

exports.authControl = (async(req,res)=>{
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
})