const User = require('../model/users.model');
const bcrypt = require("bcryptjs");
const jwt = require('../Util/jwt.util');


//----------------------------------------------------------------
// Sign in with username and password using JWT token
//----------------------------------------------------------------
exports.signInWithUsernamePassword = async (req, res) => {
    try{
        // Get the user from database by their username
        const user = await User.findOne({userName: req.body.userName});
        if(!user){
            return res.status(401).send({
                status:false,
                message: "userName or password is Wrong..!"
            });
        }

        // compare the password 
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(401).send({
              status: false,
              message: 'userName or password is Wrong..!'
          });
        }
        // generate the token for authentication
        let token = jwt.generateToken(user.userId,user.userName,user.role);
        
        // send response to client side
        res.header('x-auth-token', token).status(200).send({
            status: true,
            message:"User Logged In Successfully"
        })
      
    }catch(err){
        console.log("Error at signInWithUsernamePassword", err);
        res.status(500).send({
            status: false,
            message: `Internal Server Error..!`
        })
    }
};


