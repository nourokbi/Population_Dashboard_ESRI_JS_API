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
import { getBaseChartOptions, getDatasetStyle } from "../utils/chartHelpers";
import { COLORS } from "../utils/constants";
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

function Charts({
  populationLayer,
  selectedCountry,
  theme,
  selectedYear,
  worldData,
}) {
  const [populationData, setPopulationData] = useState(null);
  const [top10Data, setTop10Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTop10, setLoadingTop10] = useState(false);

  // Fetch population data for selected country or world
  useEffect(() => {
    if (!populationLayer) return;

    let isMounted = true;
    setLoading(true);
    const datasetStyle = getDatasetStyle();

    if (selectedCountry) {
      // Fetch specific country data
      const query = populationLayer.createQuery();
      query.where = `COUNTRY = '${selectedCountry}'`;
      query.outFields = ["*"];

      populationLayer
        .queryFeatures(query)
        .then((results) => {
          if (!isMounted) return;

          if (results.features.length > 0) {
            const attributes = results.features[0].attributes;
            const data = AVAILABLE_YEARS.map(
              (year) => attributes[`F${year}_Population`] || 0
            );

            // Check if there's any valid data (non-zero values)
            const hasValidData = data.some((value) => value > 0);

            if (hasValidData) {
              setPopulationData({
                labels: AVAILABLE_YEARS,
                datasets: [
                  {
                    label: `${selectedCountry} Population`,
                    data: data,
                    ...datasetStyle,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                  },
                ],
              });
            } else {
              // Country exists but has no valid population data
              setPopulationData(null);
            }
          } else {
            // No data available for this country
            setPopulationData(null);
          }
          setLoading(false);
        })
        .catch((error) => {
          if (isMounted) {
            console.error("Error fetching country data:", error);
            setPopulationData(null);
            setLoading(false);
          }
        });
    } else if (worldData) {
      // Use world data passed from App
      const worldDataArray = AVAILABLE_YEARS.map(
        (year) => worldData[String(year)] || 0
      );

      setPopulationData({
        labels: AVAILABLE_YEARS,
        datasets: [
          {
            label: "World Population",
            data: worldDataArray,
            ...datasetStyle,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      });
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [populationLayer, selectedCountry, worldData]);

  // Fetch top 10 countries for the selected year
  useEffect(() => {
    if (!populationLayer || !selectedYear) return;

    let isMounted = true;
    setLoadingTop10(true);
    const fieldName = getYearFieldName(selectedYear);
    const query = populationLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["COUNTRY", fieldName];

    populationLayer
      .queryFeatures(query)
      .then((results) => {
        if (!isMounted) return;

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
              borderColor: COLORS.primary,
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: COLORS.primaryDark,
            },
          ],
        });
        setLoadingTop10(false);
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Error fetching top 10 data:", error);
          setLoadingTop10(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [populationLayer, selectedYear]);

  // Line chart options
  const options = getBaseChartOptions(theme, {
    plugins: {
      title: {
        display: true,
        text: `Population Trend (1970-2022)`,
        color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
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
          color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
          callback: function (value) {
            return formatAxisLabel(value);
          },
        },
        grid: {
          color: theme === "dark" ? COLORS.gridDark : COLORS.gridLight,
        },
      },
      x: {
        ticks: {
          color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
        },
        grid: {
          color: theme === "dark" ? COLORS.gridDark : COLORS.gridLight,
        },
      },
    },
  });

  // Bar chart options
  const barOptions = getBaseChartOptions(theme, {
    indexAxis: "y",
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
        color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
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
          color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
          callback: function (value) {
            return formatAxisLabel(value);
          },
        },
        grid: {
          color: theme === "dark" ? COLORS.gridDark : COLORS.gridLight,
        },
      },
      y: {
        ticks: {
          color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  });

  return (
    <div className="charts-section">
      <div className="chart-container">
        <div className="chart-wrapper">
          {loading ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : populationData ? (
            <Line data={populationData} options={options} />
          ) : selectedCountry ? (
            <div className="chart-no-data">
              <p>📊 No population data available for {selectedCountry}</p>
            </div>
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
