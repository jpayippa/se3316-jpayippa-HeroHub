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
const authenticateAndAuthorizeAdmin = require('./utils/verifyAdmin');
const Policy = require('./models/policy.model');
const DMCA_Log = require('./models/dcmaLog.model');

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
    
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/users/update-verification', async (req, res) => {
  const { firebaseId } = req.body;

  try {
      await User.findOneAndUpdate({ firebaseId }, { emailVerified: true });
      res.send('User verification status updated');
  } catch (error) {
      res.status(500).send('Error updating user');
  }
});


app.post('/api/login', async (req, res) => {
  
  try {
    const { email } = req.body;

    // Find the user in your database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, nickname: user.nickname, firebaseId: user.firebaseId, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { email: user.email, nickname: user.nickname, verified: user.emailVerified, isDisabled: user.isDisabled, role: user.role} });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
});

// Endpoint to verify token
app.get('/api/verify-token', authenticateToken, (req, res) => {
  // Assuming req.user is populated by the middleware
  res.json({
    message: 'Token is valid',
    role: req.user.role // Send back the user's role
  });
});




//=====================Admin Endpoints======================//

app.get('/api/users', authenticateAndAuthorizeAdmin, async (req, res) => {
  try {
      const users = await User.find({ role: { $ne: 'GrandAdmin' } }); // Exclude GrandAdmin
      res.json(users.map(user => {
          return {
              id: user._id,
              firebaseId: user.firebaseId,
              email: user.email,
              nickname: user.nickname,
              role: user.role,
              isDisabled: user.isDisabled,
              emailVerified: user.emailVerified,
           
          };
      }));
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT endpoint to update user's role
app.put('/api/users/:userId/role', authenticateAndAuthorizeAdmin, async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  // Check if the new role is valid
  if (!['admin', 'user'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
  }

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { role: newRole },
          { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User role updated successfully', updatedUser });
  } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// PUT endpoint to update user's disabled status
app.put('/api/users/:userId/disable', authenticateAndAuthorizeAdmin, async (req, res) => {
  const { userId } = req.params;
  const { isDisabled } = req.body;

  try {
    // Find the user by ID and update the isDisabled status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isDisabled: isDisabled },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
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
        const { visibility } = req.query;
        const query = {};

        if (visibility) {
            query.visibility = visibility;
        }

        const heroLists = await HeroList.find(query)
            .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
            .exec();

        res.json(heroLists);
    } catch (error) {
        res.status(500).send('Server error');
    }
});



// Endpoint to get user-specific hero lists
app.get('/api/user-hero-lists', authenticateToken, async (req, res) => {
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

// Endpoint to check if a hero list name already exists for the user
app.post('/api/user-hero-lists/check-name', authenticateToken, async (req, res) => {
  try {
    const userNickname = req.user.nickname;
    const { name } = req.body;


    const existingList = await HeroList.findOne({ name: name, 'createdBy.name': userNickname });

    const exists = !!existingList;
    

    res.json({ exists: exists });
  } catch (error) {
    console.error('Error checking list name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      const sanitizedRating = sanitizeInput(rating);
      const sanitizedComment = sanitizeInput(comment);
      const sanitizedHeroListId = sanitizeInput(heroListId);
      const createdBy = req.user.nickname; // Extract nickname from authenticated user

      const newReview = new Review({
          rating : sanitizedRating,
          comment : sanitizedComment,
          heroListId: sanitizedHeroListId,
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
    const reviewId = req.params.id;
    const { visible } = req.body;

    // Ensure 'visible' is a boolean
    if (typeof visible !== 'boolean') {
      return res.status(400).json({ error: 'Invalid visibility value' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update the 'visible' field of the review
    review.visible = visible;
    await review.save();

    res.json({ message: 'Review visibility updated', review });
  } catch (error) {
    console.error(error);
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

// =========================Privacy and DCMA endpoints ========================= //

const authenticateAndAuthorizeGrandAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Check if the user role is admin or GrandAdmin
      if (user.role !== 'GrandAdmin') {
          return res.status(403).json({ error: 'Unauthorized access' });
      }

      req.user = user; // Add user information to the request
      next();
  });
};

//creating and updating policy
app.post('/api/policies', authenticateAndAuthorizeGrandAdmin, async (req, res) => {
  const { title, content } = req.body;
  console.log('Creating policy:', title);
  console.log('Content:', content);

  try {
    const existingPolicy = await Policy.findOne({ title });

    if (existingPolicy) {
      existingPolicy.content = content;
      existingPolicy.updated_at = new Date();
      await existingPolicy.save();
    } else {
      const newPolicy = new Policy({ title, content });
      await newPolicy.save();
    }

    res.status(200).json({ message: 'Policy updated successfully' });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//retirive policy
app.get('/api/policies/:title', async (req, res) => {
  console.log('Fetching policy:', req.params.title);
  try {
    const policy = await Policy.findOne({ title: req.params.title });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json(policy);
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Log DMCA activities
app.post('/api/dmca-logs', authenticateAndAuthorizeGrandAdmin, async (req, res) => {
  const { type, review_id, details } = req.body;

  try {
    const newLog = new DMCA_Log({ type, review_id, details });
    await newLog.save();

    res.status(200).json({ message: 'DMCA activity logged successfully' });
  } catch (error) {
    console.error('Error logging DMCA activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update review status to DMCA
app.put('/api/reviews/:id/dmca-status', authenticateAndAuthorizeGrandAdmin, async (req, res) => {
  const { dmca_status } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { dmca_status }, { new: true });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error updating review DMCA status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







// --------------------------End of Endpoints-----------------------------------//
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});