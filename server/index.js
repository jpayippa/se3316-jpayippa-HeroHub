// server/index.js

const {
  getPublishers,
  getAllSuperheroInfoByName,
  getAllSuperheroInfoByPower,
  getAllSuperheroInfoByPublisher,
  getAllSuperheroInfoByRace,
  getSuperheroInfoById,
  filterSuperheroes
} = require('./utils/functions');

const { sanitizeInput } = require('./utils/sanitization');
const User = require('./models/user.model');
const HeroList = require('./models/heroList.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config();


const express = require("express");
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
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

// ====================Authentication Endpoints ==================== //
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/api/register', async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

   


    // Create a new user instance
    const newUser = new User({
      username:username,
      email:email,
      password: hashedPassword,
      updatedAt: new Date(),
    });



    // Save the new user to MongoDB
    await newUser.save();

    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log(req.body);
  
  try {
    const { email } = req.body;

    // Find the user in your database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, nickname: user.nickname},
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email: user.email, nickname: user.nickname } });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
});

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



// ====================Superhero Endpoints ==================== //

app.get("/api/superheroes/search", async (req, res) => {
  try {
    const { name, race, publisher, power, id } = req.query;

    let filters = [];
    if (id) {
      const sanitizedId = sanitizeInput(id);
      const superheroesById = await getSuperheroInfoById(sanitizedId);
      filters.push([superheroesById]);
    }
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




// ====================== Lists Endpoints ====================== //

app.post('/api/hero-lists', authenticateToken, async (req, res) => {
  try {
      const { name, description, heroes, visibility } = req.body;

      const sanitizedName = sanitizeInput(name);
      const sanitizedDescription = sanitizeInput(description);
      const sanitizedHeroes = heroes.map(hero => sanitizeInput(hero));
      const userID = req.user.userId;
      const userName = req.user.nickname;
    
      const newHeroList = new HeroList({
          name: sanitizedName,
          description: sanitizedDescription,
          heroes: sanitizedHeroes, // Array of hero IDs
          visibility,
          createdBy: {
            userID,
            name: userName
        },
          updatedAt: new Date()
      });
      await newHeroList.save();
      res.status(201).json(newHeroList);
  } catch (error) {
      res.status(500).json({ error: 'Error creating hero list' });
  }
});


app.get('/api/hero-lists', async (req, res) => {
  
    try {
        const { visibility, limit } = req.query;

        // Build the query object
        let query = {};
        if (visibility) {
            query.visibility = visibility;
        }

        // Fetch hero lists with optional limit
        let heroLists = await HeroList.find(query);

        if (limit) {
            heroLists = heroLists.slice(0, parseInt(limit));
        }

        res.json(heroLists);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching hero lists' });
    }
});


// Endpoint to get user-specific hero lists
app.get('/api/user-hero-lists', authenticateToken, async (req, res) => {
  console.log(req.user);
  try {
    // Extract nickname from JWT
    const nickname = req.user.nickname;

    // Find all hero lists created by the user
    const heroLists = await HeroList.find({ 'createdBy.name': nickname });


    // Return the hero lists
    res.json(heroLists);
  } catch (error) {
    console.error("Error fetching user's hero lists:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/api/hero-lists/:id', authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;
      const { name, description, heroes, visibility } = req.body;

      const updatedHeroList = await HeroList.findByIdAndUpdate(id, {
          name,
          description,
          heroes,
          visibility,
          updatedAt: new Date()
      }, { new: true });

      if (!updatedHeroList) {
          return res.status(404).json({ error: 'Hero list not found' });
      }

      res.json(updatedHeroList);
  } catch (error) {
      res.status(500).json({ error: 'Error updating hero list' });
  }
});


app.delete('/api/hero-lists/:id',authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;

      const deletedHeroList = await HeroList.findByIdAndDelete(id);

      if (!deletedHeroList) {
          return res.status(404).json({ error: 'Hero list not found' });
      }

      res.status(204).send();
  } catch (error) {
      res.status(500).json({ error: 'Error deleting hero list' });
  }
});







// --------------------------End of Endpoints-----------------------------------//
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});