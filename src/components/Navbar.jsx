import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <span className="navbar-mark">M</span>
        <div>
          <strong>Gestión Municipal</strong>
          <p>Trámites y priorización inteligente</p>
        </div>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/lista" className="nav-link">Lista</Link>
        <Link to="/registro" className="nav-link nav-link-primary">Registro</Link>
      </div>
    </div>
  );
}

export default Navbar;