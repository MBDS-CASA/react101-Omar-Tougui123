import { useMemo, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'

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

function normalizeText(value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value.toLowerCase()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return JSON.stringify(value).toLowerCase()
}

function normalizeSortValue(value) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  if (typeof value === 'number') {
    return value
  }

  return String(value).toLowerCase()
}

function compareValues(aValue, bValue) {
  const aSort = normalizeSortValue(aValue)
  const bSort = normalizeSortValue(bValue)

  if (typeof aSort === 'number' && typeof bSort === 'number') {
    return aSort - bSort
  }

  return String(aSort).localeCompare(String(bSort), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function EtudiantsPage({ students, notes }) {
  const rows = buildStudents(students, notes)
  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const columns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        getValue: (row) => row.id ?? row.studentId ?? row.unique_id,
      },
      {
        id: 'prenom',
        label: 'Prenom',
        getValue: (row) => row.firstname ?? row.firstName,
      },
      {
        id: 'nom',
        label: 'Nom',
        getValue: (row) => row.lastname ?? row.lastName,
      },
      {
        id: 'nom_complet',
        label: 'Nom complet',
        getValue: (row) => row.name,
      },
    ],
    [],
  )

  const visibleColumns = useMemo(
    () =>
      columns.filter((column) =>
        rows.some((row) => {
          const value = column.getValue(row)
          return value !== null && value !== undefined && value !== ''
        }),
      ),
    [columns, rows],
  )

  const activeOrderBy =
    visibleColumns.find((column) => column.id === orderBy)?.id ||
    visibleColumns[0]?.id ||
    ''

  const normalizedSearch = search.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) {
      return rows
    }

    return rows.filter((row) =>
      visibleColumns.some((column) =>
        normalizeText(column.getValue(row)).includes(normalizedSearch),
      ),
    )
  }, [rows, visibleColumns, normalizedSearch])

  const sortedRows = useMemo(() => {
    if (!activeOrderBy) {
      return filteredRows
    }

    const column = visibleColumns.find((item) => item.id === activeOrderBy)

    if (!column) {
      return filteredRows
    }

    const sorted = [...filteredRows].sort((a, b) =>
      compareValues(column.getValue(a), column.getValue(b)),
    )

    return order === 'asc' ? sorted : sorted.reverse()
  }, [filteredRows, visibleColumns, activeOrderBy, order])

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage
    return sortedRows.slice(start, start + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(0)
  }

  const handleRequestSort = (columnId) => {
    const isSameColumn = activeOrderBy === columnId
    const nextOrder = isSameColumn && order === 'asc' ? 'desc' : 'asc'
    setOrder(nextOrder)
    setOrderBy(columnId)
    setPage(0)
  }

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (rows.length === 0) {
    return <p>Aucune donnee disponible.</p>
  }

  return (
    <div className="table-wrapper">
      <div className="table-toolbar">
        <TextField
          className="table-search"
          size="small"
          label="Recherche"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <TableContainer component={Paper} className="table-container">
        <Table size="small">
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={activeOrderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={activeOrderBy === column.id}
                    direction={activeOrderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1}>
                  Aucune donnee disponible.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, index) => (
                <TableRow key={row.id || row.studentId || row.name || index}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {formatValue(column.getValue(row))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        className="table-pagination"
        count={sortedRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Lignes par page"
      />
    </div>
  )
}

export default EtudiantsPage
