// Author of this file: Maitham Harb

const mongoose = require('mongoose')

// Creates a schema to define user
const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', user);

module.exports = User;