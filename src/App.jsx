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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [mapView, setMapView] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2022");

  const handleLayerLoad = useCallback((layer) => {
    setPopulationLayer(layer);
  }, []);

  const handleMapViewLoad = useCallback((view) => {
    setMapView(view);
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSearchTerm("");
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app-container ${theme}`}>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onCountrySelect={handleCountrySelect}
        populationLayer={populationLayer}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <div className="main-content">
        <div className="top-section">
          <div className="map-container">
            <PopulationMap
              onLayerLoad={handleLayerLoad}
              onViewLoad={handleMapViewLoad}
              onCountryClick={setSelectedCountry}
              theme={theme}
            />
          </div>
          <div className="sidebar-container">
            <Sidebar
              populationLayer={populationLayer}
              mapView={mapView}
              searchTerm={searchTerm}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>
        <div className="bottom-section">
          <Charts
            populationLayer={populationLayer}
            selectedCountry={selectedCountry}
            selectedYear={selectedYear}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
