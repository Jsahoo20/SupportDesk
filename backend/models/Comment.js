const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Comment message is required'],
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
      // If true, only Support/Admin see it
    },
  },
  { timestamps: true }
);

// Indexes
commentSchema.index({ ticketId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

module.exports = mongoose.model('Comment', commentSchema);
