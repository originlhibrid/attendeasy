import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  attended: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
