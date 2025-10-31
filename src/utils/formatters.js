// Utility functions for formatting data

/**
 * Format population numbers with K, M, B suffixes
 * @param {number} value - The population value to format
 * @returns {string} Formatted population string
 */
export const formatPopulation = (value) => {
  if (!value) return "N/A";
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + "B";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "K";
  } else {
    return value.toString();
  }
};

/**
 * Format axis labels with K, M, B suffixes
 * @param {number} value - The value to format for axis
 * @returns {string} Formatted axis label
 */
export const formatAxisLabel = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + "B";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(0) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + "K";
  }
  return value.toString();
};

/**
 * Get the field name for a given year
 * @param {string|number} year - The year
 * @returns {string} Field name (e.g., "F2022_Population")
 */
export const getYearFieldName = (year) => {
  return `F${year}_Population`;
};

/**
 * Available years in the dataset
 */
export const AVAILABLE_YEARS = [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022];
