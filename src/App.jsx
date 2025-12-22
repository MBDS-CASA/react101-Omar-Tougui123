import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import NoteDetails from './components/NoteDetails'
import data from './data/data.json'
import randomItem from './utils/randomItem'

function App() {
  const notes = Array.isArray(data) ? data : data.notes || []
  const [note, setNote] = useState(() => randomItem(notes))

  const handleNewNote = () => {
    setNote(randomItem(notes))
  }

  return (
    <div className="app">
      <Header />
      <MainContent />
      <NoteDetails note={note} />
      <button type="button" onClick={handleNewNote}>
        Nouvelle note
      </button>
      <Footer />
    </div>
  )
}

export default App
