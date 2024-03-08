// Author of this file: Maitham Harb

const mongoose = require('mongoose');

// Creates a schema to define user
//Updated schema to have more values (may add more later)
const user = new mongoose.Schema({
    email: { type: String, required: true },
    display_name: {type:String, default:"User"},
    password: { type: String, required: true },
    collaborators: {type: Array, default: []},
    profile_picture: {type: String, default: ""}
});

const User = mongoose.model('User', user);

module.exports = User;