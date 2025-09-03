import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: 'John Doe', email: 'user@example.com', password: 'User@123' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input name="name" className="border p-2 rounded" placeholder="Name" value={form.name} onChange={onChange} />
        <input name="email" className="border p-2 rounded" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="password" className="border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={onChange} />
        <button className="bg-blue-600 text-white rounded py-2">Register</button>
      </form>
      <div className="text-sm mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></div>
    </div>
  )
}
