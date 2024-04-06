
/*
Zoe White - Function to parse text to and from sql based off the parameters below
*/

function parse(text = "", toSQL = True){
    var output = ""
    //parses the text into sql
    if(toSQL == true){
        //divides the input based on lines into array
        var input = text.split('\n')
        //used to loop through the lines
        var inputLength = input.length
        var input2
        //is and did are just to check if it is a Class so it wont reverse it, and add a "("
        var isClass = false
        var didClass = false
        //loops through each line of the text
        for(var i = 0; i < inputLength; i++){
            input2 = input[i].split(" ")
            var isClass = false      
            var input2Length = input2.length
            //checks if the current line is a "Class" line
            for(var j = 0; j < input2Length; j++){
                str = input2[j].toLowerCase()
                if(str.includes("class")){
                    isClass = true
                }
            }
            //if it isnt a class line it reverses the words so the variable name is after
            if(isClass == false){
                input2.reverse()
            } else {
                isClass = false
            }
            for(var j = 0; j < input2Length; j++){
                //converts the current element to lower case
                str = input2[j].toLowerCase()
                if(str.includes('{') || str.includes('}')){
                    str = str.substring(0,str.length-1)
                }
                if(str.includes("class")){
                    output = output + "CREATE TABLE "
                    isClass = true
                }
                //equivalent of "int"
                else if(str.includes("int")){
                    output = output + " INT"
                }
                //equivalent of "string"
                else if(str.includes("string")){
                    output = output + " VARCHAR(10)"
                } 
                //equivalent of a variable name
                else {
                    output = output + str
                }
            }
            //if this line was a class adds '{' to the end
            if(isClass == true){
                output = output + '('
                isClass = false
                didClass = true
            }
            output = output + '\n'
        }  
        //adds ')' to the end of an entire class
        if(didClass == true){
            output = output + ')'
        }
        return output
    //parses the text from sql
    } else {
        //divides the input based on lines into array
        var input = text.split('\n');
        //used to loop through the lines
        var inputLength = input.length
        var input2
        //is and did are just to check if it is a Class so it wont reverse it, and add a "{"
        var isClass = false
        var didClass = false
        //loops through each line of the text
        for(var i = 0; i < inputLength; i++){
            input2 = input[i].split(" ")
            var isClass = false      
            var input2Length = input2.length
            //checks if the current line is a "Class" line
            for(var j = 0; j < input2Length; j++){
                str = input2[j].toLowerCase()
                if(str.includes("table")){
                    isClass = true
                }
            }
            //if it isnt a class line it reverses the words so the variable name is after
            if(isClass == false){
                input2.reverse()
            } else {
                isClass = false
            }
            //loops through each element in the line
            for(var j = 0; j < input2Length; j++){
                //converts the current element to lower case
                str = input2[j].toLowerCase()
                //uneccessary values
                if(str.includes("create") || str.includes("primary")
                 || str.includes("key") || str.includes("null")){
                    //does nothing to skip uneccessary values
                }
                //equivalent of "class"
                else if(str.includes("table")){
                    output = output + "Class"
                    isClass = true
                }
                //equivalent of "int"
                else if(str.includes("int")){
                    output = output + "int"
                }
                //equivalent of "string"
                else if(str.includes("varchar")){
                    output = output + "string"
                } 
                //equivalent of a variable name
                else {
                    output = output + " " + str
                }
            }
            //if this line was a class adds '{' to the end
            if(isClass == true){
                output = output + '{'
                isClass = false
                didClass = true
            }
            output = output + '\n'
        }     
        //adds '}' to the end of an entire class
        if(didClass == true){
            output = output + '}'
        }
        return output  
    }
}

module.exports = parse