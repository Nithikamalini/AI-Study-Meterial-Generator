const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  textContext: {
    type: String,
    required: false, // Text extracted from the document
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
