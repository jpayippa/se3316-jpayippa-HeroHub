const fs = require("fs").promises;
const path = require("path");

 const readSuperheroInfo = async () => {
    try {
      // Adjust the path according to your project structure
      const data = await fs.readFile(path.join(__dirname, 'superhero_info.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading superhero info:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  };
  
 const readSuperheroPowers = async () => {
    try {
      // Adjust the path according to your project structure
      const data = await fs.readFile(path.join(__dirname,  'superhero_powers.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading superhero powers:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  };
  
  module.exports = {
    readSuperheroInfo,
    readSuperheroPowers
  };