// routes/attractions.js
const express = require('express');
const router = express.Router();
const Attraction = require('../models/Attraction');

// IMPORTANT: Place GET /top-rated BEFORE any routes with :id parameters
router.get('/top-rated', async (req, res) => {
  try {
    const topAttractions = await Attraction.find()
      .sort({ averageRating: -1 })
      .limit(5);
    return res.json(topAttractions);  // Added return statement
  } catch (error) {
    return res.status(500).json({ message: error.message });  // Added return statement
  }
});

// Get all attractions
router.get('/', async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.json(attractions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create attraction
router.post('/', async (req, res) => {
  try {
    const attraction = new Attraction(req.body);
    await attraction.save();
    res.status(201).json(attraction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single attraction by ID - MUST come AFTER /top-rated route
router.get('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' });
    res.json(attraction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attraction
router.put('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' });
    res.json(attraction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attraction
router.delete('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id);
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' });
    res.json({ message: 'Attraction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
