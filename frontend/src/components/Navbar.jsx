import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const doLogout = () => { logout(); nav('/login') }
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">EventX Studio</Link>
        <div className="flex items-center gap-4">
          <Link to="/">Browse</Link>
          {user && <Link to="/my-tickets">My Tickets</Link>}
          {user?.role === 'Admin' && <Link to="/admin">Admin</Link>}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-blue-600 text-white">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-gray-200">Register</Link>
            </>
          ) : (
            <button onClick={doLogout} className="px-3 py-1 rounded bg-red-600 text-white">Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}
