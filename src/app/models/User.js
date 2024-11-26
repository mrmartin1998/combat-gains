import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  profile: {
    weight: Number,
    height: Number,
    beltLevel: {
      type: String,
      enum: ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black'],
      default: 'white'
    },
    goals: String,
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);