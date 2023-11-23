// server/index.js

const {
  getAllSuperheroInfoByName,
  getAllSuperheroInfoByPower,
  getAllSuperheroInfoByPublisher,
  getAllSuperheroInfoByRace,
  filterSuperheroes
} = require('./utils/functions'); 

const { sanitizeInput } = require( './utils/sanitization');


const express = require("express");
const PORT = process.env.PORT || 3001;



const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware hit:', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
  next();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  app.get("/api/superheroes/search", async (req, res) => {
    try {
      const { name, race, publisher, power } = req.query;
  
      let filters = [];
      if (name) {
        const sanitizedName = sanitizeInput(name);
        const superheroesByName = await getAllSuperheroInfoByName(sanitizedName);
        filters.push(superheroesByName);
      }
      if (race) {
        const sanitizedRace = sanitizeInput(race);
        const superheroesByRace = await getAllSuperheroInfoByRace(sanitizedRace);
        filters.push(superheroesByRace);
      }
      if (publisher) {
        const sanitizedPublisher = sanitizeInput(publisher);
        const superheroesByPublisher = await getAllSuperheroInfoByPublisher(sanitizedPublisher);
        filters.push(superheroesByPublisher);
      }
      if (power) {
        const sanitizedPower = sanitizeInput(power);
        const superheroesByPower = await getAllSuperheroInfoByPower(sanitizedPower);
        filters.push(superheroesByPower);
      }
  
      if (filters.length === 0) {
        return res.status(400).json({ error: 'No search criteria provided' });
      }
  
      const filteredSuperheroesList = filterSuperheroes(filters);
  
      if (filteredSuperheroesList.length === 0) {
        return res.status(404).json({ error: 'No superheroes found with the specified criteria' });
      }
  
      res.json(filteredSuperheroesList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  });
  
  


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});