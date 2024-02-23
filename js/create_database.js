const schema = {
	// This is where the JSON schema should be
	};

const databaseSchema = new mongoose.Schema(schema);

const Database = mongoose.model("Database", databaseSchema)

async function createNewDatabase() {
		try
		{
			const newDatabase = new Database({
				tables: []
			});

			await newDatabase.save();
			console.log("The new database was created successfully!");
		} catch (error) {
			console.error("There was an error in creating the new database:", error);
		}
}
