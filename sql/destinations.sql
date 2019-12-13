DROP TABLE IF EXISTS destinations;


CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    street VARCHAR(255),
    nr VARCHAR(255),
    city VARCHAR(255),
    zip INTEGER,
    lat NUMERIC,
    long NUMERIC,
    car INTEGER,
    train INTEGER,
    bike INTEGER,
    foot INTEGER,
    norain BOOLEAN,
    rain BOOLEAN,
    hot BOOLEAN,
    cold BOOLEAN,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
