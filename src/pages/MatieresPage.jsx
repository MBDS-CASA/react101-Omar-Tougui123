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

function normalizeMatieres(matieres) {
  const list = Array.isArray(matieres) ? matieres : []

  return list.map((item) => (typeof item === 'string' ? { name: item } : item))
}

function MatieresPage({ matieres, notes }) {
  const matiereRows = normalizeMatieres(matieres)
  const usingNotes = matiereRows.length === 0
  const rows = usingNotes ? (Array.isArray(notes) ? notes : []) : matiereRows
  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState('matiere')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const columns = useMemo(() => {
    if (usingNotes) {
      return [
        {
          id: 'matiere',
          label: 'Matiere',
          getValue: (note) => note.matiere ?? note.subject ?? note.course,
        },
        {
          id: 'etudiant',
          label: 'Etudiant',
          getValue: (note) => getStudentLabel(note),
        },
        {
          id: 'date',
          label: 'Date',
          getValue: (note) => note.date,
        },
        {
          id: 'note',
          label: 'Note',
          getValue: (note) => note.note ?? note.value ?? note.grade,
        },
      ]
    }

    return [
      {
        id: 'id',
        label: 'ID',
        getValue: (row) => row.id ?? row.code ?? row.unique_id,
      },
      {
        id: 'matiere',
        label: 'Matiere',
        getValue: (row) => row.matiere ?? row.subject ?? row.name ?? row.course,
      },
      {
        id: 'description',
        label: 'Description',
        getValue: (row) => row.description,
      },
      {
        id: 'professeur',
        label: 'Professeur',
        getValue: (row) => row.teacher ?? row.professor,
      },
    ]
  }, [usingNotes])

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
                <TableRow key={row.id || row.code || row.unique_id || index}>
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

export default MatieresPage
