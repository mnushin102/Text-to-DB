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

// Correct the sample texts and log them with dotted lines between each pair
sampleTexts.forEach(text => {
    const correctedText = spelling_correction(text);
    console.log("Input:", text);
    console.log("Output:", correctedText);
    console.log("-".repeat(50));
});

console.log("\n");
