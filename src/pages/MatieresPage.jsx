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
  }

  if (typeof student === 'string') {
    return student
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

function normalizeMatieres(matieres) {
  const list = Array.isArray(matieres) ? matieres : []

  return list.map((item) => {
    if (typeof item === 'string') {
      return { name: item }
    }
    return item
  })
}

function MatieresPage({ matieres, notes }) {
  const matiereRows = normalizeMatieres(matieres)
  const usingNotes = matiereRows.length === 0
  const rows = usingNotes ? (Array.isArray(notes) ? notes : []) : matiereRows

  if (rows.length === 0) {
    return <p>Aucune donnee disponible.</p>
  }

  const columns = usingNotes
    ? [
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
    : [
        {
          label: 'ID',
          getValue: (row) => row.id ?? row.code ?? row.unique_id,
        },
        {
          label: 'Matiere',
          getValue: (row) => row.matiere ?? row.subject ?? row.name ?? row.course,
        },
        {
          label: 'Description',
          getValue: (row) => row.description,
        },
        {
          label: 'Professeur',
          getValue: (row) => row.teacher ?? row.professor,
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
            <TableRow key={row.id || row.code || row.unique_id || index}>
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

export default MatieresPage
