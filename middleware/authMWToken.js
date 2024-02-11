const jwt = require("../Util/jwt.util");

//----------------------------------------------------------------
// verify the signature of the signature token and return user data if valid
//----------------------------------------------------------------

module.exports.authenticateUser = (req, res, next) => {
  let token = req.headers["x-auth-token"] || req.body.token;
  if (!token) {
    return res
      .status(401)
      .send({ status:false, message: "...Please login or registration to get access...!" });
  }
  try {
    let userData = jwt.VerifyTokenUser(token);
    // console.log("User Data", userData);
    if (!userData) {
      return res
        .status(403)
        .send({ status: false, message: "Failed to authenticate token." });
    }
    req.body.userId = userData.userId;
    req.body.userName = userData.userName;
    req.body.role =  userData.role;

    // console.log(req.body);
    next();
  } catch (err) {
    console.error(`Error verifying token : ${err}`);
    return res
      .status(500)
      .send({ status: false, message: "Failed to authenticate token." });
  }
};
