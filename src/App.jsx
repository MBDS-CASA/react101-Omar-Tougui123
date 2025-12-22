import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import NoteDetails from './components/NoteDetails'
import Menu from './components/Menu'
import data from './data/data.json'
import { randomItem } from './utils/randomItem'

function App() {
  const notes = Array.isArray(data) ? data : data.notes || []
  const [activeNote, setActiveNote] = useState(() => randomItem(notes))

  const handleNewNote = () => {
    setActiveNote(randomItem(notes))
  }

  const handleMenuSelect = (label) => {
    if (label === 'Notes') {
      setActiveNote(randomItem(notes))
    }
  }

  return (
    <div className="app">
      <Menu onSelect={handleMenuSelect} />
      <Header />
      <MainContent />
      <NoteDetails note={activeNote} />
      <button type="button" onClick={handleNewNote}>
        Nouvelle note
      </button>
      <Footer />
    </div>
  )
}

export default App
