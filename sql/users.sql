DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    nr VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip INTEGER NOT NULL,
    lat NUMERIC,
    long NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
