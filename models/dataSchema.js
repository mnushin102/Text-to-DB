const mongoose = require("mongoose"); 

// Construct a schema with the following data attributes
const schema = new mongoose.Schema({
    data_variable_1: {type: String, required: true, maxLength: 50}, 
    data_variable_2: {type: String, required: true, maxLength: 50}
}); 

// Create a model to insert the schema for all of the data variables 
const databaseSchema = mongoose.model("databases", schema); 

// Export this file to databaseSchema
module.exports = databaseSchema; 