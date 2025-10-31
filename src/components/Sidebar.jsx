import { useState, useEffect } from "react";
import {
  formatPopulation,
  getYearFieldName,
  AVAILABLE_YEARS,
} from "../utils/formatters";
import { queryCountry, zoomToCountry } from "../utils/mapHelpers";
import "./Sidebar.css";

function Sidebar({
  populationLayer,
  mapView,
  countries,
  selectedCountry,
  onCountryChange,
  selectedYear,
  onYearChange,
  worldData,
}) {
  const [countryData, setCountryData] = useState(null);

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

  // Fetch country-specific data and zoom when country is selected
  useEffect(() => {
    let isMounted = true;

    if (selectedCountry && populationLayer && mapView) {
      // Query country with geometry for both data and zoom
      queryCountry(populationLayer, selectedCountry, true)
        .then((results) => {
          if (!isMounted) return;

          if (results.features.length > 0) {
            const feature = results.features[0];
            const attributes = feature.attributes;

            // Check if country has any valid population data
            const hasValidData = AVAILABLE_YEARS.some((year) => {
              const fieldName = getYearFieldName(year);
              const value = attributes[fieldName];
              return value && value > 0;
            });

            if (hasValidData) {
              // Set country data
              setCountryData(attributes);

              // Zoom to the country
              zoomToCountry(mapView, feature.geometry).catch((error) => {
                if (isMounted) {
                  console.error("Error zooming to country:", error);
                }
              });
            } else {
              // Country exists but has no valid population data
              console.log(
                `Country ${selectedCountry} found but has no population data`
              );
              setCountryData("NO_DATA");
            }
          } else {
            // No data found for this country
            console.log(`No data found for country: ${selectedCountry}`);
            setCountryData("NO_DATA");
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error("Error querying country:", error);
            setCountryData("NO_DATA");
          }
        });
    } else {
      setCountryData(null);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, populationLayer, mapView]);

  const handleCountryChange = (e) => {
    onCountryChange(e.target.value);
  };

  // Check if country has no data
  const hasNoData = countryData === "NO_DATA";

  // Calculate display values for info boxes
  const currentYearField = getYearFieldName(selectedYear);
  const previousYear = getPreviousYear(selectedYear);
  const previousYearField = previousYear
    ? getYearFieldName(previousYear)
    : null;

  const displayData =
    selectedCountry && countryData && !hasNoData ? countryData : null;
  const displayName = selectedCountry || "World";

  const currentPopulation = hasNoData
    ? null
    : displayData
    ? displayData[currentYearField]
    : worldData
    ? worldData[selectedYear]
    : null;

  const previousPopulation = hasNoData
    ? null
    : displayData && previousYearField
    ? displayData[previousYearField]
    : worldData && previousYear
    ? worldData[previousYear]
    : null;

  const growthRate = calculateGrowthRate(currentPopulation, previousPopulation);

  // Calculate overall growth from 1970 to 2022
  const population1970 = hasNoData
    ? null
    : displayData
    ? displayData[getYearFieldName("1970")]
    : worldData
    ? worldData["1970"]
    : null;

  const population2022 = hasNoData
    ? null
    : displayData
    ? displayData[getYearFieldName("2022")]
    : worldData
    ? worldData["2022"]
    : null;

  const overallGrowthRate =
    population1970 && population2022
      ? calculateGrowthRate(population2022, population1970)
      : null;

  const populationDifference =
    population2022 && population1970 ? population2022 - population1970 : null;

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
          >
            <option value="">
              {countries.length === 0
                ? "No countries available"
                : "Select a country"}
            </option>
            {countries.map((country) => (
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

      {hasNoData && selectedCountry ? (
        <div className="no-data-message">
          <p>📊 No population data available for {selectedCountry}</p>
          <p className="no-data-hint">
            This country is not included in our dataset. Please select another
            country.
          </p>
        </div>
      ) : (
        <>
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

          {/* Overall Growth Statistics Box */}
          <div className="growth-stats-box">
            <h3>Overall Growth (1970 - 2022)</h3>
            <div className="growth-stats-content">
              <div className="growth-stat-item">
                <div className="growth-stat-label">Population Change</div>
                <div className="growth-stat-value">
                  {populationDifference !== null ? (
                    <span
                      className={
                        populationDifference >= 0 ? "positive" : "negative"
                      }
                    >
                      {populationDifference >= 0 ? "+" : ""}
                      {formatPopulation(Math.abs(populationDifference))}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="growth-stat-item">
                <div className="growth-stat-label">Growth Percentage</div>
                <div className="growth-stat-value">
                  {overallGrowthRate !== null ? (
                    <span
                      className={
                        overallGrowthRate >= 0 ? "positive" : "negative"
                      }
                    >
                      {overallGrowthRate >= 0 ? "+" : ""}
                      {overallGrowthRate}%
                    </span>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="growth-stat-item">
                <div className="growth-stat-label">1970 Population</div>
                <div className="growth-stat-value baseline">
                  {population1970 ? formatPopulation(population1970) : "N/A"}
                </div>
              </div>
              <div className="growth-stat-item">
                <div className="growth-stat-label">2022 Population</div>
                <div className="growth-stat-value baseline">
                  {population2022 ? formatPopulation(population2022) : "N/A"}
                </div>
              </div>
            </div>
            <div className="growth-stats-footer">{displayName}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
