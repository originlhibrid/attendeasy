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
      validator: function(this: any, attended: number) {
        // Skip validation if total is being updated in the same operation
        if (this.isModified('total')) {
          return true;
        }
        return attended <= this.total;
      },
      message: 'Attended classes cannot exceed total classes'
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total classes cannot be negative'],
    validate: {
      validator: function(this: any, total: number) {
        // Skip validation if attended is being updated in the same operation
        if (this.isModified('attended')) {
          return true;
        }
        return this.attended <= total;
      },
      message: 'Total classes cannot be less than attended classes'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
SubjectSchema.virtual('attendancePercentage').get(function(this: any) {
  return this.total === 0 ? 0 : (this.attended / this.total) * 100;
});

// Add compound index for userId + name to ensure unique subjects per user
SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });

// Pre-save middleware to ensure attended <= total
SubjectSchema.pre('save', function(next) {
  if (this.attended > this.total) {
    next(new Error('Attended classes cannot exceed total classes'));
  }
  next();
});

// Ensure mongoose doesn't override our model between hot reloads
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);

export default Subject;
