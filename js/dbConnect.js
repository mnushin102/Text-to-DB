// Used: https://www.youtube.com/watch?v=-PdjUx9JZ2E for reference
const mongoose = require('mongoose')

const connection = "mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/user_info"
const dbConnection =  async () => {
    try {
       await mongoose.connect(connection, {
        useUnifiedTopology: true,
        useNewUrlParser: true
       }); 
       console.log("Connection to MongoDB was successful!");
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnection;
