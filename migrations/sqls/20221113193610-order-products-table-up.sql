CREATE TABLE order_products(
    id serial PRIMARY KEY, 
    quantity INTEGER NOT NULL, 
    orderId INTEGER REFERENCES orders(id), 
    productId INTEGER REFERENCES products(id)
);