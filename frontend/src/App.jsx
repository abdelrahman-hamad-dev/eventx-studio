import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import EventDetails from './pages/EventDetails.jsx'
import MyTickets from './pages/MyTickets.jsx'
import { useAuth } from './context/AuthContext.jsx'

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<UserDashboard />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-tickets" element={<PrivateRoute roles={["User","Admin"]}><MyTickets /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={["Admin"]}><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  )
}
