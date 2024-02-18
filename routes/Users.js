// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference

// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const User = require("../models/Users")

// Statuses defined by https://expressjs.com/en/guide/error-handling.html
const ERROR_400 = 400; // User inputs incorrect data
const ERROR_404 = 404; // Not found error
const ERROR_500 = 500; // Server side error
const SUCCESS_200 = 200; // Request was successful
const SUCCESS_201 = 201; // Successfully created (an object)

// Creates a middleware function that uses request and response, as well as Express's next
// function to continue to the next request
async function userRetrieve(req, res, next) {
    let user;
    try {
        user = await User.findOne({email:req.params.email})
        if (!user){
            return res.status(ERROR_400).json({message:"USER NOT FOUND!"})
        }
    } catch (err) {
        return res.status(ERROR_500).json({err:err.message})
    }
    res.user = user;

    next();
}

// Retrieves all users in the database
router.get('/', async (req,res) => {
    try {
        // Gathers all the users, and if found, returns all users within the collection
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.status(ERROR_500).json({err:err.message});
    }
});

// Retrieves ONE user given a username as parameter
router.get('/email/:email', userRetrieve, async (req,res) => {
    res.json(res.user);
    /*
    try {
        const user = await User.findOne({email : req.params.email});
        if (!user){
            return res.status(ERROR_404).json({message:"USER NOT FOUND!"});
        } 
        else{
            res.status(SUCCESS_200).json(user);
        }
    } catch (err) {
        res.status(ERROR_500).json({err:err.message});
    } */
});

// Creates a new user, using post
router.post('/', async (req,res) => {
    const user = new User({
        email:req.body.email,
        password:req.body.password
    });
    try {
        const newUser = await user.save();
        res.status(SUCCESS_201).json(newUser);
    } catch (err) {
        res.status(ERROR_400).json({err:err.message});
    }
    
});

// Updates an existing user, given a username
router.patch('/email/:email', userRetrieve, async(req,res) => {
    if (req.body.email != null){
        res.user.email = req.body.email;
    }
    if (req.body.password != null){
        res.user.password = req.body.password;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);        
    } catch (err) {
        res.status(ERROR_400).json({message:err.message});
    }
});

// Deletes an existing user
router.delete('/email/:email', userRetrieve, async(req,res) => {
    try {
        await User.findOneAndDelete({ email: req.params.email });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(ERROR_500).json({message:err.message})
    }
});

module.exports = router;