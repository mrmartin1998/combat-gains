import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exercise name'],
    trim: true,
  },
  sets: [{
    reps: {
      type: Number,
      required: [true, 'Please provide number of reps'],
    },
    weight: {
      type: Number,
      required: [true, 'Please provide weight'],
    },
    notes: String,
  }],
  notes: String,
});

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide workout date'],
    default: Date.now,
  },
  type: {
    type: String,
    required: [true, 'Please provide workout type'],
    enum: ['strength', 'conditioning', 'technique', 'sparring'],
  },
  exercises: [ExerciseSchema],
  duration: {
    type: Number, // in minutes
    required: [true, 'Please provide workout duration'],
  },
  notes: String,
  template: {
    type: Boolean,
    default: false,
  },
  templateName: String,
}, {
  timestamps: true
});

export default mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema); 