import "../models/dataSchema.js"

// Import the dependencies for backend
const bodyParser = require("body-parser"); 
const databaseSchema = require("../models/dataSchema"); 
const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const insertRoute = require("../routes/databaseApp"); 

app.use(express.json()); 
app.use(bodyParser.urlencoded({extended: true})); 

// Set up a connection to MongoDB 
mongoose.connect("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info", {useNewUrlParser: true}, {useUnifiedTopology: true}); 

// This function lets the user input the following data to upload to Mongo
app.get("/data", function(req, res) {
    res.sendFile(__dirname + "../html/project.html"); 
}); 

    // Manually let the user insert the following fields
    // so that the user can post these in the database 
app.post("/data", function(req, res) {
    // Assign the schema within these fields
    let addData = new Data({
        data_variable_1: req.body.data_variable_1,
        data_variable_2: req.body.data_variable_2 
    }); 

    // save the inputted fields to the database 
    addData.save(function(err){
        if (err){
            console.log("ERROR!")
        }

        else{
            console.log("ALL GOOD!")
        }
    }); 
    res.redirect("/data"); 
}); 

// Make sure the server is listening to 3001 so that we know we're connected to the MongoDB database
app.listen(3001, function() {
    try {
        console.log("Successfully connected to MongoDB"); 
    }
    catch {
        console.log("There was an error connecting to Mongo"); 
    }
}); 

