const express = require("express");
const router = express.Router();
const depositController = require('../controller/deposit.controller');
const buyController = require('../controller/buy.controller');

// middlewares
const authMW = require('../middleware/authMWToken');
const validatorMW = require('../middleware/validateUserDataMW');

router.post('/deposit',authMW.authenticateUser,validatorMW.isBuyer,validatorMW.checkDepositData, depositController.depositToUserAccount); // create a new deposit

router.post('/buy',authMW.authenticateUser,validatorMW.isBuyer,validatorMW.checkBuyData, buyController.createBuyOrder); // create a new buy transaction (add to existing deposit)

router.post('/reset',authMW.authenticateUser,validatorMW.isBuyer, depositController.createReset); // reset the deposit


module.exports = router;