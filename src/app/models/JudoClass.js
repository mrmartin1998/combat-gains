import mongoose from 'mongoose';

const TechniqueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide technique name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide technique category'],
    enum: ['throws', 'pins', 'submissions', 'combinations', 'drills'],
  },
  notes: String,
});

const PartnerWorkSchema = new mongoose.Schema({
  partnerName: String,
  duration: Number, // in minutes
  type: {
    type: String,
    enum: ['drilling', 'situational', 'sparring'],
    required: true,
  },
  notes: String,
});

const JudoClassSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide class date'],
    default: Date.now,
  },
  duration: {
    type: Number,
    required: [true, 'Please provide class duration'],
  },
  techniques: [TechniqueSchema],
  partnerWork: [PartnerWorkSchema],
  sparringSessions: [{
    duration: Number,
    intensity: {
      type: String,
      enum: ['light', 'medium', 'hard'],
    },
    notes: String,
  }],
  notes: String,
}, {
  timestamps: true
});

export default mongoose.models.JudoClass || mongoose.model('JudoClass', JudoClassSchema); 