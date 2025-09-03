import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';

const router = express.Router();

router.use(authenticate, requireRoles('Admin'));

// Events CRUD
router.get('/events', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.post('/events', async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/events/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
});

router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Not found' });
    res.json(event);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  await Ticket.deleteMany({ event: req.params.id });
  const result = await Event.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

// Tickets management
router.get('/tickets', async (req, res) => {
  const tickets = await Ticket.find().populate('user', 'name email').populate('event', 'title date');
  res.json(tickets);
});

router.delete('/tickets/:id', async (req, res) => {
  const result = await Ticket.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

// Analytics
router.get('/analytics/summary', async (req, res) => {
  const tickets = await Ticket.find();
  const events = await Event.find();
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.status === 'PAID' ? t.pricePaid : 0), 0);
  const ticketsSold = tickets.length;
  const attendees = new Set(tickets.map(t => String(t.user))).size;
  res.json({ totalRevenue, ticketsSold, attendees, events: events.length });
});

// Demographics analytics based on ticket holders' profiles
router.get('/analytics/demographics', async (req, res) => {
  const tickets = await Ticket.find().populate('user', 'profile');
  const buckets = {
    age: { '<20': 0, '20-29': 0, '30-39': 0, '40-49': 0, '50+': 0 },
    gender: {},
    location: {},
    interests: {}
  };
  const inc = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };

  tickets.forEach(t => {
    const p = t.user?.profile || {};
    const age = Number(p.age || 0);
    if (age < 20) inc(buckets.age, '<20');
    else if (age < 30) inc(buckets.age, '20-29');
    else if (age < 40) inc(buckets.age, '30-39');
    else if (age < 50) inc(buckets.age, '40-49');
    else inc(buckets.age, '50+');

    if (p.gender) inc(buckets.gender, p.gender);
    if (p.location) inc(buckets.location, p.location);
    if (Array.isArray(p.interests)) p.interests.forEach(i => inc(buckets.interests, i));
  });

  res.json(buckets);
});

export default router;
