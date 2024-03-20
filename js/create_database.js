const db = require("./databaseApp");
const mongoose = require("mongoose");
const fs = require("fs");

function generateSQLFile(className, attributes) {
	let sqlContent = "Create table if it doesn't exist ${className} (\n";

	attributes.forEach((attribute, i) => {
		sqlContent += "\t${attribute.name} ${attribute.type}";

		if (i < attributes.length - 1) {
			sqlContent += ",\n";
		} else {
			sqlContent += "\n";
		}
	});

	sqlContent += ");\n";
	
	fs.writeFile("generated_database.sql", sqlContent, (err) => {
		if (err) {
			console.error("There is an error writing the SQL file:", err);
		} else {
			console.log("The sql file was generated successfully!");
		}
	});
}

async function createNewDatabase(className, attributes) {
	try
	{
		generateSQLFile(className, attributes);
		
		console.log("The new database was created successfully!");
	} catch (error) {
		console.error("There was an error in creating the new database:", error);
	}
}

module.exports = createNewDatabase;
