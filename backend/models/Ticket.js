import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  pricePaid: { type: Number, required: true },
  status: { type: String, enum: ['PAID', 'CANCELLED'], default: 'PAID' },
  qrCodeDataUrl: { type: String, required: true }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
