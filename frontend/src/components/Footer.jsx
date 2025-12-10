export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Demo Shop. All rights reserved.</p>
        <p className="muted">React + Flask • Fake products from schema.org</p>
      </div>
    </footer>
  );
}
