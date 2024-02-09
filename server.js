const express = require('express')
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const dbConnection = require('./db/connection');

dotenv.config();

const app = express()

// parse requests of content-type - application/json
app.use(bodyParser.json())



const port = process.env.PORT || 3000

// Db connection
dbConnection.run()

// simple route
app.get('/', (req, res) => res.send('Welcome to the Vending Machine'))

// routers


// send back a 404 if no other route matches
app.use((req, res) => {
    res.status(404).send('<h1>Error</h1><p>Sorry, that route does not exist</p>')
})

app.listen(port, () => console.log(`Server started on ${port}`))