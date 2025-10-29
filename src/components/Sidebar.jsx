import { useState, useEffect } from "react";
import "./Sidebar.css";

function Sidebar({ populationLayer, searchTerm }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("2022");
  const [loading, setLoading] = useState(false);

  const years = [
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2015",
    "2020",
    "2022",
  ];

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

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
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
            onChange={(e) => setSelectedYear(e.target.value)}
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
          <h3>Box 1</h3>
          <p>Info placeholder</p>
        </div>
        <div className="info-box">
          <h3>Box 2</h3>
          <p>Info placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
