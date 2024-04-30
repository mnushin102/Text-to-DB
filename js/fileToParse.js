/*
Zoe White - Runs the parse function through a file 
*/
const test = require("./parse")

function fileToParse(file = "", toSQL = True){
    const fs = require('fs')
    let output = '';
    fs.readFile(file, "utf8", function (err, data){
        if (err) return callbackify(err, null);
        var newdata= data.toString()
        console.log(newdata + "\n")
        newdata = test(newdata, toSQL)
        console.log(newdata)
        return newdata;
        output = test(data, toSQL)
        console.log(output)
     })
     console.log(output)
}

module.exports = fileToParse