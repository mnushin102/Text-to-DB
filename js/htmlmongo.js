import "./dbConnect"

require('mongodb').MongoClient; 

const url = "mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/"

MongoClient.connect(url, function(err, dbConnect)
{
    if (err)
        throw err; 
    console.log("MongoDB database connected"); 
    dbConnect.close(); 
})
