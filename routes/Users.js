// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference
// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const uuid = require("uuid");
const User = require("../models/Users");
const val = "secretval"; // Will change later for more security
const multer = require("multer"); // Used for profile picture uploads
const sharp = require("sharp");
const path = require("path");

// Statuses defined by https://expressjs.com/en/guide/error-handling.html
const ERROR_400 = 400; // User inputs incorrect data
const ERROR_404 = 404; // Not found error
const ERROR_500 = 500; // Server side error
const SUCCESS_200 = 200; // Request was successful
const SUCCESS_201 = 201; // Successfully created (an object)


// Server Side Login function to validate user's credentials
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Authenticating user on the server side
    try {
        const user = await User.findOne({ email });
        if (!user){
            return res.status(401).json({ message: 'Email Not Found' });
        }
        if (user && user.password !== password) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        // JWT authentication here
        // Information from: https://www.youtube.com/watch?v=mbsmsi7l3r4
        const username = user.email;
        const current_user = {name: username}
        const accessToken = jwt.sign(current_user, val);
        res.json({ message: 'Login successful', accessToken: accessToken });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null){
        return res.sendStatus(401);
    }

    // verifying if user is the one making the requests
    jwt.verify(token, val, (err,user) => {
        if (err){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

// Logout route, removes user's session, they are no longer logged in
router.post('/logout', async (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Creating middleware function for Multer storage
const storage = multer.diskStorage({
    // storing profile picture to img folder
    destination: function (req, file, cb) {
        cb(null, 'img/');
    },
    filename: function (req, file, cb) {
        // Profile Picture name updated to avoid confusion
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create multer instance with the specified storage options as defined above
const upload = multer(
    { storage: storage ,
        // Filter function to make sure file is of correct type
        fileFilter: function (req, file, cb) {
            if (file.mimetype.startsWith('image/')) {
                // If valid file type, image will be uploaded
                // jpg, png, etc
                cb(null, true);
            } else {
                // Else, file will not be accepted
                cb(new Error('Only image files are allowed'));
            }
        }
    });

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
router.get('/user', authenticateToken, async (req,res) => {
    try{
    const user = await User.findOne({email: req.user.name});
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    // Return found user
    res.json({user: user})
    }catch (error){
        res.status(500).json({message:"Server Error"})
    }
    
}); 

router.post('/uploadProfilePicture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Resizing the uploaded image
        const resizedImagePath = 'img/' + Date.now() + path.extname(req.file.originalname);
        await sharp(req.file.path)
            .resize(300, 300)
            .toFile(resizedImagePath);

        // Associating the user's profile picture with a user
        const username = await User.findOne({email: req.user.name});
        const profilePicturePath = resizedImagePath;
        // Finding the user with the email, and then replacing the 
        // current profile picture with the new one user provided
        await User.findOneAndUpdate(
            {email:username.email},
            {$set: {profile_picture: profilePicturePath}},
            {new: true}
        );

        // File uploaded successfully
        return res.status(200).send('File uploaded successfully');

    // Server error
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal server error');
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
router.patch('/', authenticateToken, async(req,res) => {
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
router.delete('/', authenticateToken, async(req,res) => {
    try {
        await User.findOneAndDelete({ email: req.user.name });
        res.json({ message: "User deleted" , deleted_user:deleted_user});
    } catch (err) {
        res.status(ERROR_500).json({message:err.message});
    }
}); 

module.exports = router;