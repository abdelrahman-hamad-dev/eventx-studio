import { useEffect, useMemo, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import axios from 'axios'
import { api, API_BASE } from '../lib/apiClient'
import ChartComponent from '../components/ChartComponent.jsx'

const API = API_BASE

export default function AdminDashboard() {
  const { analytics, loadAdminAnalytics } = useData()
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', price: 0, capacity: 10 })

  const client = useMemo(() => {
    const c = api
    if (token) c.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return c
  }, [token])

  const load = async () => {
    const [ev, tk] = await Promise.all([
      client.get('/api/admin/events'),
      client.get('/api/admin/tickets'),
    ])
    setEvents(ev.data)
    setTickets(tk.data)
  }

  useEffect(() => { loadAdminAnalytics(); load(); }, [])

  const save = async (e) => {
    e.preventDefault()
    await client.post('/api/admin/events', form)
    setForm({ title: '', description: '', date: '', location: '', price: 0, capacity: 10 })
    load()
  }

  const remove = async (id) => { await client.delete(`/api/admin/events/${id}`); load() }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-600">Revenue</div>
          <div className="text-2xl font-bold">${analytics.summary?.totalRevenue || 0}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-600">Tickets Sold</div>
          <div className="text-2xl font-bold">{analytics.summary?.ticketsSold || 0}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-600">Attendees</div>
          <div className="text-2xl font-bold">{analytics.summary?.attendees || 0}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartComponent title="Age" data={analytics.demographics?.age} />
        <ChartComponent title="Gender" data={analytics.demographics?.gender} />
        <ChartComponent title="Location" data={analytics.demographics?.location} />
        <ChartComponent title="Interests" data={analytics.demographics?.interests} />
      </section>

      <section className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Create Event</h3>
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Location" value={form.location} onChange={e=>setForm({ ...form, location: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Date" type="datetime-local" value={form.date} onChange={e=>setForm({ ...form, date: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({ ...form, price: Number(e.target.value) })} />
          <input className="border p-2 rounded" placeholder="Capacity" type="number" value={form.capacity} onChange={e=>setForm({ ...form, capacity: Number(e.target.value) })} />
          <input className="border p-2 rounded md:col-span-3" placeholder="Description" value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} />
          <button className="bg-blue-600 text-white rounded py-2">Create</button>
        </form>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map(ev => (
            <div key={ev._id} className="border rounded p-3">
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-gray-600">{new Date(ev.date).toLocaleString()} • {ev.location}</div>
              <div className="text-sm">Capacity: {ev.capacity} • Attendees: {ev.attendeesCount}</div>
              <button onClick={() => remove(ev._id)} className="mt-2 px-3 py-1 rounded bg-red-600 text-white">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Tickets</h3>
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">User</th>
                <th className="p-2">Event</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t._id} className="border-b">
                  <td className="p-2">{t.user?.name} ({t.user?.email})</td>
                  <td className="p-2">{t.event?.title}</td>
                  <td className="p-2">${t.pricePaid}</td>
                  <td className="p-2">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
