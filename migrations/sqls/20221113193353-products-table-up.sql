CREATE TABLE IF NOT EXISTS products(
    id serial PRIMARY KEY,
    productname VARCHAR(150) NOT NULL,
    productprice INTEGER NOT NULL
);