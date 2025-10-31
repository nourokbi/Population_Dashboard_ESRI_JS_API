import { useState, useEffect } from "react";
import {
  formatPopulation,
  getYearFieldName,
  AVAILABLE_YEARS,
} from "../utils/formatters";
import "./Sidebar.css";

function Sidebar({
  populationLayer,
  mapView,
  searchTerm,
  selectedCountry,
  onCountryChange,
  selectedYear,
  onYearChange,
}) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [worldData, setWorldData] = useState(null);

  const years = AVAILABLE_YEARS.map(String);

  // Get previous year from the years array
  const getPreviousYear = (currentYear) => {
    const currentIndex = years.indexOf(currentYear);
    if (currentIndex > 0) {
      return years[currentIndex - 1];
    }
    return null;
  };

  // Calculate growth rate between two years
  const calculateGrowthRate = (currentPop, previousPop) => {
    if (!currentPop || !previousPop || previousPop === 0) return null;
    const rate = ((currentPop - previousPop) / previousPop) * 100;
    return rate.toFixed(2);
  };

  useEffect(() => {
    // Fetch countries from the layer when it's available
    if (populationLayer) {
      setLoading(true);
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
            .filter((country) => country); // Remove null/undefined values
          setCountries(countryList);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
          setLoading(false);
        });
    }
  }, [populationLayer]);

  // Zoom to country when selected (no popup)
  useEffect(() => {
    if (selectedCountry && populationLayer && mapView) {
      const query = populationLayer.createQuery();
      query.where = `COUNTRY = '${selectedCountry}'`;
      query.outFields = ["*"];
      query.returnGeometry = true;

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          if (results.features.length > 0) {
            const feature = results.features[0];

            // Just zoom to the country, no popup
            mapView
              .goTo(
                {
                  target: feature.geometry.extent.expand(1.3),
                },
                {
                  duration: 1500,
                  easing: "ease-in-out",
                }
              )
              .catch((error) => {
                console.error("Error zooming to country:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error querying country:", error);
        });
    }
  }, [selectedCountry, populationLayer, mapView]);

  // Fetch country-specific data when country is selected
  useEffect(() => {
    if (selectedCountry && populationLayer) {
      const query = populationLayer.createQuery();
      query.where = `COUNTRY = '${selectedCountry}'`;
      query.outFields = ["*"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          if (results.features.length > 0) {
            setCountryData(results.features[0].attributes);
          }
        })
        .catch((error) => {
          console.error("Error fetching country data:", error);
        });
    } else {
      setCountryData(null);
    }
  }, [selectedCountry, populationLayer]);

  // Fetch world total population
  useEffect(() => {
    if (populationLayer) {
      const query = populationLayer.createQuery();
      query.where = "1=1";
      query.outFields = ["*"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          // Calculate total world population for each year
          const totals = {};
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populationLayer]);

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountryChange = (e) => {
    onCountryChange(e.target.value);
  };

  // Calculate display values for info boxes
  const currentYearField = getYearFieldName(selectedYear);
  const previousYear = getPreviousYear(selectedYear);
  const previousYearField = previousYear
    ? getYearFieldName(previousYear)
    : null;

  const displayData = selectedCountry && countryData ? countryData : null;
  const displayName = selectedCountry || "World";

  const currentPopulation = displayData
    ? displayData[currentYearField]
    : worldData
    ? worldData[selectedYear]
    : null;

  const previousPopulation =
    displayData && previousYearField
      ? displayData[previousYearField]
      : worldData && previousYear
      ? worldData[previousYear]
      : null;

  const growthRate = calculateGrowthRate(currentPopulation, previousPopulation);

  return (
    <div className="sidebar">
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="form-select country-select"
            disabled={loading}
          >
            <option value="">
              {loading
                ? "Loading countries..."
                : countries.length === 0
                ? "No countries available"
                : "Select a country"}
            </option>
            {filteredCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="form-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="info-boxes">
        <div className="info-box">
          <h3>Population {selectedYear}</h3>
          <div className="info-value">
            {currentPopulation
              ? formatPopulation(currentPopulation)
              : "Loading..."}
          </div>
          <div className="info-label">{displayName}</div>
        </div>
        <div className="info-box">
          <h3>Growth Rate</h3>
          <div className="info-value">
            {growthRate !== null ? (
              <span className={growthRate >= 0 ? "positive" : "negative"}>
                {growthRate >= 0 ? "+" : ""}
                {growthRate}%
              </span>
            ) : (
              "N/A"
            )}
          </div>
          <div className="info-label">
            {previousYear
              ? `${previousYear} - ${selectedYear}`
              : "No previous data"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
