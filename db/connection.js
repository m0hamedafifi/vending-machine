const { mongoose  } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.URL;

exports.run = async () => {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(url)
    .then(() => {
      console.log("DB Connected successfully");
    }).catch((err) => {
    console.log("Db Connection error : ", err.message);
    });
   
};