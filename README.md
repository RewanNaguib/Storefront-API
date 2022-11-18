# Storefront Backend Project

### Project Description
* This project is an API for Ecommerce Shopping Cart using Express and PostgreSQL.
* It contain three main entities (User - Product - Order).
* Signup and Login are supported.
* Listing all the users / getting a specifc user by id / update user's data / delete user are supported.
* User can List all the products / get a specific product / create product / update product  / delete product.
* User can also make an order and add products into the order.
* Listing all the orders and the order details for each user are supportes.


### Installing Dependencies
project requires having node installed https://nodejs.org/en/download/

run ```npm install``` to install the dependencies

### content
The Application contains the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

### To Run Server
  run `npm run start`
  port:7070
  
### To Run The Project
 1) Run `npm install`
 2) Create a .env file to add you environmental variables inside it.
    POSTGRES_HOST=<your_host>
    POSTGRES_DB=<your_database_name>
    POSTGRES_TEST_DB=<your_test_database_name>
    POSTGRES_USER=<your_postgres_user>
    POSTGRES_PASSWORD=<your_postgres_password>
    ENV=dev
    BCRYPT_PASSWORD=<bcrypt_password>
    SALT_ROUNDS=10
    TOKEN_SECRET=<your_token_secret>
3) Create an empty database for our application in your DBMS (for dev environment).
4) Create an empty database for our application in your DBMS (for test environment).
5) Migrate the database `db-migrate up`


## Testing
Testing is done using jasmine
To run the tests, run `npm run test`


## Required Technologies
The Application contains the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Endpoints 
All of the end points described in details in the `REQUIREMENTS.md`
