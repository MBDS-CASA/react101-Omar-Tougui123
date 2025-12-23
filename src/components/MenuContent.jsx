import data from '../data/data.json'
import AproposPage from '../pages/AproposPage'
import EtudiantsPage from '../pages/EtudiantsPage'
import MatieresPage from '../pages/MatieresPage'
import NotesPage from '../pages/NotesPage'

function normalizeData(rawData) {
  if (Array.isArray(rawData)) {
    return { notes: rawData, students: [], matieres: [] }
  }

  if (!rawData || typeof rawData !== 'object') {
    return { notes: [], students: [], matieres: [] }
  }

  const notes = Array.isArray(rawData.notes)
    ? rawData.notes
    : Array.isArray(rawData.grades)
      ? rawData.grades
      : []

  const students = Array.isArray(rawData.students)
    ? rawData.students
    : Array.isArray(rawData.etudiants)
      ? rawData.etudiants
      : []

  const matieres = Array.isArray(rawData.matieres)
    ? rawData.matieres
    : Array.isArray(rawData.subjects)
      ? rawData.subjects
      : Array.isArray(rawData.courses)
        ? rawData.courses
        : []

  return { notes, students, matieres }
}

function MenuContent({ selected }) {
  const label = selected || 'Notes'
  const { notes, students, matieres } = normalizeData(data)

  let content = null

  if (label === 'Etudiants') {
    content = <EtudiantsPage students={students} notes={notes} />
  } else if (label === 'Matières') {
    content = <MatieresPage matieres={matieres} notes={notes} />
  } else if (label === 'A propos') {
    content = <AproposPage />
  } else {
    content = <NotesPage notes={notes} />
  }

  return <section className="menu-content">{content}</section>
}

export default MenuContent
