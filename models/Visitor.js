// models/Visitor.js
const mongoose = require('mongoose');
const Attraction = require('./Attraction');  // Correct capitalization

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Please enter a valid email address'
    ],
    validate: {
      validator: async function(email) {
        try {
          if (this.isNew || this.isModified('email')) {
            const visitor = await this.constructor.findOne({ email });
            return !visitor;
          }
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Email address is already in use'
    }
  },
  visitedAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attraction',
    validate: {
      validator: async function(id) {
        const attraction = await Attraction.findById(id);
        return attraction !== null;
      },
      message: 'Referenced attraction does not exist'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
