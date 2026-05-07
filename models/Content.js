const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  homeContent: {
    aboutText: { type: String, default: 'Welcome to EMEA HSS Special Care Center.' }
  },
  servicesContent: [{
    title: { type: String },
    description: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
