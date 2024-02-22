import "./dbConnect"

// Set up a connection to Mongo
require('mongodb').MongoClient; 

// Set a URL with a username and a password to successfully connect to MongoDB database
const url = "mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/"

// Connect to the MongoDB cluster 
MongoClient.connect(url, function(err, dbConnect)
{
    // If there is a error, then a bad authentication error will occur 
    if (err)
        throw err; 
    
    // Otherwise, the database has been successfully connected  
    console.log("MongoDB database connected"); 

    // close the MongoDB connection 
    dbConnect.close(); 
})
