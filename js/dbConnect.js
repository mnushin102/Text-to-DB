// Used: https://www.youtube.com/watch?v=-PdjUx9JZ2E for reference
const mongoose = require('mongoose')

// The connection string used to connect to our database
const connection = "mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info"

// Creating function that will connect to the database
const dbConnection =  async () => {
    // Safely trying to connect, so program doesn't crash if connection is unscucessful
    try {
        // Mongoose (installed by npm), acting as an ODM to interact with MongoDB easily 
       await mongoose.connect(connection, {
        useUnifiedTopology: true,
        useNewUrlParser: true
       }); 
       console.log("Connection to MongoDB was successful!");
    // Catches error and prints into the console if not successful
    } catch (error) {
        console.error(error);
    }
}

// Exporting, so it can be used in other files
module.exports = dbConnection;
