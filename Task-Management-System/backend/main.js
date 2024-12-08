const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { accessLog, errorLog, notFound } = require("./middleware/log.middleware");
const routes = require("./routes");
const connectDB = require('./database/connection');

const app = express();

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

// connecting to DB
connectDB(); 

// Set cores in request header
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// parse request to body-parser
app.use(bodyParser.urlencoded({ extended : true, limit: "16kb"}))
app.use(express.json({limit: "16kb"}));

app.use(cookieParser());

app.use(accessLog);

app.use("/", routes);

app.use(notFound);

app.use(errorLog);

app.listen(PORT, (error) => {
    if (!error)
        console.log(`Server running at http://${HOST}:${PORT}`);
    else
        console.log("Error occurred, server can't start", error);
})

