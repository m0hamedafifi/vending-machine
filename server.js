const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConnection = require("./db/connection");
const productRoute = require("./router/products.route");
const userRoute = require("./router/users.route");
const transactionRoute = require("./router/transactions.route");

dotenv.config();

const app = express();

// cors middleware middleware to enable CORS (cross-origin resource sharing)
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Db connection
dbConnection.run();

// simple route
app.get("/", (req, res) => res.send("Welcome to the Vending Machine"));

// routers
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", transactionRoute);

// send back a 404 if no other route matches
app.use((req, res) => {
  res.status(404).send("<h1>Error</h1><p>Sorry, that route does not exist</p>");
});

app.listen(port, () => console.log(`Server started on ${port}`));

module.exports = app;
