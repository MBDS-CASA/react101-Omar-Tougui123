function MenuContent({ selected }) {
  const label = selected || 'Notes'

  return (
    <section className="menu-content">
      <p>Contenu : {label}</p>
    </section>
  )
}

export default MenuContent
