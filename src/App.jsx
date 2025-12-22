import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import Menu from './components/Menu'
import MenuContent from './components/MenuContent'

function App() {
  const [selectedMenu, setSelectedMenu] = useState('Notes')

  const handleMenuSelect = (label) => {
    setSelectedMenu(label)
  }

  return (
    <div className="app">
      <Menu onSelect={handleMenuSelect} selected={selectedMenu} />
      <Header />
      <MainContent />
      <MenuContent selected={selectedMenu} />
      <Footer />
    </div>
  )
}

export default App
