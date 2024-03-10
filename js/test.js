// Import the spelling_correction function from spelling_correction.js
const spelling_correction = require("../js/spelling_correction.js");

// Sample text to test
const sampleTexts = [
    "Thiis is somee samplee texxt to testt the spelling correctioon function",
    "I hvee aa llot of worrkkk to doo todaay",
    "Ie wass thinkinnngg aboouutt goinngg tto the mooviie tonightt",
    "Wheeree aree youu goiingg to thiss yeearr"
];

console.log("\n");

// Correct the sample texts
sampleTexts.forEach(text => {
    const correctedText = spelling_correction(text);
    console.log("Input:", text);
    console.log("Output:", correctedText);
    console.log(); // Add a blank line between each pair of input and output
});
