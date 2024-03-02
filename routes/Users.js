// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference
// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const session = require("express-session")
const uuid = require("uuid");
const User = require("../models/Users");

// Statuses defined by https://expressjs.com/en/guide/error-handling.html
const ERROR_400 = 400; // User inputs incorrect data
const ERROR_404 = 404; // Not found error
const ERROR_500 = 500; // Server side error
const SUCCESS_200 = 200; // Request was successful
const SUCCESS_201 = 201; // Successfully created (an object)

// Middleware function for session token generation
// Adds a session token to the user that is logged in, this way easier to retrieve information
function generateSessionToken(req, res, next) {
    // Check if the user has a session token cookie
    let sessionId = req.cookies.sessionId;

    // If the user doesn't have a session token, generate one and attach it to the user
    if (!sessionId) {
        sessionId = uuid.v4(); // Generate a unique session token

        // Set the session token as a cookie with an expiry time (e.g., 1 day)
        res.cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    }

    next(); // Proceed to the next middleware
}

// Session management middleware
// Used to "attach" to a user that is logged in
router.use(session({
    secret: '123456', //Will make more secure later, for testing at the moment
    resave: false,
    saveUninitialized: false
}));

// Server Side Login function to validate user's credentials
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user){
            return res.status(401).json({ message: 'Email Not Found' });
        }
        if (user && user.password !== password) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        // Set user session, this way we can make HTTPS requests with the currently logged-in user
        req.session.user = user;
        res.json({ message: 'Login successful', user:user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route, removes user's session, they are no longer logged in
router.post('/logout', async (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});
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
        res.json(users);
    } catch (err) {
        res.status(ERROR_500).json({err:err.message});
    }
});

// Retrieves ONE user given a username as parameter
router.get('/user', async (req,res) => {
    try{
    const userId = req.session.user.userId;

    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(res.user);
    }catch (error){
        res.status(500).json({message:"Server Error"})
    }
    
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
        res.status(ERROR_500).json({message:err.message});
    }
}); 

module.exports = router;