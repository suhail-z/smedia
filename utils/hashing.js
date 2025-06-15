const { hash, compare } = require("bcryptjs")

exports.hashPassword = (async(password,saltvalue)=>{
    const result =await hash(password,saltvalue);
    return result;
})
exports.verifyPassword = (async(password,hashedPassword)=>{
    const result = await compare(password,hashedPassword);
    return result;
})