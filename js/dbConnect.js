// Used: https://www.youtube.com/watch?v=-PdjUx9JZ2E for reference
const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const Database = mongoose.model('Database', user);

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

const createAccount = async (email, password) => {
    try {
        const new_user = new Database({ email, password });
        await new_user.save();
        console.log("The account was successfully created!");
    } catch (error) {
        console.error(error);
    }
};
        

module.exports = { dbConnection, createAccount };
