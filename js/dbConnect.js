// Used: https://www.youtube.com/watch?v=-PdjUx9JZ2E for reference
const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
       await mongoose.connect("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/", {
        useUnifiedTopology: true,
        useNewUrlParser: true
       }); 
       console.log("Connection to MongoDB was successful!");
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnection;
