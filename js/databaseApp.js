import "./models/dataSchema.js"

// Import the dependencies for backend
const mongoose = require('mongoose'); 
const express = require('express'); 
const app = express();
const insertRoute = require("../routes/databaseApp"); 

// Set up a connection to MongoDB 
mongoose.connect("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info"); 

// Assign a schema to the model
const databaseSchema = new mongoose.model(schema); 

// This function lets the user input the following data to upload to Mongo
async function insertData(){
    app.get("/", function(requests, res) {
        res.sendFile.apply(__dirname, + "/index.html"); 
    })

    // Manually let the user insert the following fields
    // so that the user can post these in the database 
    app.post("/", function(request, res) {

        // Assign the schema within these fields
        let addData = new databaseSchema({
            student_id: req.body.student_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name, 
            major: req.body.major 
        }); 

        // save the inputted fields to the database 
        addData.save(); 
    })
}

// Make sure the server is listening to 3001
app.listen(3001, function() {
    try {
        console.log("Successfully connected to MongoDB"); 
    }
    catch {
        console.log("There was an error connecting to Mongo"); 
    }
}); 

