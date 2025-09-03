export default function TicketCard({ ticket }) {
  return (
    <div className="bg-white rounded shadow p-4 flex gap-4 items-center">
      <img src={ticket.qrCodeDataUrl} alt="QR" className="w-24 h-24 object-contain" />
      <div>
        <div className="font-semibold">{ticket.event?.title}</div>
        <div className="text-sm text-gray-600">{new Date(ticket.event?.date).toLocaleString()} • {ticket.event?.location}</div>
        <div className="text-sm">Paid: ${ticket.pricePaid}</div>
      </div>
    </div>
  )
}
