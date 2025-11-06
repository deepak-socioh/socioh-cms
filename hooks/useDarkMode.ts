'use client'

import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check current state from DOM (set by script in layout)
    const isDarkFromDOM = document.documentElement.classList.contains('dark')
    setDarkMode(isDarkFromDOM)
    
    // Ensure localStorage is set
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      localStorage.setItem('theme', isDarkFromDOM ? 'dark' : 'light')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return { darkMode: false, toggleDarkMode: () => {} }
  }

  return { darkMode, toggleDarkMode }
}