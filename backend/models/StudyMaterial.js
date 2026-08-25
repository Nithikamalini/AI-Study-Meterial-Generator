const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Document',
  },
  type: {
    type: String,
    enum: ['summary', 'mcqs', 'flashcards', 'short-questions', 'long-questions', 'important-topics', 'quiz'],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can be text, array of objects (MCQs), etc.
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

module.exports = StudyMaterial;
