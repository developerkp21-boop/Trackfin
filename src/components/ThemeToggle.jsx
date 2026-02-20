import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-icon d-inline-flex align-items-center justify-content-center rounded-3 border border-secondary-subtle text-secondary transition-smooth bg-transparent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
