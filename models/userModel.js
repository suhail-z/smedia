
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'mail id is required'],
        trim:true,
        minLength:8,
        unique:[true,'email id must be unique'],
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'password is required'],
        trim:true,
    },
    verified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:Number,
        select:false
    },
    verificationCodeValidation:{
        type:Number,
        select:false
    },
    forgetPassword:{
        type:Number,
        select:false
    },
    forgetPasswordValidation:{
        type:Number,
        select:false
    }
},{
    timestamps : true
});

module.exports = mongoose.model('user',userSchema);