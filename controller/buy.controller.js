const User = require("../model/users.model");
const Product = require("../model/products.model");

// ----------------------------------------------------------------
// Create Buy Order function
// ----------------------------------------------------------------
exports.createBuyOrder = async (req, res) => {
  try {
    let userId = req.body.userId;
    let productId = req.body.productId;
    let amount = Number(req.body.amount);

    // check the product id is exist in database
    let productData = await Product.findOne({ productId: productId });
    if (!productData) {
      return res
        .status(401)
        .send({ status: false, message: "The product does not exist" });
    }

    // check the amount is grater then the amount in database
    if (amount > productData.amountAvailable) {
      return res
        .status(403)
        .send({
          status: false,
          message:
            "Sorry! The available amount of this product is less than your order.",
        });
    }

    // get deposit money's for the user account
    let userData = await User.findOne({ userId: userId });

    // check the amount is grater then the amount in database
    if (userData.deposit == 0) {
      return res
        .status(403)
        .send({
          status: false,
          message: "You don't have any deposit",
          available_balance: userData.deposit,
        });
    }

    // calculate the cost of amount product
    let totalCost = productData.cost * Number(amount);

    // check the deposit with total cost and return the change in(5,10,20,50,100)

    if (totalCost > userData.deposit) {
      return res.status(409).send({
        status: false,
        message:
          "Your order can't be processed because you don't have enough balance",
        data: {
          available_balance: userData.deposit,
          required_balance: totalCost,
        },
      });
    }
    let deposit = Number(userData.deposit);
    let changeMoney = calculateChange(totalCost, deposit);
    // update the product amount after buying a product
    let newAmount = productData.amountAvailable - amount;
    await Product.findOneAndUpdate(
      { productId: productId },
      { $set: { amountAvailable: newAmount } },
      { new: true }
    );

    // update the deposit to 0
    await User.findOneAndUpdate(
      { userId: userId },
      { $set: { deposit: 0 } },
      { new: true }
    );

    // return to the checkout page with success massage and the change that will give back to customer
    return res.status(200).send({
      status: true,
      message: "Successfully purchased",
      data: {
        product_id: productData.productId,
        product_Name: productData.productName,
        amount: amount,
        cost_per_Product: productData.cost,
        total_cost: totalCost,
        change: changeMoney,
      },
    });
  } catch (err) {
    console.log("Error from buyProductController", err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

//function to calculate change in coins
function calculateChange(totalCost, deposit) {
  let change = deposit - totalCost;

  const coins = [100, 50, 20, 10, 5];
  let changeInCoins = {};

  coins.forEach((coin) => {
    let coinCount = Math.floor(change / coin);
    if (coinCount > 0) {
      changeInCoins[coin] = coinCount;
      change -= coinCount * coin;
    }
  });

  return changeInCoins;
}
