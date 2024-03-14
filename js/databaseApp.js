

// Import the dependencies for backend
const bodyParser = require("body-parser"); 
//const databaseSchema = require("../models/dataSchema"); 
const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const schema = mongoose.Schema; 
//const insertRoute = require("../routes/databaseApp"); 

app.use(bodyParser.urlencoded({extended: true})); 

// Set up a connection to MongoDB 
mongoose.connect("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info", {useNewUrlParser: true}, {useUnifiedTopology: true}); 

const dataSchema = new schema({
    data_variable_1: String, 
    data_variable_2: String 
})

const Data = mongoose.model("database", dataSchema); 

// This function lets the user input the following data to upload to Mongo
app.get("/", function(req, res) {
    res.sendFile(__dirname + "../html/project.html"); 
}); 

// Manually let the user insert the following fields
// so that the user can post these in the database 
app.post("/", function(req, res) {
    // Assign the schema within these fields
    const addData = new Data({
        data_variable_1: req.body.data_variable_1,
        data_variable_2: req.body.data_variable_2 
    }); 

    // save the inputted fields to the database 
    addData.save(function(err, addData){
        if (err) throw error
        res.json(addData); 
    }); 
    res.redirect("/"); 
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

