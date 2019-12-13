const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db"); //we need it???
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const fetch = require("node-fetch");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 5000000 //2 MB limit!
    }
});

//add bodyParsing!?
//user table : petition + image (null); bio

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
    try {
        let hashedPassword = await hash(password);
        let result = await db.addUserData(
            first,
            last,
            email,
            hashedPassword,
            street,
            nr,
            city,
            zip
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
    console.log("server: add destination runs");

    try {
        let addDestination = await db.addDestination(
            req.body["title"],
            req.body["description"],
            req.body["street"],
            req.body["nr"],
            req.body["city"],
            req.body["zip"],
            req.body["lat"],
            req.body["long"],
            req.body["car"],
            req.body["train"],
            req.body["bike"],
            req.body["foot"],
            req.body["norain"],
            req.body["rain"],
            req.body["hot"],
            req.body["cold"],
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

app.get("/api/user", async (req, res) => {
    try {
        console.log("get user route running");
        let userId = req.session.userId;
        console.log("userId: ", userId);
        let userData = await db.getUserData(userId);
        console.log("userData:", userData.rows[0]);
        let { first, last } = userData.rows[0];
        console.log("first ", first);
        res.json({
            success: true,
            first: first,
            last: last
        });
    } catch (error) {
        res.json({
            success: false
        });
    }
});

app.get("/api/destinations", async (req, res) => {
    try {
        let destinationData = await db.getDestinationData();
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
    const { latitude, longitude, mode } = req.body;
    console.log(req.body);

    const BaseLocation = "52.5024756,13.4850351";

    // get locations of targets
    const TargetLocation = [latitude, longitude];
    const Mode = mode;

    // prepare final API call
    let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    let params = `origins=${BaseLocation}&destinations=${TargetLocation}&mode=${Mode}&key=AIzaSyBRGDY9ghWbWBS-JTTlxf2UdtwR8cPaJus`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;

    console.log("finalApiURL:\n");
    console.log(finalApiURL);

    // get duration/distance from base to each target
    try {
        let response = await fetch(finalApiURL);
        let responseJson = await response.json();
        console.log("responseJson:\n");
        console.log(responseJson.rows);
        console.log(
            "responseJson.rows[0]elements: ",
            responseJson.rows[0].elements[0].duration.value
        );
        let newResponse = JSON.stringify(responseJson);
        res.json({
            success: true,
            mode: responseJson.rows[0].elements[0].duration.value
        });
        console.log("newResponse: ", newResponse);
    } catch (error) {
        console.error(error);
    }

    // let destinationData = await db.getDestinationData();
    // console.log("destinationData:", destinationData.rows);
    // res.json({
    //     destinationData: destinationData.rows,
    //     success: true
    // });
});

app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file.filename: ", req.file.filename);
    // sconst { title } = req.body;
    const imageUrl = `${s3Url}/${req.file.filename}`;
    let userId = req.session.userId;
    console.log(" imageUrl: ", imageUrl);
    db.addImage(imageUrl, userId)
        .then(result => {
            console.log("result: ", result);
            res.json({
                success: true,
                image: result.rows[0].image
            });
        })
        .catch(err => {
            console.log("error in post: ", err);
        });
});

app.get("/getweather", async (req, res) => {
    console.log("weather runs!");
    try {
        const proxy = "https://secret-ocean-49799.herokuapp.com/";
        let weatherData = await fetch(
            `${proxy}https://api.darksky.net/forecast/b39a87ea430e5c07642983f67ab8bb76/52.5200,13.404954?units=si`
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
