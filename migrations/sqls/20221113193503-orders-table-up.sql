CREATE TYPE order_status_type AS ENUM ('open', 'closed');

CREATE TABLE orders (
    id serial PRIMARY KEY, 
    orderstatus order_status_type NOT NULL DEFAULT 'open', 
    userId INTEGER REFERENCES users(id)
);