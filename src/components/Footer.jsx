function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">© {year} - Omar Tougui, Tous droits réservés.</footer>
  )
}

export default Footer
