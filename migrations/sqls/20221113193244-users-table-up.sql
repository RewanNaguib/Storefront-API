CREATE TABLE users (
    id serial PRIMARY KEY, 
    username VARCHAR(150) NOT NULL, 
    useremail VARCHAR(200) NOT NULL UNIQUE,
    userpassword VARCHAR(150) NOT NULL 
);