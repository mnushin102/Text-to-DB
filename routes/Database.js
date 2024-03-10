// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference
// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const Database = require("../models/Database");

// Retrieves database projects based on the user
router.get('/database', async (req,res) => {
    try{
    const database = await Database.findOne({database_id: req.database.database_id}); // FETCHES by ID rather than name
    if(!database){
        return res.status(404).json({ message: 'Database Project not found' });
    }
    // Return found database project
    res.json({database:database});
    }catch (error){
        res.status(500).json({message:"Server Error"});
    }
    
}); 

// Creates a new database project, using POST request
router.post('/', async (req,res) => {
    const database = new Database({
        database_name: req.body.database_name,
        database_owner: req.body.database_owner,
        data_variable_1: req.body.data_variable_1,
        data_variable_2: req.body.data_variable_2
    });
    try {
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
    // Changes variable 1 if provided (WILL CHANGE LATER)
    if (req.body.data_variable_1 != null){
        res.database.data_variable_1 = req.body.data_variable_1;
    }
    // Changes variable 2 if provided (WILL CHANGE LATER)
    if (req.body.data_variable_2 != null){
        res.database.data_variable_2 = req.body.data_variable_2;
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
        await Database.findOneAndDelete({ database_id: req.params.database_id });
        res.json({ message: "Database Project deleted" });
    } catch (err) {
        res.status(ERROR_500).json({message:err.message});
    }
}); 

module.exports = router;