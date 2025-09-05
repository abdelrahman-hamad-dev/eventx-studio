import axios from 'axios'

export const API_BASE = (import.meta?.env?.VITE_API_URL) || (typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined) || 'http://localhost:5000'

export const api = axios.create({ baseURL: API_BASE, withCredentials: false })
