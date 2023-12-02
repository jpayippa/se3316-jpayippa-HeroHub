const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  heroListId: { type: mongoose.Schema.Types.ObjectId, ref: 'HeroList' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
