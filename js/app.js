// Importing dependencies to use in this backend
const dbConnect = require("./dbConnect");
const express = require("express");
const cors = require("cors")
const app = express();
const userRouting = require("../routes/Users");
const databaseRouting = require("../routes/Database");
// Enable CORS
// CORS is a bit hard to deal with, so installed
// CORS npm package so it is handled more reliably
app.use(cors());


// Makes sure that when the server is "listening",
// it will accept json
app.use(express.json())

// Gets access to user routes for both users and database projects
// used for making HTTPS requests
app.use("/users", userRouting);
app.use("/databases", databaseRouting);

// Attempting to connect to our MongoDB
// User info collection
dbConnect().then(() => {
    // Gets access to database routes, which is responsible
    // for making HTTPS requests regarding database projects
    app.listen(3000, () => {
        console.log("APP LISTENING ON PORT 3000");
    });
}).catch(error => {
    console.error("UNABLE TO CONNECT");
});