const convention = require("./convention-checking")

console.log("Testing Class Name (Camel Case)")
console.log("------------------------------")
console.log(convention("database","class"))

console.log("------------------------------")
console.log(convention("Electrical EngineerING department","class"))

console.log("------------------------------")
console.log(convention("UNITED STATES OF AMERICA","class"))

console.log("\nTesting Attribute Name (Snake Case)")
console.log("------------------------------")
console.log(convention("database","attribute"))

console.log("------------------------------")
console.log(convention("ElEctrIcaL EnGINEERinG DePARTmenT","attribute"))

console.log("------------------------------")
console.log(convention("UNITED STATES OF AMERICA","attribute"))