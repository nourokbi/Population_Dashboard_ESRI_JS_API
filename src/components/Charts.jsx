import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  formatPopulation,
  formatAxisLabel,
  getYearFieldName,
  AVAILABLE_YEARS,
} from "../utils/formatters";
import "./Charts.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Charts({ populationLayer, selectedCountry, theme, selectedYear }) {
  const [populationData, setPopulationData] = useState(null);
  const [top10Data, setTop10Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTop10, setLoadingTop10] = useState(false);

  const years = AVAILABLE_YEARS;

  // Fetch population data for selected country or world
  useEffect(() => {
    if (!populationLayer) return;

    setLoading(true);

    if (selectedCountry) {
      // Fetch specific country data
      const query = populationLayer.createQuery();
      query.where = `COUNTRY = '${selectedCountry}'`;
      query.outFields = ["*"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          if (results.features.length > 0) {
            const attributes = results.features[0].attributes;
            const data = years.map(
              (year) => attributes[`F${year}_Population`] || 0
            );
            setPopulationData({
              labels: years,
              datasets: [
                {
                  label: `${selectedCountry} Population`,
                  data: data,
                  borderColor: "#4a7c59",
                  backgroundColor: "rgba(74, 124, 89, 0.2)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                  pointBackgroundColor: "#4a7c59",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                },
              ],
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching country data:", error);
          setLoading(false);
        });
    } else {
      // Fetch world total data
      const query = populationLayer.createQuery();
      query.where = "1=1";
      query.outFields = ["*"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          const worldData = years.map((year) => {
            const fieldName = getYearFieldName(year);
            let total = 0;
            results.features.forEach((feature) => {
              const pop = feature.attributes[fieldName];
              if (pop) total += pop;
            });
            return total;
          });

          setPopulationData({
            labels: years,
            datasets: [
              {
                label: "World Population",
                data: worldData,
                borderColor: "#4a7c59",
                backgroundColor: "rgba(74, 124, 89, 0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: "#4a7c59",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
              },
            ],
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching world data:", error);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populationLayer, selectedCountry]);

  // Fetch top 10 countries for the selected year
  useEffect(() => {
    if (!populationLayer || !selectedYear) return;

    setLoadingTop10(true);
    const fieldName = getYearFieldName(selectedYear);
    const query = populationLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["COUNTRY", fieldName];

    populationLayer
      .queryFeatures(query)
      .then((results) => {
        // Get all countries with population data
        const countriesData = results.features
          .map((feature) => ({
            country: feature.attributes.COUNTRY,
            population: feature.attributes[fieldName] || 0,
          }))
          .filter((item) => item.population > 0)
          .sort((a, b) => b.population - a.population)
          .slice(0, 10); // Get top 10

        const labels = countriesData.map((item) => item.country);
        const data = countriesData.map((item) => item.population);

        // Create gradient colors for bars
        const backgroundColors = countriesData.map((_, index) => {
          const opacity = 1 - index * 0.05;
          return `rgba(74, 124, 89, ${opacity})`;
        });

        setTop10Data({
          labels: labels,
          datasets: [
            {
              label: `Population (${selectedYear})`,
              data: data,
              backgroundColor: backgroundColors,
              borderColor: "#4a7c59",
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: "#2d5a3d",
            },
          ],
        });
        setLoadingTop10(false);
      })
      .catch((error) => {
        console.error("Error fetching top 10 data:", error);
        setLoadingTop10(false);
      });
  }, [populationLayer, selectedYear]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 10,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
          font: {
            size: 13,
            weight: "600",
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `Population Trend (1970-2022)`,
        color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = context.parsed.y;
            label += formatPopulation(value);
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
          callback: function (value) {
            return formatAxisLabel(value);
          },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Horizontal bars
    layout: {
      padding: {
        top: 10,
        right: 15,
        bottom: 20,
        left: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top 10 Most Populated Countries (${selectedYear})`,
        color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const value = context.parsed.x;
            return formatPopulation(value);
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
          callback: function (value) {
            return formatAxisLabel(value);
          },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: theme === "dark" ? "#e0e0e0" : "#2c3e50",
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="charts-section">
      <div className="chart-container">
        <div className="chart-wrapper">
          {loading ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : populationData ? (
            <Line data={populationData} options={options} />
          ) : (
            <div className="chart-loading">No data available</div>
          )}
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-wrapper">
          {loadingTop10 ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : top10Data ? (
            <Bar data={top10Data} options={barOptions} />
          ) : (
            <div className="chart-loading">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;
