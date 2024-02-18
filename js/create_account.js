const mongoose = require('mongoose')

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const user_info = mongoose.model('user_info', user);

const createAccount = async (email, password) => {
    try {
        const new_user = new user_info({ email, password });
        await new_user.save();
        console.log("The account was successfully created!");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = createAccount;
