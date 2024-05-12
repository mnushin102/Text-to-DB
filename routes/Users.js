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
const { route } = require("./Database");

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
        const current_user = {
            name: user.email,
        }
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
router.get('/', authenticateToken, async (req,res) => {
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

// Uploads profile picture for a user that is currently logged in
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

// Returns list of database projects a user has
router.get('/return_db_projects', authenticateToken, async (req,res) => {
    try{
        const user = await User.findOne({email:req.user.name})
        res.json({database_projects:user.database_projects})
    }catch (error){
        res.status(ERROR_400).json({message: error.message})
    }
})

// Updates a user's display name and/or password (email cannot be changed)
router.patch('/user_display_name_password', authenticateToken, async(req,res) => {
    // Can only change user name and password
    if (req.body.display_name != null){
        res.user.display_name = req.body.display_name;
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

// Updates a user's database project list
router.patch('/update_database_project_list', authenticateToken, async(req,res) => {
    const user = await User.findOne({ email: req.user.name });
    // Can only change user name and password
    if (req.body.database_projects != null){
        user.database_projects.push(req.body.database_projects);
    }
    try {
        const updatedUser = await user.save();
        res.json(updatedUser);        
    } catch (err) {
        res.status(ERROR_400).json({message:err.message});
    }
});

// Updating user's profile information
router.patch('/update_profile', authenticateToken, async(req,res) => {
    const info = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            {email:req.user.name},
            {$set: {
                first_name:info.first_name,
                last_name:info.last_name,
                phone_number:info.phone,
                user_bio:info.bio
            }},
            {new: true}
        );
        res.json(updatedUser);        
    } catch (err) {
        res.status(ERROR_400).json({message:err.message});
    }
});

// Updating user's password and username
router.patch('/update_password', authenticateToken, async(req,res) => {
    const info = req.body
    try {
        const updatedUser = await User.findOneAndUpdate(
            {email:req.user.name},
            {$set: {password:info.new}},
            {new: true}
        );
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

// Updates user's database project list
router.patch('/delete_database_by_id', authenticateToken, async(req,res) => {
    try {
        const deleted_db = await User.findOneAndUpdate(
            {email:req.user.name},
            { $pull: {database_projects: req.body.database_id}},
            { new: true }
        );

    } catch (error) {
        res.status(ERROR_400).json({message:error.message})
    }
});

module.exports = router;