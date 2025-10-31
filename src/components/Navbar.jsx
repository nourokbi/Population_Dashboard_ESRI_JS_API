import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import LogoIcon from "../assets/people.png";

function Navbar({
  searchTerm,
  onSearchChange,
  onCountrySelect,
  populationLayer,
  theme,
  onThemeToggle,
}) {
  const [countries, setCountries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef(null);

  // Fetch countries when layer is available
  useEffect(() => {
    if (populationLayer) {
      const query = populationLayer.createQuery();
      query.where = "1=1";
      query.outFields = ["COUNTRY"];
      query.returnDistinctValues = true;
      query.orderByFields = ["COUNTRY"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          const countryList = results.features
            .map((feature) => feature.attributes.COUNTRY)
            .filter((country) => country);
          setCountries(countryList);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    }
  }, [populationLayer]);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, countries]);

  // Close suggestions when clicking outside
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
          onChange={(e) => onSearchChange(e.target.value)}
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
