/*
Zoe White - Runs the parse function through a file 
*/
const test = require("./parse")

function fileToParse(file = "", toSQL = True){
    const fs = require('fs')
    var output = ""
    fs.readFile(file, "utf8", function (err, data){
        if (err) throw err;
        output = test(data, toSQL)
        console.log(output)
        return output
     })
}

module.exports = fileToParse