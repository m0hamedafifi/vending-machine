const User = require("../model/users.model");
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the controller
//----------------------------------------------------------------
const logger = new Logger("depositController");

//----------------------------------------------------------------
// deposit to user account and save to user account
//----------------------------------------------------------------
exports.depositToUserAccount = async (req, res) => {
  try {
    const userId = req.body.userId;
    let deposit = req.body.deposit;
    // check if the user is already in database and update the user account with the amount
    let userData = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { deposit: deposit } },
      { new: true }
    );

    if (!userData) {
      logger.error("User not found in the database.");
      return res
        .status(401)
        .send({ status: false, message: "Invalid User ID" });
    }

    logger.info(`Deposit of ${deposit} added to the user account.`);
    return res.status(200).send({
      status: true,
      message: "Deposit updated successfully to your account",
      results: {
        userId: userData.userId,
        userName: userData.userName,
        deposit: userData.deposit,
      },
    });
  } catch (err) {
    // console.log("Error at  depositing money into users account : ", err);
    logger.error(
      `Error at  depositing money into users account : ${err.message}`
    );
    return res.status(500).json({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};

//----------------------------------------------------------------
// update reset deposit
//----------------------------------------------------------------
exports.createReset = async (req, res) => {
  try {
    const userId = req.body.userId;
    let deposit = 0;
    // check if the user is already in database and update the user account with the amount
    let userData = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { deposit: deposit } },
      { new: true }
    );

    if (!userData) {
      logger.error(`User ${userId} is not in database`);
      return res
        .status(401)
        .send({ status: false, message: "Invalid User ID" });
    }
    logger.info(`Deposit has been reset for the user : ${userData.userName}`);
    return res.status(200).send({
      status: true,
      message: "Deposit has been reset for your account",
      results: {
        userId: userData.userId,
        userName: userData.userName,
        deposit: deposit,
      },
    });
  } catch (err) {
    // console.log("Error at reset money into users account : ", err.message);
    logger.error(`Error at reset money into users account : ${err.message}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};
