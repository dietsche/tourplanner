var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/finalproject"
);

exports.addUserData = function(
    first,
    last,
    email,
    password,
    street,
    nr,
    city,
    zip,
    lat,
    long
) {
    return db.query(
        "INSERT INTO users (first, last, email, password, street, nr, city, zip, lat, long) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [first, last, email, password, street, nr, city, zip, lat, long]
    );
};

exports.getHashedPassword = function(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

exports.getUserData = function(id) {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
};

exports.addDestination = function(
    title,
    description,
    street,
    nr,
    city,
    zip,
    lat,
    long,
    car,
    train,
    bike,
    foot,
    norain,
    rain,
    hot,
    cold,
    userId
) {
    return db.query(
        "INSERT INTO destinations (title, description, street, nr, city, zip, lat, long, car, train, bike, foot, norain, rain, hot, cold, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        [
            title,
            description,
            street,
            nr,
            city,
            zip,
            lat,
            long,
            car,
            train,
            bike,
            foot,
            norain,
            rain,
            hot,
            cold,
            userId
        ]
    );
};

exports.getDestinationData = function(userId) {
    return db.query(
        `SELECT * FROM destinations WHERE user_id = $1 ORDER BY train DESC NULLS LAST`,
        [userId]
    );
};
