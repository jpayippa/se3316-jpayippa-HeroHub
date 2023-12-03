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
const Review = require('./models/review.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authenticateToken = require('./utils/verifyJWT');

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
    const { firebaseId, username, email} = req.body;

   


    // Create a new user instance
    const newUser = new User({
      firebaseId: firebaseId,
      nickname:username,
      email:email,
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

app.post('/api/users/update-verification', async (req, res) => {
  console.log(req.body);
  const { firebaseId } = req.body;

  try {
      await User.findOneAndUpdate({ firebaseId }, { emailVerified: true });
      res.send('User verification status updated');
  } catch (error) {
      res.status(500).send('Error updating user');
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
      { userId: user._id, email: user.email, nickname: user.nickname, firebaseId: user.firebaseId},
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email: user.email, nickname: user.nickname, verified: user.emailVerified, isDisabled: user.isDisabled } });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
});

// Endpoint to verify token
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});





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

// ====================== Reviews Endpoints ====================== //

// POST endpoint to create a review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
      const { rating, comment, heroListId } = req.body;
      const createdBy = req.user.nickname; // Extract nickname from authenticated user

      const newReview = new Review({
          rating,
          comment,
          heroListId,
          createdBy
      });

      await newReview.save();
      res.status(201).json(newReview);
  } catch (error) {
      res.status(500).json({ error: 'Error creating review' });
  }
});


// GET endpoint to retrieve reviews by heroListId
app.get('/api/reviews/heroList/:id', async (req, res) => {
  try {
      const reviews = await Review.find({ heroListId: req.params.id });
      res.json(reviews);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// GET endpoint to retrieve reviews by createdBy
app.get('/api/reviews/user/:nickname', async (req, res) => {
  try {
      const reviews = await Review.find({ createdBy: req.params.nickname });
      res.json(reviews);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// PUT endpoint to update review visibility
app.put('/api/reviews/:id/visibility', authenticateToken, async (req, res) => {
  try {
      const review = await Review.findByIdAndUpdate(
          req.params.id,
          { $set: { visible: req.body.visible } },
          { new: true }
      );
      res.json(review);
  } catch (error) {
      res.status(500).json({ error: 'Error updating review visibility' });
  }
});

// DELETE endpoint to delete a review
app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting review' });
  }
});




// --------------------------End of Endpoints-----------------------------------//
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});