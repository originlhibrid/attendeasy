import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  attended: {
    type: Number,
    required: true,
    min: [0, 'Attended classes cannot be negative'],
    validate: {
      validator: function(v: number) {
        // @ts-ignore - this context is available in mongoose
        return v <= this.total;
      },
      message: 'Attended classes cannot exceed total classes'
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total classes cannot be negative']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for better query performance
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for attendance percentage
SubjectSchema.virtual('attendancePercentage').get(function() {
  return this.total === 0 ? 0 : (this.attended / this.total) * 100;
});

// Add compound index for userId + name to ensure unique subjects per user
SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
