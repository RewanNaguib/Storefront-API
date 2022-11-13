# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index     ('/products')
- Show      ('/products/:id')
- Create    ('/products') [token required]
- [OPTIONAL] Top 5 most popular products 

#### Users
- Index ('/users') [token required]  
- Show  ('/users/:id') [token required]   
- Create "registeration  / signup" ('/users/signup') [token required] 
- Create "Authentication / signin" ('/users/signin') [token required] 

#### Orders
- Create Order ('/orders') [token required]
- Current Order by user (args: user_id) ('/users/:id/orders') [token required]   
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
- id    (INTEGER)
- name  (VARCHAR(150)) (NOT NULL)
- price (INTEGER) (NOT NULL)


#### User
- id (INTEGER)
- name (VARCHAR(150)) (NOT NULL)
- email (VARCHAR(200))(unique) (NOT NULL)
- password (VARCHAR(150)) (NOT NULL)

#### Orders
- id (INTEGER)
- status of order (active or complete) (ENUM) (DEFAULT "active") (NOT NULL)
- user_id (INTEGER) (FOREIGN KEY)

#### Orders_products
- id (INTEGER)
- order_id (INTEGER) (FOREIGN KEY)
- product_id (INTEGER) (FOREIGN KEY)
- quantity of each product in the order (INTEGER) (NOT NULL)


