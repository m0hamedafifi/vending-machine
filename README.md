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
  
command inside the project's directory. After that start server use The application is divided into two main parts - server-side code and client-side code.
<br>
The server side handles all API endpoints, user authentication, and data persistence using MongoDB. The client-side
<br>
To run this application you need to have NodeJS installed on your machine. You can download it from https://nodejs.org/en/.
<br>
To run this application you need to have MongoDB installed on your machine and running at localhost port 27017. You can download it from https://www.mongodb.com/try/download/community .
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
same as above and this is screen Shot to make sure that the right configuration file has been chosen :
![image](https://user-images.githubusercontent.com/54658855/117768622-aabdff80-b13c-11eb-8fcb-e9efbbdafd66.png)
![ScreenShot](https://github.com/MohammadAlrefaieh/VendingMachineBackEnd/blob/master/Screenshot%20from%202021-06-24%2015-54

