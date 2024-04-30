//const test = require("./parse")
const test2 = require("./fileToParse")

/*console.log("Test from SQL\n")
var text = "CREATE TABLE emp\nempno INT PRIMARY KEY\nename VARCHAR(10)\njob VARCHAR(9)\nmgr INT NULL"
console.log(test(text, false))

console.log("\nTest to SQL\n")
var text = "Class emp{\nint empno\nstring ename\nstring job\nint mgr}"
console.log(test(text, true))

console.log("Test from SQL\n")
var text = "CREATE TABLE car\nID INT PRIMARY KEY\ncompany VARCHAR(10)\nmodel VARCHAR(9)\nyear INT NULL"
console.log(test(text, false))

console.log("\nTest to SQL\n")
var text = "Class Dog{\nstring name\nstring type\nstring size}"
console.log(test(text, true))*/

var text = test2('js/parsetest.txt', false)
//console.log(test2("js/parsetest.txt", false))