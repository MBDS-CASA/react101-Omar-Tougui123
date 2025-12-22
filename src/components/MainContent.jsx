import { useEffect, useState } from 'react'

function MainContent() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' })
  const monthName = now.toLocaleDateString('fr-FR', { month: 'long' })
  const year = now.getFullYear()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const displayText = `Bonjour, on est le ${dayName}, ${monthName}, ${year} et il est ${hours}:${minutes}:${seconds}`

  return (
    <main className="main-content">
      <p>{displayText}</p>
    </main>
  )
}

export default MainContent
