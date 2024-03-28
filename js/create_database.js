const fs = require('fs');
const Database = require("../models/Database");

async function generateSQLForClass(className) {
    try {
        // Find the document with the given class name
        const databaseEntry = await Database.findOne({ "database_elements.class_name": className });
        
        if (!databaseEntry) {
            return "Class not found in the database.";
        }

        // Find the class object within the database entry
        const classObject = databaseEntry.database_elements.find(element => element.class_name === className);

        if (!classObject) {
            return "Class not found in the database.";
        }

        // Extract attribute list
        const attributes = classObject.attribute_list;

        // Generate SQL CREATE TABLE statement
        let sql = `CREATE TABLE ${className} (\n`;

        attributes.forEach(attribute => {
            sql += `    ${attribute.attribute} ${attribute.type},\n`;
        });

        // Remove trailing comma and newline
        sql = sql.slice(0, -2) + '\n';

        // Closing bracket
        sql += ');';

        // Write SQL to file
        fs.writeFileSync('generated_file.sql', sql);

        return "SQL file successfully generated.";
    } catch (error) {
        console.error("Error generating SQL:", error);
        return "An error occurred while generating SQL.";
    }
}

module.exports = generateSQLForClass;
