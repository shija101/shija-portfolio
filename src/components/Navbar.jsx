import { useState } from "react";

function Navbar({ onVaultOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Education", href: "#education" },
    { name: "Certifications", href: "#certifications" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "CV", href: "#cv" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleVaultClick = () => {
    handleLinkClick();
    onVaultOpen();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a
          href="#home"
          className="navbar-logo"
          onClick={handleLinkClick}
        >
          SHIJA<span>MALONGO</span>
        </a>

        <nav
          className={`navbar-links ${
            isMenuOpen ? "navbar-links-open" : ""
          }`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="navbar-link"
              onClick={handleLinkClick}
            >
              {link.name}
            </a>
          ))}

          <button
            type="button"
            className="navbar-vault"
            onClick={handleVaultClick}
          >
            <span>🔐</span> Private Vault
          </button>
        </nav>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
