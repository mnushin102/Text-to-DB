const natural = require("natural");
const fs = require("fs");

// Load the word_frequency.txt file
const dictionaryPath = "js/word_frequency.txt";
const dictionaryContent = fs.readFileSync(dictionaryPath, "utf-8");

// Pre-process the dictionary content into a set for better and faster lookups
const dictionarySet = new Set(dictionaryContent.split("\n").map(line => line.split(' ')[0].toLowerCase()));

// This is the function that will perform the spelling correction
function spelling_correction(text) {
    // Tokenize the input text into words and punctuations
    const tokens = text.toString().match(/\b\w+\b|\s/g);

    // Correct each word
    let correctedText = "";

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // If what is given is a word
        if (/\w+/.test(token)) {
            const word = token.toLowerCase();

            if (dictionarySet.has(word)) {
                // If the word is in the dictionary, keep the word as it is and add it
                correctedText += token;
            } else {
                // Check if the word has consecutive identical characters, if it has remove these extra characters
                const correctedWord = word.replace(/(.)\1+/g, "$1");
                
                // Using the Jaro-Winkler distance, it will give suggestions based on the word
                const suggestions = Array.from(dictionarySet)
                    .filter(dictWord => Math.abs(dictWord.length - correctedWord.length) <= 2)
                    .map(dictWord => ({ word: dictWord, distance: natural.JaroWinklerDistance(correctedWord, dictWord) }))
                    .filter(({ distance }) => distance > 0.7)
                    .sort((a, b) => b.distance - a.distance);

                correctedText += suggestions.length > 0 ? suggestions[0].word : token;
            }
        } else {
            // In case it is a punctuation or a whitespace, keep it also
            correctedText += token;
        }
    }

    // Capitalize the first letter of the corrected text
    correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1);

    return correctedText;
}

module.exports = spelling_correction;
