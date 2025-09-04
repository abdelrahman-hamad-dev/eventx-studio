import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { api, API_BASE } from '../lib/apiClient'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'

const API = API_BASE

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const { user } = useAuth()
  const { bookTicket } = useData()

  useEffect(() => {
    api.get(`/api/user/events/${id}`).then(r => setEvent(r.data))
  }, [id])

  if (!event) return <div>Loading...</div>
  const doBook = async () => {
    if (!user) return alert('Please login to book')
    await bookTicket(event._id)
    alert('Ticket booked!')
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <div className="text-gray-600 mt-2">{new Date(event.date).toLocaleString()} • {event.location}</div>
      <div className="mt-4">{event.description}</div>
      <div className="mt-4 font-semibold">Price: ${event.price}</div>
      <button className="mt-4 px-4 py-2 rounded bg-blue-600 text-white" onClick={doBook}>Book Ticket</button>
    </div>
  )
}
