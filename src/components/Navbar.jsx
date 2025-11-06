import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import LogoIcon from "../assets/people.png";
import { SEARCH_CONFIG } from "../utils/constants";

function Navbar({ countries, onCountrySelect, theme, onThemeToggle }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, SEARCH_CONFIG.maxSuggestions));
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, countries]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCountry = (country) => {
    onCountrySelect(country);
    setSearchTerm("");
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSelectCountry(suggestions[activeSuggestion]);
      } else if (suggestions.length > 0) {
        handleSelectCountry(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="navbar">
      <h1 className="navbar-title">
        <img src={LogoIcon} alt="img" />
        Population Analytics
      </h1>
      <div className="navbar-search" ref={searchRef}>
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          className="navbar-search-input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((country, index) => (
              <div
                key={country}
                className={`suggestion-item ${
                  index === activeSuggestion ? "active" : ""
                }`}
                onClick={() => handleSelectCountry(country)}
                onMouseEnter={() => setActiveSuggestion(index)}
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="theme-toggle" onClick={onThemeToggle}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}

export default Navbar;
