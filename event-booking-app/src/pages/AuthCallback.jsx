import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userParam = params.get('user')

    if (token && userParam) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', decodeURIComponent(userParam))
      // Force reload to update context
      window.location.href = '/'
    } else {
      navigate('/')
    }
  }, [navigate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                  alignItems: 'center', height: '100vh', gap: '20px' }}>
      <div className="spinner"></div>
      <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Signing you in...</p>
    </div>
  )
}

export default AuthCallback
