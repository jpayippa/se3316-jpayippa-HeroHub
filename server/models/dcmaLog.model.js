const mongoose = require('mongoose');

const dmcaLogSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Request', 'Notice', 'Dispute']
  },
  review_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  details: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const DMCA_Log = mongoose.model('DMCA_Log', dmcaLogSchema);

module.exports = DMCA_Log;
