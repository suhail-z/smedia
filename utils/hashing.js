const { hash } = require("bcryptjs")

exports.hashPassword = (async(password,saltvalue)=>{
    const result =await hash(password,saltvalue);
    return result;
})