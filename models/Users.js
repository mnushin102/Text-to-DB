// Author of this file: Maitham Harb

const mongoose = require('mongoose');

// Creates a schema to define user
//Updated schema to have more values (may add more later)
const user = new mongoose.Schema({
    email: { type: String, required: true },
    display_name: { type:String, default:"User"},
    password: { type: String, required: true },
    database_projects: { type: Array, default: []},
    collaborators: { type: Array, default: []},
    profile_picture: { type: String, default: ""},
    first_name: { type: String, default:""},
    last_name: { type: String, default: ""},
    phone_number: { type: String, default: ""},
    user_bio: { type: String, default: ""}
});
// Connecting to Database concerning users
// used for reference: https://stackoverflow.com/questions/19474712/mongoose-and-multiple-database-in-single-node-js-project/38516153#38516153
const myDB = mongoose.connection.useDb('user_info');
const User = myDB.model('User', user);

module.exports = User;