import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exercise name'],
    trim: true,
  },
  primaryMuscles: [{
    type: String,
    required: [true, 'Please specify primary muscle groups'],
    enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'full_body'],
  }],
  secondaryMuscles: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'full_body'],
  }],
  equipment: {
    type: String,
    required: [true, 'Please specify equipment needed'],
    enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cables', 'kettlebell', 'other'],
  },
  type: {
    type: String,
    required: [true, 'Please specify exercise type'],
    enum: ['strength', 'cardio', 'flexibility', 'power', 'olympic_lifting'],
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  description: String,
  instructions: [String],
}, {
  timestamps: true
});

ExerciseSchema.index({ name: 1, createdBy: 1 }, { unique: true });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema); 