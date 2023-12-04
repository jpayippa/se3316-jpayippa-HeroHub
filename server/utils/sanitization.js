const MAX_INPUT_LENGTH = 200;

const sanitizeInput = (input) => {
    // If input is not a string, return it as is (assuming it's a valid ID or similar)
    if (typeof input !== 'string') {
        return input;
    }

    // If input is a string, sanitize it
    const inputStr = input;
    if (inputStr.length > MAX_INPUT_LENGTH) {
        throw new Error('Input exceeds maximum length');
    }
    // Then sanitize to allow Unicode letters, numbers, and certain other characters
    // This regex allows all Unicode letters, decimal digits, whitespace, and some punctuation
    return inputStr.replace(/[^\p{L}\p{N}\s,.\-_'"]/gu, "").trim();
};


const validateId = (id) => { 
    return /^\d+$/.test(id);
};

module.exports = {
    sanitizeInput,
    validateId
};
