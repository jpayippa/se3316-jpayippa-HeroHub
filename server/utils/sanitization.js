const MAX_INPUT_LENGTH = 100;

const sanitizeInput = (input) => {
    // Ensure the input is a string
    const inputStr = String(input);

    if (inputStr.length > MAX_INPUT_LENGTH) {
        throw new Error('Input exceeds maximum length');
    }
    // Then sanitize to allow Unicode letters, numbers, and certain other characters
    // This regex allows all Unicode letters, decimal digits, whitespace, and some punctuation
    return input.replace(/[^\p{L}\p{N}\s,.\-_'"]/gu, "").trim();
};

const validateId = (id) => { 
    return /^\d+$/.test(id);
};

module.exports = {
    sanitizeInput,
    validateId
};
