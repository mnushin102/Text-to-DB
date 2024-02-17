const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const createAccount = async (email, password) => {
    try {
        const new_user = new Database({ email, password });
        await new_user.save();
        console.log("The account was successfully created!");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = createAccount;
