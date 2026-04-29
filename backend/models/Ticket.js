const mongoose = require('mongoose');
const { TICKET_CATEGORY, TICKET_PRIORITY, TICKET_STATUS } = require('../config/constants');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      // Format: TKT-2025-001
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      enum: TICKET_CATEGORY,
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    priority: {
      type: String,
      enum: Object.values(TICKET_PRIORITY),
      default: TICKET_PRIORITY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.OPEN,
    },
    attachments: [
      {
        url: String, // Cloudinary URL
        public_id: String, // For deletion
        originalName: String,
      },
    ],
    slaDeadline: {
      type: Date,
      required: true,
    },
    slaBreached: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for common queries
ticketSchema.index({ raisedBy: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ slaDeadline: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ isDeleted: 1 }); // For soft delete queries

module.exports = mongoose.model('Ticket', ticketSchema);
