const mongoose = require("mongoose"); 

// Construct a schema with the following data attributes
const schema = {
    student_id: {type: Number, required: true, maxLength: 8}, 
    first_name: {type: String, required: true, maxLength: 50}, 
    last_name: {type: String, required: true, maxLength: 50}, 
    major: {type: String, required: true, maxLength: 50} 
}; 

// Create a model to insert the schema for all of the data attributes 
const databaseSchema = new mongoose.model("databaseSchema", schema); 

module.export = databaseSchema; 