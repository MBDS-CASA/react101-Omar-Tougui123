function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">© {year} - Prenom.Nom, Tous droits réservés.</footer>
  )
}

export default Footer
