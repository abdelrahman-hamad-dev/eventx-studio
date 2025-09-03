import { useEffect } from 'react'
import { useData } from '../context/DataContext.jsx'
import TicketCard from '../components/TicketCard.jsx'

export default function MyTickets() {
  const { tickets, loadMyTickets } = useData()
  useEffect(() => { loadMyTickets() }, [])
  return (
    <div className="flex flex-col gap-3">
      {tickets.map(t => <TicketCard key={t._id} ticket={t} />)}
      {!tickets.length && <div>No tickets yet.</div>}
    </div>
  )
}
