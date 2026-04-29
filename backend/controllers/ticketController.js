const Ticket = require('../models/Ticket');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { TICKET_STATUS, USER_ROLE } = require('../config/constants');
const calculateSLADeadline = require('../utils/slaCalculator');
const generateTicketId = require('../utils/generateTicketId');
const sendEmail = require('../utils/sendEmail');

const STAFF_ROLES = [USER_ROLE.SUPPORT, USER_ROLE.ADMIN];

const uploadAttachment = (file) => (
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'supportdesk/tickets', resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          originalName: file.originalname,
        });
      }
    );
    stream.end(file.buffer);
  })
);

const createTicket = async (req, res) => {
  const { category, subject, description, priority } = req.validatedBody;
  const raisedBy = req.user.userId;
  const ticketId = await generateTicketId(Ticket);
  const attachments = [];

  if (req.files?.length) {
    try {
      attachments.push(...await Promise.all(req.files.map(uploadAttachment)));
    } catch (err) {
      console.error('File upload error:', err);
    }
  }

  const ticket = new Ticket({
    ticketId,
    raisedBy,
    category,
    subject,
    description,
    priority,
    slaDeadline: calculateSLADeadline(priority),
    attachments,
  });

  await ticket.save();
  await ticket.populate('raisedBy', 'name email');

  await sendEmail(
    req.user.email,
    `Ticket Created: ${ticketId}`,
    `
      <h2>Your ticket has been created</h2>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p>We will get back to you soon.</p>
    `
  );

  res.status(201).json({
    success: true,
    message: 'Ticket created successfully',
    data: ticket,
  });
};

const getTickets = async (req, res) => {
  const { page = 1, limit = 10, status, priority, category, search, assignedTo } = req.query;
  const { userId, role } = req.user;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const filters = [{ isDeleted: false }];

  if (role === USER_ROLE.EMPLOYEE) {
    filters.push({ raisedBy: userId });
  } else if (role === USER_ROLE.SUPPORT) {
    filters.push({
      $or: [
        { status: TICKET_STATUS.OPEN, assignedTo: null },
        { assignedTo: userId },
      ],
    });
  }

  if (status) filters.push({ status });
  if (priority) filters.push({ priority });
  if (category) filters.push({ category });
  if (assignedTo && role === USER_ROLE.ADMIN) filters.push({ assignedTo });
  if (search) {
    filters.push({
      $or: [
        { subject: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const query = filters.length === 1 ? filters[0] : { $and: filters };
  const tickets = await Ticket.find(query)
    .populate('raisedBy', 'name email department')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const total = await Ticket.countDocuments(query);

  res.json({
    success: true,
    message: 'Tickets retrieved',
    data: {
      tickets,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    },
  });
};

const getTicketById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const ticket = await Ticket.findById(id)
    .populate('raisedBy', 'name email department')
    .populate('assignedTo', 'name email');

  if (!ticket || ticket.isDeleted) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = ticket.raisedBy._id.toString() === userId;
  const isAssignee = ticket.assignedTo?._id.toString() === userId;

  if (!isOwner && !isAssignee && !STAFF_ROLES.includes(role)) {
    const error = new Error('You do not have access to this ticket');
    error.statusCode = 403;
    throw error;
  }

  res.json({
    success: true,
    message: 'Ticket details retrieved',
    data: ticket,
  });
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { subject, description, priority } = req.validatedBody;

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { subject, description, priority },
    { new: true, runValidators: true }
  ).populate('raisedBy', 'name email');

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'Ticket updated',
    data: ticket,
  });
};

const assignTicket = async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.validatedBody;

  const assignee = await User.findById(assignedTo);
  if (!assignee || assignee.role !== USER_ROLE.SUPPORT) {
    const error = new Error('Assignee must be a Support staff member');
    error.statusCode = 400;
    throw error;
  }

  const ticket = await Ticket.findByIdAndUpdate(id, { assignedTo }, { new: true })
    .populate('raisedBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  await sendEmail(
    assignee.email,
    `You have been assigned a ticket: ${ticket.ticketId}`,
    `
      <h2>New Ticket Assignment</h2>
      <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p>Please review and respond to the customer.</p>
    `
  );

  res.json({
    success: true,
    message: 'Ticket assigned properly',
    data: ticket,
  });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.validatedBody;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  const slaBreached = status === TICKET_STATUS.RESOLVED && new Date() > ticket.slaDeadline;
  const updated = await Ticket.findByIdAndUpdate(
    id,
    {
      status,
      slaBreached,
      resolvedAt: status === TICKET_STATUS.RESOLVED ? new Date() : null,
    },
    { new: true }
  )
    .populate('raisedBy', 'name email')
    .populate('assignedTo', 'name email');

  if (status === TICKET_STATUS.RESOLVED) {
    await sendEmail(
      updated.raisedBy.email,
      `Your ticket ${updated.ticketId} has been resolved`,
      `
        <h2>Ticket Resolved</h2>
        <p>Your support ticket has been resolved.</p>
        <p><strong>Ticket ID:</strong> ${updated.ticketId}</p>
        <p><strong>SLA Status:</strong> ${slaBreached ? 'Breached' : 'Met'}</p>
      `
    );
  }

  res.json({
    success: true,
    message: 'Status updated',
    data: updated,
  });
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'Ticket deleted successfully',
    data: null,
  });
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateStatus,
  deleteTicket,
};
