// Implementing CRUD (Create, Read, Update, Delete) for a user defined by a schema model
// Used https://www.youtube.com/watch?v=fgTGADljAeg for reference
// Importing all the dependencies needed for this RESTAPI
const express = require("express");
const router = express.Router();
const Database = require("../models/Database");
const generateSQLForClass = require("../js/create_database.js");
const spelling_correction  = require("../js/spelling_correction")
const convention_checker  = require("../js/convention-checking")

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
        // Using a bunch of lists and dictionaries to spell and convention check everything in database elements
        var revised_list = []
        var modified_class = ""
        var modified_attr = ""
        var temp_dict = {}
        var temp_list = []
        var temp_attr_dict = {}
        // Going through all of the classes and its attributes
        for (let  i = 0; i < req.body.database_elements.length; i++){
            modified_class = convention_checker(spelling_correction(req.body.database_elements[i].class_name), "class")
            temp_dict["class_name"] = modified_class
            for (let j = 0; j < req.body.database_elements[i].attribute_list.length; j++){
                modified_attr = convention_checker(spelling_correction(req.body.database_elements[i].attribute_list[j].attribute), "attribute")
                temp_attr_dict["attribute"] = modified_attr;
                temp_attr_dict["type"] = req.body.database_elements[i].attribute_list[j].type
                temp_list.push(temp_attr_dict)
                temp_attr_dict = {}
            }
            temp_dict["attribute_list"] = temp_list
            revised_list.push(temp_dict)
            temp_list = []
            temp_dict = {}
        }
        // Creating a database object that can easily be saved into MongoDB following the Database.js schema
        const database = new Database({
            database_name: req.body.database_name,
            database_owner: req.body.database_owner, // Ownership won't be transferrable
            database_elements: revised_list,
            database_class_relationships: req.body.database_class_relationships
        });
    
        // Saving the database to MongoDB
        const newDatabase = await database.save();
        res.status(SUCCESS_201).json(newDatabase);
    } catch (err) {
        res.status(ERROR_400).json({err:err.message});
    } 
});

// Retrieves all database projects pertaining to a user
router.post('/retrieve_all_user_databases', async (req,res) => {
    try {
        var database_projects = []
        for (var i=0; i < req.body.database_id.length; i++){
            database_projects.push(await Database.find({database_id: req.body.database_id[i]}))
        };
        res.json({database_projects: database_projects})
    } catch (error) {
        console.log(error)
        res.status(ERROR_400).json({err:error.message});
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
router.delete(`/delete_database_by_id/:db_to_delete`, async(req,res) => {
    try {
        const deleted_db = await Database.findOneAndDelete({ database_id: req.params.db_to_delete });
        res.json({ message: "Database Project deleted" });
    } catch (err) {
        res.status(ERROR_500).json({message:err.message});
    }
}); 

module.exports = router;
