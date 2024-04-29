// Will Check the conventions for classes and attributes
// based on inputs received from dropdown menus and input fields

// From documentation
// https://naturalnode.github.io/natural/Tokenizers.html
// Tokenizer to separate every word from input, easier to work with
const natrual = require("natural");
let tokenizer = new natrual.WordTokenizer();

// Function will handle the conventions for class and attributes
// Will take inputs from user when creating a project and/or 
// adding new information to an existing project
function convention_checker(text, type){
    // Tokenizer takes the input, and adds each word separated by a space to a list
    const input = tokenizer.tokenize(text);
    let output = "";
    let current_word = "";
    // If the type of input (defined by textfields) is a class
    // will format to be camel case
    if (type == "class"){
        // First word is lower case, rest of words have first letter capitalized
        output += input[0].toLowerCase();
        for (var index = 1; index < input.length; index++){
            // Appending one word at a time
            // Making only first letter upper case
            // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
            current_word = input[index];
            output += current_word.charAt(0).toUpperCase() + current_word.slice(1).toLowerCase();
        }
        // Returns output in camelCase
        return output;
    }
    else if(type == "attribute"){
        //First word will not have an underscore in front of it
        output += input[0].toLowerCase();
        for (var index = 1; index < input.length; index++){
            // Appending one word at a time, following close to above
            // Adding an underscore before each word (not including first)
            // to make it easier, compared to after each word
            current_word = input[index];
            output += "_" + current_word.toLowerCase();
        }
        // Returns output in snake_case
        return output;
    }
}

module.exports = convention_checker
