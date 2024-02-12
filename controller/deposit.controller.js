const User = require("../model/users.model");

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
      {new: true}
    );

    if (!userData)
      return res
        .status(401)
        .send({ status: false, message: "Invalid User ID" });

    return res.status(200).send({
      status: true,
      message: "Deposit updated successfully to your account",
      results: {
        userId: userData.userId,
        userName: userData.userName,
        deposit: userData.deposit
      },
    });
  } catch (err) {
    console.log("Error at  depositing money into users account : ", err);
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
      { $set: { deposit: deposit } }
    );

    if (!userData)
      return res
        .status(401)
        .send({ status: false, message: "Invalid User ID" });

    return res.status(200).send({
      status: true,
      message: "Deposit updated successfully to your account",
      results: {
        userId: userData.userId,
        userName: userData.userName,
        deposit: deposit,
      },
    });
  } catch (err) {
    console.log("Error at reset money into users account : ", err.message);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error..!",
    });
  }
};
