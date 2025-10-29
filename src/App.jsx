import { useState, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PopulationMap from "./components/PopulationMap";
import Sidebar from "./components/Sidebar";
import Charts from "./components/Charts";

function App() {
  const [populationLayer, setPopulationLayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  const handleLayerLoad = useCallback((layer) => {
    setPopulationLayer(layer);
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app-container ${theme}`}>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <div className="main-content">
        <div className="top-section">
          <div className="map-container">
            <PopulationMap onLayerLoad={handleLayerLoad} theme={theme} />
          </div>
          <div className="sidebar-container">
            <Sidebar
              populationLayer={populationLayer}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        <div className="bottom-section">
          <Charts />
        </div>
      </div>
    </div>
  );
}

export default App;
