const db = require("./databaseApp");
const mongoose = require("mongoose");

async function createNewDatabase() {
	try
	{
		const databaseSchema = new mongoose.Schema({
			name: { type: String, required: true },
			description: { type: String }
		});

		const Database = mongoose.model("Database", databaseSchema);

		const newdb = new Database({
			name: "DatabaseName",
			description: "DatabaseDescription"
		});

		await newDatabase.save();
		
		console.log("The new database was created successfully!");
	} catch (error) {
		console.error("There was an error in creating the new database:", error);
	}
}

module.exports = createNewDatabase;
