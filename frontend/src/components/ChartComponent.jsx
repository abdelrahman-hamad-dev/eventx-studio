import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ChartComponent({ title, data }) {
  const formatted = Object.entries(data || {}).map(([name, value]) => ({ name, value }))
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
