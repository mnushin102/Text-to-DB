const db = require("./databaseApp");

const Database = mongoose.model("Database", databaseSchema)

async function createNewDatabase() {
	try
	{
		console.log("The new database was created successfully!");
	} catch (error) {
		console.error("There was an error in creating the new database:", error);
	}
}
