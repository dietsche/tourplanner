console.log("SErver");
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db"); //we need it???
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const fetch = require("node-fetch");
const { keyMap, keyWeather } = require("./secrets.json");

app.use(compression());
app.use(express.json());
app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", async (req, res) => {
    const { first, last, email, password, street, nr, city, zip } = req.body;

    let ApiURL = "https://maps.googleapis.com/maps/api/geocode/json?";
    let params = `address=${street}+${nr}+${zip}+${city}&key=${keyMap}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;

    console.log("finalApiURL:\n");
    console.log(finalApiURL);

    try {
        let response = await fetch(finalApiURL);
        let responseJson = await response.json();
        console.log("responseJson:\n");
        let userLat = responseJson.results[0].geometry.location.lat;
        let userLong = responseJson.results[0].geometry.location.lng;
        console.log("USERLAT UND LONG? ", userLat, userLong);

        let hashedPassword = await hash(password);
        let result = await db.addUserData(
            first,
            last,
            email,
            hashedPassword,
            street,
            nr,
            city,
            zip,
            userLat,
            userLong
        );
        console.log("results: ", result.rows[0]);
        req.session.userId = result.rows[0].id;
        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });

        console.log("error in post registration: ", error);
    }
});

app.post("/login", async (req, res) => {
    console.log("server: post-login runs");
    try {
        console.log("server: post-login runs");
        let savedPassword = await db.getHashedPassword(req.body["email"]);
        let userId = savedPassword.rows[0].id;
        let compareResult = await compare(
            req.body["password"],
            savedPassword.rows[0].password
        );
        if (compareResult == true) {
            req.session.userId = userId;
            res.json({
                success: true
            });
        } else if (compareResult == false) {
            res.json({
                success: false
            });
        }
    } catch (error) {
        res.json({
            success: false
        });

        console.log("error in post login: ", error);
    }
});

app.post("/add-destination", async (req, res) => {
    let {
        title,
        description,
        street,
        nr,
        zip,
        city,
        lat,
        long,
        car,
        train,
        bike,
        foot,
        norain,
        rain,
        hot,
        cold
    } = req.body;
    console.log("server: add destination runs");
    let destLat = lat;
    let destLong = long;

    try {
        let favourite = false;

        if (destLat == null || destLong == null) {
            let ApiURL = "https://maps.googleapis.com/maps/api/geocode/json?";
            let params = `address=${street}+${nr}+${zip}+${city}&key=${keyMap}`;
            let finalApiURL = `${ApiURL}${encodeURI(params)}`;
            console.log("finalApiURL:");
            console.log(finalApiURL);
            let response = await fetch(finalApiURL);
            let responseJson = await response.json();
            console.log("responseJson:", response);
            destLat = responseJson.results[0].geometry.location.lat;
            destLong = responseJson.results[0].geometry.location.lng;
        }
        console.log(
            "data for db: ",
            title,
            description,
            street,
            nr,
            city,
            zip,
            destLat,
            destLong,
            car,
            train,
            bike,
            foot,
            norain,
            rain,
            hot,
            cold,
            favourite,
            req.session.userId
        );

        let addDestination = await db.addDestination(
            title,
            description,
            street,
            nr,
            city,
            zip,
            destLat,
            destLong,
            car,
            train,
            bike,
            foot,
            norain,
            rain,
            hot,
            cold,
            favourite,
            req.session.userId
        );
        console.log("succes, addDestination: ", addDestination);
        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });

        console.log("error in post add destination: ", error);
    }
});

app.post("/update-favourites", async (req, res) => {
    console.log(
        "update fav runs, parameters: ",
        req.body.id,
        req.body.favourite
    );
    try {
        let { id, favourite } = req.body;

        let changedFavourites = await db.changeFavourites(
            id,
            req.session.userId,
            favourite
        );
        console.log("changedFavourites: ", changedFavourites);
        res.json({
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });

        console.log("error in update favourites: ", error);
    }
});

app.get("/api/user", async (req, res) => {
    try {
        console.log("get user route running");
        let userId = req.session.userId;
        console.log("userId: ", userId);
        let userData = await db.getUserData(userId);
        console.log("userData:", userData.rows[0]);
        let { first, last, lat, long } = userData.rows[0];
        console.log("first ", first);
        res.json({
            success: true,
            first: first,
            last: last,
            lat: lat,
            long: long
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/destinations", async (req, res) => {
    try {
        let userId = req.session.userId;
        let destinationData = await db.getDestinationData(userId);
        console.log("destinationData:", destinationData.rows);
        res.json({
            destinationData: destinationData.rows,
            success: true
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.post("/calculate-distance", async (req, res) => {
    let {
        latitude,
        longitude,
        userLat,
        userLong,
        street,
        nr,
        zip,
        city
    } = req.body;
    console.log("latitude etc im SERVER: ", latitude, longitude);
    if (
        isNaN(latitude) ||
        latitude == null ||
        isNaN(longitude) ||
        longitude == null
    ) {
        console.log("if schleife läuft: berechnung lat-long der destination");
        let ApiURL = "https://maps.googleapis.com/maps/api/geocode/json?";
        let params = `address=${street}+${nr}+${zip}+${city}&key=${keyMap}`;
        let finalApiURL = `${ApiURL}${encodeURI(params)}`;
        console.log("finalApiURL: ", finalApiURL);
        let response = await fetch(finalApiURL);
        let responseJson = await response.json();
        console.log("responseJson:", response);
        latitude = responseJson.results[0].geometry.location.lat;
        longitude = responseJson.results[0].geometry.location.lng;
    }

    const BaseLocation = `${userLat},${userLong}`;
    const TargetLocation = [latitude, longitude];
    const Mode = ["transit", "driving", "bicycling", "walking"];
    let responseDistance = [];
    for (let i = 0; i < 4; i++) {
        try {
            let ApiURL =
                "https://maps.googleapis.com/maps/api/distancematrix/json?";
            let params = `origins=${BaseLocation}&destinations=${TargetLocation}&mode=${Mode[i]}&key=${keyMap}`;
            let finalApiURL = await `${ApiURL}${encodeURI(params)}`;
            console.log("finalApiURL: ", finalApiURL);
            let response = await fetch(finalApiURL);
            let responseJson = await response.json();
            console.log("responseJson:", responseJson);
            responseJson.rows[0]
                ? responseDistance.push(
                      responseJson.rows[0].elements[0].duration.value
                  )
                : responseDistance.push(null);
        } catch (error) {
            console.error(error);
        }
    }
    res.json({
        success: true,
        time: responseDistance
    });
});

app.get("/getweather", async (req, res) => {
    console.log("weather runs!");
    try {
        const proxy = "https://secret-ocean-49799.herokuapp.com/";
        let weatherData = await fetch(
            `${proxy}https://api.darksky.net/forecast/${keyWeather}/52.5200,13.404954?units=si`
        );
        const weatherJson = await weatherData.json();
        console.log(weatherJson);
        res.json({
            success: true,
            weatherData: weatherJson
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false
        });
    }
});

app.get("/logout", function(req, res) {
    console.log("LOGOUT");
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
