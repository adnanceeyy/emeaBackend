const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/authMiddleware');

// Get content
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content({
        homeContent: { aboutText: 'Welcome to EMEA HSS Special Care Center.' },
        servicesContent: [
          { title: 'Remedial Teaching', description: 'Description here' }
        ]
      });
      await content.save();
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update content
router.put('/', authMiddleware, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content(req.body);
      await content.save();
    } else {
      content.homeContent = req.body.homeContent || content.homeContent;
      content.servicesContent = req.body.servicesContent || content.servicesContent;
      await content.save();
    }
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
