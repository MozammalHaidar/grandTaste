import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 400,
  showSpinner: false,
})

const ProgressBar = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    const timer = setTimeout(() => {
      NProgress.done()
    }, 400)
    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location.pathname])

  return null
}

export default ProgressBar