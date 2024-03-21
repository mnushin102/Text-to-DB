const mongoose = require("mongoose"); 
const uuid = require("uuid");

// Construct a schema with the following data attributes
const schema = new mongoose.Schema({
    database_name: {type: String, required: true, maxlength: 50},
    database_owner: {type: String, required: true, maxlength: 50},
    database_id: {type: String, required: true, default: uuid.v4}, // Adding a unique identifier to use later for fetching purposes
    data_variable_1: {type: String, required: true, maxLength: 50}, 
    data_variable_2: {type: String, required: true, maxLength: 50}
}); 

// Create a model to insert the schema for all of the data variables 
// Connecting to Database concerning database projects
// used for reference: https://stackoverflow.com/questions/19474712/mongoose-and-multiple-database-in-single-node-js-project/38516153#38516153
const myDB = mongoose.connection.useDb('database_projects');
const Database = myDB.model("Database", schema); 

// Export this file to databaseSchema
module.exports = Database; 