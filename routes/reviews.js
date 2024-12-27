// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Visitor = require('../models/Visitor');
const mongoose = require('mongoose');
// Create review with validation

// Create review with validation and rating update
router.post('/', async (req, res) => {
  try {
    const { attraction: attractionId, visitor: visitorId, score, comment } = req.body;

    // Check if visitor exists and has visited the attraction
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (!visitor.visitedAttractions.includes(attractionId)) {
      return res.status(400).json({ 
        message: 'Visitor must visit the attraction before posting a review' 
      });
    }

    // Create review
    const review = new Review({
      attraction: attractionId,
      visitor: visitorId,
      score,
      comment
    });

    await review.save();

    // Update attraction's average rating
    const attraction = await Attraction.findById(attractionId);
    attraction.totalReviews += 1;
    attraction.averageRating = 
      (attraction.averageRating * (attraction.totalReviews - 1) + score) / 
      attraction.totalReviews;
    
    await attraction.save();

    res.status(201).json(review);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Visitor has already reviewed this attraction' 
      });
    }
    res.status(400).json({ message: error.message });
  }
});



// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('attraction')
      .populate('visitor');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('attraction')
      .populate('visitor');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;







