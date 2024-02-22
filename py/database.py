import pymongo

# Initalize a connection to MongoDB database using pymongo module
# the username and password is needed to grant access to the database under the owner of the project
myclient = pymongo.MongoClient("mongodb+srv://merajnushin01:2ucgHvXV722ZUiwa@cluster0.lptxj1r.mongodb.net/")
mydb = myclient["Text-To-Database"]
mycol = mydb["Database"]

# Define the attributes for _id, first name, and last name for each variable
mydict1 = { "_id": "1", "first name": "Meraj", "last name": "Nushin" }
mydict2 = { "_id": "2", "first name": "Daniel", "last name": "Moreno" }
mydict3 = { "_id": "3", "first name": "Zoe", "last name": "White" }
mydict4 = { "_id": "4", "first name": "Maitham", "last name": "Harb" }


# Insert each attribute to the database collection using the insert_one method
x = mycol.insert_one(mydict1)
x = mycol.insert_one(mydict2)
x = mycol.insert_one(mydict3)
x = mycol.insert_one(mydict4)


# Retrieved each added attribute from the database
print(mycol.find_one({"_id" : "1"}))
print(mycol.find_one({"_id" : "2"}))
print(mycol.find_one({"_id" : "3"}))
print(mycol.find_one({"_id" : "4"})) 