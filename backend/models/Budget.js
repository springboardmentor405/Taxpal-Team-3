const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budget_amount: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  month: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);