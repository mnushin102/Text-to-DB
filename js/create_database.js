const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

app.post('/generate-sql', (req, res) => {
    const { className, attributes } = req.body;

    // Generate SQL content based on the received data
    let sqlContent = `Create table if not exists ${className} (\n`;
    attributes.forEach((attribute, index) => {
        sqlContent += `\t${attribute.name} ${attribute.type}`;
        if (index < attributes.length - 1) {
            sqlContent += ',\n';
        } else {
            sqlContent += '\n';
        }
    });
    sqlContent += ');';

    // Write SQL content to a file
    fs.writeFile('generated_database.sql', sqlContent, (err) => {
        if (err) {
            console.error('Error writing SQL file:', err);
            res.status(500).send('Error generating SQL file');
        } else {
            console.log('SQL file generated successfully');
            // Send the SQL content back to the client
            res.send(sqlContent);
        }
    });
});

app.listen(3002, () => {
    try {
        console.log("Successfully connected to MongoDB"); 
    }
    catch {
        console.log("There was an error connecting to Mongo"); 
    }
});
