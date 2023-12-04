const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  visible: { type: Boolean, default: true },
  heroListId: { type: String, required: true},
  createdBy: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  dmca_status: {
    type: String,
    enum: ['Active', 'DMCA_Takedown', 'Disputed'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Review', reviewSchema);
