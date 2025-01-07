interface Ticket {
  id: string;
  userId: string;
  purchaseDate: Date;
  eventId: string;
}

export const generateTicketId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const createTicket = (userId: string, eventId: string): Ticket => {
  return {
    id: generateTicketId(),
    userId,
    purchaseDate: new Date(),
    eventId,
  };
};

export const selectWinner = (tickets: Ticket[]): Ticket | null => {
  if (tickets.length === 0) return null;
  
  // Use crypto for secure random selection
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomIndex = array[0] % tickets.length;
  
  return tickets[randomIndex];
};

// Store tickets in localStorage for demo purposes
// In production, this should be in a database
export const storeTicket = (ticket: Ticket) => {
  const tickets = getStoredTickets(ticket.eventId);
  tickets.push(ticket);
  localStorage.setItem(`tickets_${ticket.eventId}`, JSON.stringify(tickets));
};

export const getStoredTickets = (eventId: string): Ticket[] => {
  const storedTickets = localStorage.getItem(`tickets_${eventId}`);
  return storedTickets ? JSON.parse(storedTickets) : [];
};