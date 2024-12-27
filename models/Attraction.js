// models/Attraction.js
const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  entryFee: {
    type: Number,
    default: 0,
    min: [0, 'Entry fee cannot be negative'],
    max: [5, 'Entry fee cannot exceed 5'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Entry fee cannot be negative'
    },
    required: [true, 'entery fee is required']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  }
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);
