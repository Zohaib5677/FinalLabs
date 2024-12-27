// routes/visitors.js
const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Create visitor
router.post('/', async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('visitedAttractions');
    res.json(visitors);
    console.log("UE api chl rhi ha");
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single visitor
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('visitedAttractions');
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update visitor
router.put('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete visitor
router.delete('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ message: 'Visitor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// routes/visitors.js
// Add this route to get visitor activity
router.get('/activity', async (req, res) => {
  try {
    const visitorActivity = await Review.aggregate([
      {
        $group: {
          _id: '$visitor',
          reviewCount: { $sum: 1 },
          attractionsReviewed: { $addToSet: '$attraction' }
        }
      },
      {
        $lookup: {
          from: 'visitors',
          localField: '_id',
          foreignField: '_id',
          as: 'visitorInfo'
        }
      },
      {
        $project: {
          _id: 1,
          reviewCount: 1,
          attractionsReviewed: { $size: '$attractionsReviewed' },
          visitorInfo: { $arrayElemAt: ['$visitorInfo', 0] }
        }
      },
      {
        $project: {
          'visitorInfo.visitedAttractions': 0
        }
      }
    ]);

    res.json(visitorActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
