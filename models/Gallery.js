const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  caption: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
