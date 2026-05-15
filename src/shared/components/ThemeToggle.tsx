import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { applyTheme, getInitialTheme, type ThemeMode } from '../theme'

interface ThemeToggleProps {
  solid?: boolean
}

export default function ThemeToggle({ solid = true }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())
  const isDark = theme === 'dark'

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
        solid
          ? 'border-black/10 bg-white text-black hover:border-[#f97316] hover:text-[#f97316]'
          : 'border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  )
}
