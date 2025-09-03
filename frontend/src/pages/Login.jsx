import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white rounded py-2">Login</button>
      </form>
      <div className="text-sm mt-3">No account? <Link to="/register" className="text-blue-600">Register</Link></div>
    </div>
  )
}
