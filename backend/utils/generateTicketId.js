const generateTicketId = async (Ticket) => {
  // Format: PIE-TCK-2026-001, PIE-TCK-2026-002, etc.
  const year = new Date().getFullYear();
  const lastTicket = await Ticket.findOne(
    { ticketId: new RegExp(`^PIE-TCK-${year}-`) },
    {},
    { sort: { createdAt: -1 } }
  );

  let sequence = 1;
  if (lastTicket) {
    const match = lastTicket.ticketId.match(/PIE-TCK-\d+-(\d+)/);
    if (match) sequence = parseInt(match[1]) + 1;
  }

  return `PIE-TCK-${year}-${String(sequence).padStart(3, '0')}`;
};

module.exports = generateTicketId;
