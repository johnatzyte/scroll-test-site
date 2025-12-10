import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-pill">DS</span>
          <span>Demo Shop</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {/* Add more links here if needed */}
        </nav>
      </div>
    </header>
  );
}
