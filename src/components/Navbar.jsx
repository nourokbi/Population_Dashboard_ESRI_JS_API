import "./Navbar.css";
import LogoIcon from "../assets/people.png";

function Navbar({ searchTerm, onSearchChange, theme, onThemeToggle }) {
  return (
    <div className="navbar">
      <h1 className="navbar-title">
        <img src={LogoIcon} alt="img" />
        Population Analytics
      </h1>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="navbar-search-input"
        />
      </div>
      <button className="theme-toggle" onClick={onThemeToggle}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default Navbar;
