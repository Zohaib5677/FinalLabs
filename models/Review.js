// models/Review.js
const mongoose = require('mongoose');
const Attraction = require('./Attraction'); 
const Visitor = require('./Visitor'); 
const reviewSchema = new mongoose.Schema({
  attraction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
    required: [true, 'Attraction is required']
  },
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: [true, 'Visitor is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [5, 'Score cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Compound index to ensure one review per visitor per attraction
reviewSchema.index({ attraction: 1, visitor: 1 }, { 
  unique: true,
  message: 'You have already reviewed this attraction'
});

// Pre-save hook to validate visitor has visited the attraction
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const visitor = await mongoose.model('Visitor').findById(this.visitor);
    if (!visitor) {
      throw new Error('Visitor not found');
    }
    if (!visitor.visitedAttractions.includes(this.attraction)) {
      throw new Error('Visitor must visit the attraction before posting a review');
    }
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
