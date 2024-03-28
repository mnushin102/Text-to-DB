// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference
// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const Database = require("../models/Database");
const generateSQLForClass = require("../js/create_database.js");

// Statuses defined by https://expressjs.com/en/guide/error-handling.html
const ERROR_400 = 400; // User inputs incorrect data
const ERROR_404 = 404; // Not found error
const ERROR_500 = 500; // Server side error
const SUCCESS_200 = 200; // Request was successful
const SUCCESS_201 = 201; // Successfully created (an object)

// Retrieves database projects based on the user
router.get('/database', async (req,res) => {
    try{
    const database = await Database.findOne({database_id: req.body.database_id}); // FETCHES by ID rather than name
    if(!database){
        return res.status(404).json({ message: 'Database Project not found' });
    }
    // Return found database project
    res.json({database:database});
    }catch (error){
        res.status(500).json({message:"Server Error"});
    }
    
});

// Generate SQL for a class schema
router.get('/generate-sql/:className', async (req, res) => {
    try {
        const className = req.params.className;
        const result = await generateSQLForClass(className);
        res.send(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Creates a new database project, using POST request
router.post('/', async (req,res) => {
    try{
        const database = new Database({
            database_name: req.body.database_name,
            database_owner: req.body.database_owner, // Ownership won't be transferrable
            database_elements: req.body.database_elements,
            database_class_relationships: req.body.database_class_relationships
        });
    
        const newDatabase = await database.save();
        res.status(SUCCESS_201).json(newDatabase);
    } catch (err) {
        res.status(ERROR_400).json({err:err.message});
    } 
});

// Updates an existing database project
router.patch('/', async(req,res) => {
    // Changes database name if provided
    if (req.body.database_name != null){
        res.database.database_name = req.body.database_name;
    }
    // Updates elements in a database projects
    if (req.body.database_elements != null){
        res.database.database_elements = req.body.database_elements;
    }
    // Updates relationships between classes
    if (req.body.database_class_relationships != null){
        res.database.database_class_relationships = req.body.database_class_relationships;
    }
    try {
        const updatedDatabase = await res.database.save();
        res.json(updatedDatabase);        
    } catch (err) {
        res.status(ERROR_400).json({message:err.message});
    }
});

// Deletes an existing database project
router.delete('/', async(req,res) => {
    try {
        await Database.findOneAndDelete({ database_id: req.body.database_id });
        res.json({ message: "Database Project deleted" });
    } catch (err) {
        res.status(ERROR_500).json({message:err.message});
    }
}); 

module.exports = router;
