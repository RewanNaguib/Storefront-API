# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 



## API Endpoints
#### Products
- Index     ('/products') "GET"
- Show      ('/products/:id') "GET"
- Create    ('/products') [token required] "POST"
- Update    ('/products/:id') [token required] "PATCH"
- Delete    ('/products/:id') [token required] "DELETE"
<!-- - [OPTIONAL] Top 5 most popular products  -->

#### Users
- Index ('/users') [token required]  "GET"
- Show  ('/users/:id') [token required] "GET"
- update ('/users/:id') [token required] "PATCH"
- Delete ('/users/:id') [token required] "DELETE"
- Create "registeration  / signup" ('/signup') [token required] "POST" (username, useremail, userpassword)
- Create "Authentication / signin" ('/login') [token required] "POST"  (useremail, userpassword)

#### Orders
- Index ('/orders') [token required] "GET"
- Show ('/orders/:id') [token required] "GET"
- Get user orders  "orders of specific user"  ('/users/:id/orders') [token required] "GET"
- Get order details ('/order-details/:id') [token required] "GET"
- Create "order for specific user"  ('/users/:id/orders') [token required] "POST"
- Add product to Order ('/add-products/orders/:id') [token required] "POST"
- [OPTIONAL] Completed Orders by user (args: user id) ('/users/:id/closed-orders') [token required] "GET"
- Update order status to be closed ('/closed-order/:id') [token required] "PATCH"



## Data Shapes
#### Product
- id    (INTEGER)
- productname  (VARCHAR(150)) (NOT NULL)
- productprice (INTEGER) (NOT NULL)

#### Users
- id (INTEGER)
- username (VARCHAR(150)) (NOT NULL)
- useremail (VARCHAR(200))(unique) (NOT NULL)
- userpassword (VARCHAR(150)) (NOT NULL)

#### Orders
- id (INTEGER)
- orderstatus (open or closed) (ENUM) (DEFAULT "open") (NOT NULL)
- user_id (INTEGER) (FOREIGN KEY)

#### Order|_products
- id (INTEGER)
- order_id (INTEGER) (FOREIGN KEY)
- product_id (INTEGER) (FOREIGN KEY)
- quantity of each product in the order (INTEGER) (NOT NULL)


