var passwordValidator = require("password-validator");
var passwordChecker = new passwordValidator();


// Password must be 10 characters long


module.exports.isValidPassword = (password) => {
  // Add properties to the password validator
  passwordChecker
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(20) // Maximum length 20
    .has()
    .uppercase() // At least one uppercase letter
    .lowercase() // At least one lowercase letter
    .digits() // At least one digit
    .not()
    .spaces() // Should not contain spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  try {
    // Validate the password against the passwordChecker
    return passwordChecker.validate(password);
  } catch (err) {
    console.log("Error at validation  password function : " + err);
    throw err;
  }
};


// check username
exports.isValidUserName = (userName) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/gm;
  if (!usernameRegex.test(userName)) {
    // new Error(`Username should only contains letters and underscores`);
    return false;
  }
  return true;
};


// check Role name 
exports.isRoleExists = (roleName) => {
  const roles = ['seller', 'buyer'];
  return roles.includes(roleName);
}

// Checking whether the amount is 5 or 10 or 20 or  50 or 100 only 
exports.isValidDeposit= (amount) => {
  let validAmount=[5,10,20,50,100];
  return validAmount.includes(amount);
}


// Checking whether the amount is a Number
exports.checkIsNumber=(data)=>{
  return isNaN(data);
}