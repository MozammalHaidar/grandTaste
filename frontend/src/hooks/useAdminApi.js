import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const useAdminApi = (url) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const { data: res } = await api.get(url)
      setData(res.results || res)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => { load() }, [load])

  const create = async (url, payload, headers = {}) => {
    const { data: res } = await api.post(url, payload, { headers })
    load()
    return res
  }

  const update = async (url, payload, headers = {}) => {
    const { data: res } = await api.patch(url, payload, { headers })
    load()
    return res
  }

  const remove = async (url, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return false
    await api.delete(url)
    load()
    return true
  }

  return { data, loading, load, create, update, remove }
}

export default useAdminApi