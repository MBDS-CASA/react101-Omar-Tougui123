import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function normalizeStudentValue(value) {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return { name: value }
  }

  if (typeof value === 'object') {
    return {
      id: value.id ?? value.studentId,
      firstname: value.firstname ?? value.firstName,
      lastname: value.lastname ?? value.lastName,
      name: value.name,
    }
  }

  return { name: String(value) }
}

function buildStudents(students, notes) {
  const list = Array.isArray(students) ? students : []

  if (list.length > 0) {
    return list.map((item) =>
      typeof item === 'string' ? { name: item } : item,
    )
  }

  const sourceNotes = Array.isArray(notes) ? notes : []
  const map = new Map()

  sourceNotes.forEach((note) => {
    const studentValue = note?.student || note?.etudiant
    const student = normalizeStudentValue(studentValue)

    if (student) {
      const key = student.id || student.name || JSON.stringify(student)
      if (!map.has(key)) {
        map.set(key, student)
      }
      return
    }

    const first = note?.firstname || note?.firstName
    const last = note?.lastname || note?.lastName
    const id = note?.studentId || note?.id

    if (first || last || id) {
      const key = id || `${first || ''}-${last || ''}`.trim()
      if (!map.has(key)) {
        map.set(key, { id, firstname: first, lastname: last })
      }
    }
  })

  return Array.from(map.values())
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

function EtudiantsPage({ students, notes }) {
  const rows = buildStudents(students, notes)

  if (rows.length === 0) {
    return <p>Aucune donnee disponible.</p>
  }

  const columns = [
    {
      label: 'ID',
      getValue: (row) => row.id ?? row.studentId ?? row.unique_id,
    },
    {
      label: 'Prenom',
      getValue: (row) => row.firstname ?? row.firstName,
    },
    {
      label: 'Nom',
      getValue: (row) => row.lastname ?? row.lastName,
    },
    {
      label: 'Nom complet',
      getValue: (row) => row.name,
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
            <TableRow key={row.id || row.studentId || row.name || index}>
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

export default EtudiantsPage
