# Vending-Machine
API for a vending machine allows users with a “seller” role to add, update, or remove products, while users with a “buyer” role can deposit coins into the machine and make purchases

## Technologies used:
1. nodejs
2. express framework for building web applications and APIs
3. body-parser middleware to parse request bodies in a middleware function
4. express middleware to handle cross-origin resource sharing (CORS)
5. Mongoose to support MongoDB object modeling, providing a straight-forward, schema-based solution to model your application data
6. Supertest to support testing of HTTP requests and responses  
7. Mocha as the test runner, with Chai assertions library for writing tests
8. Winston to support logging functionality  
9. MongoDB database through mongoose ODM 

### To run this application, you must have NodeJS installed on your machine. 
- nodejs 8+
- npm
- MongoDB
  
command inside the project's directory. After that starts server use The application is divided into two main parts - server-side code and client-side code.
<br>
The server side handles all API endpoints, user authentication, and data persistence using MongoDB. The client-side
<br>
To run this application you need to have NodeJS installed on your machine. You can download it from https://nodejs.org/en/.
<br>
To run this application you need to have MongoDB installed on your machine and running at localhost port 27017. You can download it from https://www.mongodb.com/try/download/community.
<br >

#### Installation & Running Instructions

After installing NodeJS open the command prompt or terminal and navigate to the directory where you want to clone the repository. Then use the following commands:
bash
<br>
1- Clone or download the repository from GitHub onto your local system.
<br>
2- Navigate into the project directory using the terminal/command prompt.
<br>

3- Install all dependencies by running the `npm install` command. This will automatically install Express, Body-Parser, CORS, SuperTest, Mocha, Chai, Winston
```yaml
npm install
```
<br>
4- create a new file named `.env`, containing environment variables specific to your development setup. This should include a `PORT` variable for specifying which port the server port
<br>

```yaml
PORT = 3001

# The Database Connection String.
URL= mongodb://127.0.0.1:27017/vendingMachine

# Jwt Authentication Secret Key
JWT_SECRET = 'secret' * 8

# Log folder
Log_file = ./log
```
same as above and this is a Shot to make sure that the right configuration file has been chosen :


![ScreenShot](https://github.com/m0hamedafifi/vending-machine/blob/master/img/code.env.png)


<br><br>

##### Now you can start the server by running one of these commands in the terminal :
<br>
- For starting the development server (nodemon):
<br>

```yaml
npm run dev
```
<br>
- Or just simply start it with node:
<br>

```yaml
npm start
```
<br>
- Open your postman and go to `http://localhost:${PORT}/`, you should see Welcome to the Vending Machine.

<br>

##### Testing
To test the API, I used supertest which is a library for testing HTTP servers and middleware functions in Node.js. It emulates HTTP requests made by a client to an Express application
To test the application, I used Mocha & Chai for testing purposes. You can use the following command to run tests:
You can test all endpoints using [Postman](https://www.postman.com/) or any other API testing tool.<br>
Make sure to add a header "x-auth-token" with the value of `<b>Bearer ${your jwt token}</b>` which you will get after login.
<br>
or use my Script to run tests for some endpoints:
<br>

```yaml
npm run test
```
<br>
Here are some useful links for testing each endpoint: <br>

- #### Products

- [GET /products]() - Get All Products  -> no need to send data <br>
- [GET /products/:id]() - Get a product by its ID -> must send `{ "productId": "integer" }` as JSON in body <br>
- [GET /products/me]() -  Get My Products   -> Authorization is required, so add a header `"x-auth-token" = "${your token}"` <br>
- [POST /product/add ]() - Add A New Product -> required send json `{productName: "string",amountAvailable: "integer",cost: "integer"}` <br>
- [PUT /product/:id]() - Edit An Existing Product -> Send any product data want to update but make sure to add a header authentication <br>
- [DELETE /product/:id]() - Delete A Product By Its ID -> make sure to add a header authentication <br>

- #### Users

- [POST /users/add]() - Sign Up User -> You will receive an object with token. but you must send json `{userName:string,password:string,role?: array of string or string , and deposit?:number}` <br>
- [POST /users/login]() - Login User -> You will also receive an object with token.but you must send json `{userName:string,password:string}` <br>
- [GET /users]()  - Get All Users -> no need to send data <br>
- [GET /users/:id]() -  Get User by its id -> must be sent user's id <br>
- [GET /users/me]() - Get my account data -> no need to send data, make sure to add a header authentication <br>
- [PUT /users/:id]() - Update User by its id -> must be sent user's id and data of this user <br>
- [DELETE / users/:id]() - Delete User by its id -> must be sent user's id <br><br>

Note that in order to delete/update a user, you have to log in first then copy the token and put it in authorization (Bearer + Token).
<br>
- #### Transactions

- [POST /deposit]() - to add  money to the machine, it needs to deposit as data <br>
- [POST /reset]() -  Reset The Machine To Its Default Status -> No Data Needed <br>
- [POST /buy]() - Buying a product from the machine, needs productId as data and amount as integer <br>
Note that when you call `/buy`, if there is not enough money in the machine to buy the requested item, an error will return with the message "Not Enough Money".</s> 
<br>

Note that you should always put your token in headers with the key "x-auth-token"  <br>
** Note in my plan I will docs to API with Swagger UI Soon ** <br>

** thanks in advance ** <br>
if any  questions please contact me on [LinkedIn](https://www.linkedin.com/in/mohamed-afifi-739baa159/) <br>
or send me an email to me at [mohamedafifi4298@gmail.com](mailto:mohamedafifi4298@gmail.com) </s> </s> </s> </s> </s> </s> </s> <br>