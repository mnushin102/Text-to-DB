const mongoose = require("mongoose"); 

// Construct a schema with the following data attributes
const schema = {
    data_variable_1: {type: String, required: true, maxLength: 50}, 
    data_variable_2: {type: String, required: true, maxLength: 50}
}; 

// Create a model to insert the schema for all of the data attributes 
const databaseSchema = new mongoose.model("databaseSchema", schema); 

// Export this file to databaseSchema
module.export = databaseSchema; 