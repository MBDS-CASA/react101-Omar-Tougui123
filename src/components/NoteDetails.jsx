function formatValue(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function NoteDetails({ note }) {
  if (!note) {
    return (
      <section className="note-details">
        <h2>Note selectionnee</h2>
        <p>Aucune note a afficher.</p>
      </section>
    )
  }

  if (typeof note !== 'object') {
    return (
      <section className="note-details">
        <h2>Note selectionnee</h2>
        <p>{String(note)}</p>
      </section>
    )
  }

  const knownFields = [
    { key: 'id', label: 'ID' },
    { key: 'note', label: 'Note' },
    { key: 'value', label: 'Note' },
    { key: 'student', label: 'Etudiant' },
    { key: 'etudiant', label: 'Etudiant' },
    { key: 'matiere', label: 'Matiere' },
    { key: 'subject', label: 'Matiere' },
    { key: 'commentaire', label: 'Commentaire' },
    { key: 'comment', label: 'Commentaire' },
  ]

  const displayed = knownFields
    .map((field) => ({
      label: field.label,
      value: note[field.key],
      key: field.key,
    }))
    .filter((item) => item.value !== undefined)

  const hasKnownFields = displayed.length > 0

  return (
    <section className="note-details">
      <h2>Note selectionnee</h2>
      {hasKnownFields ? (
        <ul>
          {displayed.map((item) => (
            <li key={item.key}>
              <strong>{item.label}:</strong> {formatValue(item.value)}
            </li>
          ))}
        </ul>
      ) : (
        <pre>{JSON.stringify(note, null, 2)}</pre>
      )}
    </section>
  )
}

export default NoteDetails
