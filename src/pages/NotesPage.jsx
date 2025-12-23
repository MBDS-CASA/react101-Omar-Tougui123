import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function getStudentLabel(note) {
  const student = note?.student || note?.etudiant

  if (student && typeof student === 'object') {
    const firstName = student.firstname || student.firstName || ''
    const lastName = student.lastname || student.lastName || ''
    const fullName = `${firstName} ${lastName}`.trim()

    if (fullName) {
      return fullName
    }

    if (student.name) {
      return student.name
    }

    if (student.id) {
      return `ID ${student.id}`
    }
  }

  if (typeof student === 'string') {
    return student
  }

  const noteFirst = note?.firstname || note?.firstName || ''
  const noteLast = note?.lastname || note?.lastName || ''
  const noteFull = `${noteFirst} ${noteLast}`.trim()

  if (noteFull) {
    return noteFull
  }

  return null
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function NotesPage({ notes }) {
  const rows = Array.isArray(notes) ? notes : []

  if (rows.length === 0) {
    return <p>Aucune donnee disponible.</p>
  }

  const columns = [
    {
      label: 'ID',
      getValue: (note) => note.unique_id ?? note.id,
    },
    {
      label: 'Matiere',
      getValue: (note) => note.matiere ?? note.subject ?? note.course,
    },
    {
      label: 'Etudiant',
      getValue: (note) => getStudentLabel(note),
    },
    {
      label: 'Date',
      getValue: (note) => note.date,
    },
    {
      label: 'Note',
      getValue: (note) => note.note ?? note.value ?? note.grade,
    },
  ]

  const visibleColumns = columns.filter((column) =>
    rows.some((row) => {
      const value = column.getValue(row)
      return value !== null && value !== undefined && value !== ''
    }),
  )

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell key={column.label}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.unique_id || row.id || index}>
              {visibleColumns.map((column) => (
                <TableCell key={column.label}>
                  {formatValue(column.getValue(row))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default NotesPage
