const request = require("supertest");
const app = require("../server");
const Logger = require("../services/logger");
const logger = new Logger("User.Test");
// ----------------------------------------------------------------
// test get request method to get all users
// ----------------------------------------------------------------
describe("GET /users", function () {
  it("get all users", function (done) {
    request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        logger.info("User.Test: GET /users Successful.");
        // console.log(res.body);
      })
      .catch((err) => {
        logger.error(`User.Test: Error in GET /users : ${err.message}`);
        done(err);
      });
      done();
  });
});
// ----------------------------------------------------------------
// test post request method to add a new user
// ----------------------------------------------------------------

describe("POST /users", function () {
  let user = { userName: "john", password: "Fifty00", deposit: 0 };

  it("add a new user", function (done) {
    request(app)
      .post("/api/users/add")
      .send(user)
      .set("Accept", "application/json")
      .expect(201)
      .then(
        () => {
          logger.info("User.Test: POST /users/add Successful.");
        },
        (err) => {
          logger.error(`User.Test: Error in POST /users/add : ${err.message}`);
          done(err);
        }
      );
      done();
  });
});

// ----------------------------------------------------------------
// test post request method to login with username and password
// ----------------------------------------------------------------
describe("POST /users", function () {
  let token;
  let user = { userName: "john", password: "Fifty00" };

  it("logs in an existing user", function (done) {
    request(app)
      .post("/api/users/login")
      .send(user)
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        token = res.header["x-auth-token"];
        logger.info(
          "User.Test: POST /users/login Successful. token = " + token
        );
        done(); // Don't forget to call done() to indicate the completion of an asynchronous operation
      })
      .catch((error) => {
        logger.error(
          `User.Test: Failed to log in the user "${user.userName}" : ${error.message}`
        );
        done(error); // Pass the error to done to indicate test failure
      });
  });

  it("returns status code 404 if no username is provided", function (done) {
    request(app)
      .post("/api/login")
      .set("Accept", "application/json")
      .send({ password: "Fifty00" })
      .expect(404)
      .end((err, res) => {
        if (err) {
          logger.error(`Error at login with no username: ${err.message}`);
          done(err); // Pass the error to done to indicate test failure
        } else {
          done();
        }
      });
  });

  it("returns status code 404 if no password is provided", function (done) {
    request(app)
      .post("/api/login")
      .send({ username: "" })
      .set("Accept", "application/json")
      .expect(404)
      .end((err, res) => {
        if (err) {
          logger.error(`Error at login with no password: ${err.message}`);
          done(err); // Pass the error to done to indicate test failure
        } else {
          done();
        }
      });
  });

  // ----------------------------------------------------------------
  // test put request method with password parameter
  // ----------------------------------------------------------------
  describe("PUT /users", function () {
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJOYW1lIjoiam9obiIsInJvbGUiOlsiYnV5ZXIiXSwiaWF0IjoxNzA3NzIwOTI4LCJleHAiOjE3MDgzMjU3Mjh9.udzG5o_zRZMeO186AqGLCSHubAjk9aBZfT4LbHLOErI";

    let base = { "x-auth-token": token, "Content-Type": "application/json" };
    it("update an existing user", function (done) {
      request(app)
        .put("/api/users/john")
        .set(base)
        .send({ password: "123456789" })
        .expect("Content-Type", /json/)
        .expect(200)
        .then(() => {
          logger.info("User john has been updated");
          done();
        })
        .catch((err) => {
          logger.error(`Failed to update user john :${err.message}`);
          done(err);
        });
    });
  });

  // ----------------------------------------------------------------
  // test delete request method to remove a user by id
  // ----------------------------------------------------------------
  describe("DELETE /users", function () {
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJOYW1lIjoiam9obiIsInJvbGUiOlsiYnV5ZXIiXSwiaWF0IjoxNzA3NzIwOTI4LCJleHAiOjE3MDgzMjU3Mjh9.udzG5o_zRZMeO186AqGLCSHubAjk9aBZfT4LbHLOErI";
    let base = { "x-auth-token": token, "Content-Type": "application/json" };
    it("delete an existing user", function (done) {
      request(app)
        .delete("/api/users/john")
        .set(base)
        .expect(200)
        .then(() => {
          logger.info("User deleted");
          done();
        })
        .catch((err) => {
          logger.error(`Error deleting User: ${err.message}`);
          done(err); // Pass the error to done to indicate test failure
        });
    });
  });
});
