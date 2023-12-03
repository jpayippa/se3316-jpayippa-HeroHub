const mongoose = require('mongoose');

const heroListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  heroes: [Number], // References Hero model
  visibility: { type: String, default: 'private' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // References User model
  createdBy: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('HeroList', heroListSchema);
