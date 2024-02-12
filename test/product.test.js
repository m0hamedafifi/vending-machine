const request = require("supertest");
const app = require("../server");
const Logger = require("../services/logger");
const logger = new Logger("Product.Test");
// ----------------------------------------------------------------
// test get request method to get all Products
// ----------------------------------------------------------------
describe("GET /products", function () {
  it("get all products", function (done) {
    request(app)
      .get("/api/products")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        logger.info("Product.Test: GET /products Successful.");
        // console.log(res.body);
      })
      .catch((err) => {
        logger.error(`Product.Test: Error in GET /products : ${err.message}`);
        done(err);
      });
    done();
  });
});
// ----------------------------------------------------------------
// test post request method to add a new user
// ----------------------------------------------------------------

describe("POST /users", function () {
  let user = { userName: "john", password: "Fifty00", role: "seller" };

  it("add a new user", function (done) {
    request(app)
      .post("/api/users/add")
      .send(user)
      .set("Accept", "application/json")
      .expect(201);
    done();
  });
});

// ----------------------------------------------------------------
// test post request method to add a new product
// ----------------------------------------------------------------

describe("POST /products", function () {
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJOYW1lIjoiam9obiIsInJvbGUiOlsic2VsbGVyIl0sImlhdCI6MTcwNzcyNDUyNCwiZXhwIjoxNzA4MzI5MzI0fQ.Dbc_CBFyHDhuWsh59k5PBURl4ts2CtuwhPin51i9DkY";
  let product = { productName: "test_product", amountAvailable: 5, cost: 10 };
  let base = { "x-auth-token": token, "Content-Type": "application/json" };
  it("add a new product", function (done) {
    request(app)
      .post("/api/products/add")
      .send(product)
      .set(base)
      .set("Accept", "application/json")
      .expect(201)
      .then(
        () => {
          logger.info("Product.Test: POST /products/add Successful.");
          done();
        },
        (err) => {
          logger.error(
            `Product.Test: Error in POST /products/add : ${err.message}`
          );
          done(err);
        }
      );
  });
});

// ----------------------------------------------------------------
// test delete request method to remove a user by id
// ----------------------------------------------------------------
describe("DELETE /users", function () {
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJOYW1lIjoiam9obiIsInJvbGUiOlsic2VsbGVyIl0sImlhdCI6MTcwNzcyNDUyNCwiZXhwIjoxNzA4MzI5MzI0fQ.Dbc_CBFyHDhuWsh59k5PBURl4ts2CtuwhPin51i9DkY";
  let base = { "x-auth-token": token, "Content-Type": "application/json" };
  it("delete an existing user", function (done) {
    request(app).delete("/api/users/john").set(base).expect(200);
    done();
  });
});
