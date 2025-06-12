'use client'

import { useEffect } from 'react'

export default function LandingLayout({ children }) {
  useEffect(() => {
    // Set document title
    document.title = 'resumee | AI-Powered Resume Builder'

    // Smooth scroll handler
    const handleAnchorClick = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' &&
        target.getAttribute('href')?.startsWith('#')
      ) {
        e.preventDefault()
        const id = target.getAttribute('href')?.substring(1)
        const element = document.getElementById(id || '')
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 100, // Adjust for header height
            behavior: 'smooth',
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return <>{children}</>
}
