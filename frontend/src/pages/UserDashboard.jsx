import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import EventCard from '../components/EventCard.jsx'

export default function UserDashboard() {
  const { events, bookTicket } = useData()
  const { user } = useAuth()

  const onBook = async (event) => {
    if (!user) return alert('Please login to book')
    await bookTicket(event._id)
    alert('Ticket booked!')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(ev => (
        <EventCard key={ev._id} event={ev} onBook={onBook} />
      ))}
    </div>
  )
}
