import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { api, API_BASE } from '../lib/apiClient'
import { useAuth } from './AuthContext.jsx'

const API = API_BASE

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [tickets, setTickets] = useState([])
  const [analytics, setAnalytics] = useState({ summary: null, demographics: null })

  const client = useMemo(() => {
    const c = api
    if (token) c.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return c
  }, [token])

  const loadPublicEvents = async () => {
    const res = await api.get(`/api/user/events`)
    setEvents(res.data)
  }

  const loadMyTickets = async () => {
    if (!token) return
    const res = await client.get('/api/user/me/tickets')
    setTickets(res.data)
  }

  const bookTicket = async (eventId) => {
    const res = await client.post(`/api/user/events/${eventId}/book`)
    await Promise.all([loadMyTickets(), loadPublicEvents()])
    return res.data.ticket
  }

  const loadAdminAnalytics = async () => {
    if (!token) return
    const [summary, demographics] = await Promise.all([
      client.get('/api/admin/analytics/summary'),
      client.get('/api/admin/analytics/demographics')
    ])
    setAnalytics({ summary: summary.data, demographics: demographics.data })
  }

  useEffect(() => {
    loadPublicEvents()
  }, [])

  useEffect(() => {
    loadMyTickets()
    loadAdminAnalytics()
  }, [token])

  // Simple notification: alert for events within 3 days that user has a ticket for
  useEffect(() => {
    if (!tickets?.length) return
    const soon = tickets.filter(t => {
      const d = new Date(t.event?.date)
      const diffDays = (d - new Date()) / 86400000
      return diffDays >= 0 && diffDays <= 3
    })
    if (soon.length) {
      alert(`Reminder: You have ${soon.length} upcoming event(s) within 3 days!`)
    }
  }, [tickets])

  return (
    <DataContext.Provider value={{ events, tickets, analytics, loadPublicEvents, loadMyTickets, bookTicket, loadAdminAnalytics }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
