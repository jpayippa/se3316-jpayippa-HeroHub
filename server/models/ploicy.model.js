const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    enum: ['Security and Privacy Policy', 'DMCA Notice & Takedown Policy', 'Acceptable Use Policy']
  },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
