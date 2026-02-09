import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: 'rgb(var(--bg-card))',
              color: 'rgb(var(--text-primary))',
              border: '1px solid rgb(var(--border-subtle))'
            }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
