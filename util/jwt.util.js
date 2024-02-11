const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Setup environment variables from .env file.
dotenv.config();

//------------------------------------------------------------------------------
// generate the access token for a user with specific role and expiration time
//------------------------------------------------------------------------------
exports.generateToken = (userId,userName,role)=>{
    return jwt.sign({userId:userId,userName:userName,role:role}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

//------------------------------------------------------------------------------
// generate the access token for a user with specific role and expiration time
//------------------------------------------------------------------------------
exports.VerifyTokenUser = (token)=>{
    try{
        let user=jwt.verify(token,process.env.JWT_SECRET);
        return user;
        }catch(err){
            console.log("Invalid token",err.message);
            return false;
            }
};