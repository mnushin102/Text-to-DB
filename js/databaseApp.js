// Import the dependencies for backend
const mongoose = require('mongoose'); 
const express = require('express'); 
const app = express();


mongoose.connect("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info"); 

// Construct a schema with the following data attributes
const schema = {
    student_id: {type: int, required: true, maxLength: 8}, 
    first_name: {type: String, required: true, maxLength: 50}, 
    last_name: {type: String, required: true, maxLength: 50}, 
    major: {type: String, required: true, maxLength: 50} 
}; 

const databaseSchema = new mongoose.model(schema); 

// This function lets the user input the following data to upload to Mongo
async function insertData(){
    app.get("/", function(requests, res) {
        res.sendFile.apply(__dirname, + "/index.html"); 
    })

    app.post("/", function(request, res) {
        let addData = new databaseSchema({
            student_id: req.body.student_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name, 
            major: req.body.major 
        }); 
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

