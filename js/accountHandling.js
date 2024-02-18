// Importing dependencies to use in this backend
const dbConnect = require("./dbConnect");
const express = require("express");
const app = express();

// Makes sure that when the server is "listening",
// it will accept json
app.use(express.json())

// Gets access to our user routes, which is responsible
// for making HTTPS requests regarding users
const userRouting = require("../routes/Users")
app.use("/users", userRouting)

// Attempting to connect to our MongoDB
// User info collection 
dbConnect().then(() => {
    app.listen(3000, () => {
        console.log("CONNECTED TO MONGODB");
    });
}).catch(error => {
    console.error("UNABLE TO CONNECT");
});