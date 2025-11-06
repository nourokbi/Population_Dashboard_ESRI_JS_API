import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PopulationMap from "./components/PopulationMap";
import Sidebar from "./components/Sidebar";
import Charts from "./components/Charts";
import { STORAGE_KEYS } from "./utils/constants";
import { queryAllCountries } from "./utils/mapHelpers";
import { getYearFieldName, AVAILABLE_YEARS } from "./utils/formatters";

function App() {
  const [populationLayer, setPopulationLayer] = useState(null);
  const [countries, setCountries] = useState([]);
  const [worldData, setWorldData] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    return savedTheme || "light";
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [mapView, setMapView] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2022");

  const handleLayerLoad = useCallback((layer) => {
    setPopulationLayer(layer);
  }, []);

  const handleMapViewLoad = useCallback((view) => {
    setMapView(view);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  // this is the useEffect to fetch countries for the Navbar to send it as props to sidebar and search with suggestion
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

  // Fetch world data used by both Sidebar and Charts
  useEffect(() => {
    if (populationLayer) {
      queryAllCountries(populationLayer)
        .then((results) => {
          // Calculate total world population for each year
          // format <year>: <population>
          const totals = {};
          const years = AVAILABLE_YEARS.map(String);

          years.forEach((year) => {
            const fieldName = getYearFieldName(year);
            let total = 0;
            results.features.forEach((feature) => {
              const pop = feature.attributes[fieldName];
              if (pop) total += pop;
            });
            totals[year] = total;
          });

          setWorldData(totals);
        })
        .catch((error) => {
          console.error("Error fetching world data:", error);
        });
    }
  }, [populationLayer]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app-container ${theme}`}>
      <Navbar
        countries={countries}
        onCountrySelect={handleCountrySelect}
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
              countries={countries}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              worldData={worldData}
            />
          </div>
        </div>
        <div className="bottom-section">
          <Charts
            populationLayer={populationLayer}
            selectedCountry={selectedCountry}
            selectedYear={selectedYear}
            theme={theme}
            worldData={worldData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
