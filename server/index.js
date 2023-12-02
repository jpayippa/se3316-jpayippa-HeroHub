// server/index.js

const {
  getPublishers,
  getAllSuperheroInfoByName,
  getAllSuperheroInfoByPower,
  getAllSuperheroInfoByPublisher,
  getAllSuperheroInfoByRace,
  filterSuperheroes
} = require('./utils/functions'); 

const { sanitizeInput } = require( './utils/sanitization');

const mongoose = require('mongoose');

require('dotenv').config();


const express = require("express");
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

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
  
  app.get('/api/publishers', async (req, res) => {
    try {
      const publishers = await getPublishers();
      res.json(publishers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  });
  

  const users = [];

  app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        users.push(user);
        res.status(201).send('User registered successfully');
    } catch {
        res.status(500).send('Error registering user');
    }
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});