import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import { charge } from '../services/payment.js';
import { generateQrCodeDataUrl } from '../services/qrcode.js';

const router = express.Router();

// Public browse
router.get('/events', async (req, res) => {
  const events = await Event.find({ date: { $gte: new Date(Date.now() - 86400000) } }).sort({ date: 1 });
  res.json(events);
});

router.get('/events/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
});

// Authenticated user actions
router.use(authenticate, requireRoles('User', 'Admin'));

router.post('/events/:id/book', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.attendeesCount >= event.capacity) return res.status(400).json({ message: 'Event full' });

  const price = event.price;
  const payment = await charge({ amount: price, userId: req.user.id, eventId: event._id });
  if (payment.status !== 'succeeded') return res.status(400).json({ message: 'Payment failed' });

  const qrPayload = { ticketFor: event.title, userId: req.user.id, eventId: String(event._id), paid: true, ts: Date.now() };
  const qrCodeDataUrl = await generateQrCodeDataUrl(qrPayload);

  const ticket = await Ticket.create({ user: req.user.id, event: event._id, pricePaid: price, status: 'PAID', qrCodeDataUrl });
  event.attendeesCount += 1;
  await event.save();

  res.status(201).json({ ticket });
});

router.get('/me/tickets', async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id }).populate('event', 'title date location');
  res.json(tickets);
});

export default router;
