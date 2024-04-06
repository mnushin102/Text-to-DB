const test = require("./parse")

console.log("Test from SQL\n")
var text = "CREATE TABLE emp\nempno INT PRIMARY KEY\nename VARCHAR(10)\njob VARCHAR(9)\nmgr INT NULL"
console.log(test(text, false))

console.log("\nTest to SQL\n")
var text = "Class emp{\nint empno\nstring ename\nstring job\nint mgr}"
console.log(test(text, true))