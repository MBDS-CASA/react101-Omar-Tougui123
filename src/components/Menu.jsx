function Menu({ onSelect }) {
  const items = ['Notes', 'Etudiants', 'Matières', 'A propos']

  const handleClick = (item) => {
    window.alert(item)

    if (typeof onSelect === 'function') {
      onSelect(item)
    }
  }

  return (
    <nav className="menu">
      <ul className="menu__list">
        {items.map((item) => (
          <li key={item} className="menu__item">
            <button
              type="button"
              className="menu__button"
              onClick={() => handleClick(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
