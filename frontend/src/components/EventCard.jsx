import { Link } from 'react-router-dom'
export default function EventCard({ event, onBook }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <span className="text-sm text-gray-500">${event.price}</span>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
      <div className="text-sm text-gray-600">{new Date(event.date).toLocaleString()} • {event.location}</div>
      <div className="flex gap-2 mt-2">
        <Link to={`/events/${event._id}`} className="px-3 py-1 rounded bg-gray-200">Details</Link>
        {onBook && <button onClick={() => onBook(event)} className="px-3 py-1 rounded bg-blue-600 text-white">Book</button>}
      </div>
    </div>
  )
}
