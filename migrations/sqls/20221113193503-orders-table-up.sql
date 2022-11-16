DROP TYPE IF EXISTS order_status_type;
CREATE TYPE order_status_type AS ENUM ('open', 'closed');

CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY, 
    orderstatus order_status_type NOT NULL DEFAULT 'open', 
    userId INTEGER REFERENCES users(id)
);