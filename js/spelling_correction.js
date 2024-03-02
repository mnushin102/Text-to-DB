const natural = require("natural");

const textSpelling = new natural.Spellcheck();

function spelling_correction(text) {
    const words = text.split(/\s+/);

    const correctedText = words.map(word => {
        if(!textSpelling.isCorrect(word)) {
            const suggestion = textSpelling.getCorrections(word, 1);

            if(suggestion.length > 0) {
                return suggestion[0];
            } else {
                return word
            }
        } else {
            return word;
        }
    });

    return correctedText.join(' ');
}

module.exports = spelling_correction;
