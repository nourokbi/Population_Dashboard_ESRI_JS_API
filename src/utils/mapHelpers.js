import { ZOOM_CONFIG } from "./constants";

/**
 * Zooms the map view to a specific country
 * @param {Object} mapView - ArcGIS MapView instance
 * @param {Object} geometry - Country feature geometry
 * @returns {Promise} - Promise that resolves when zoom completes
 */
export const zoomToCountry = (mapView, geometry) => {
  if (!mapView || !geometry) {
    return Promise.reject(new Error("MapView or geometry is missing"));
  }

  return mapView.goTo(
    {
      target: geometry.extent.expand(ZOOM_CONFIG.extent),
    },
    {
      duration: ZOOM_CONFIG.duration,
      easing: ZOOM_CONFIG.easing,
    }
  );
};

/**
 * Queries a country from the population layer
 * @param {Object} populationLayer - ArcGIS FeatureLayer
 * @param {string} countryName - Name of the country
 * @param {boolean} includeGeometry - Whether to include geometry in results
 * @returns {Promise} - Promise that resolves with query results
 */
export const queryCountry = (
  populationLayer,
  countryName,
  includeGeometry = false
) => {
  if (!populationLayer || !countryName) {
    return Promise.reject(new Error("Layer or country name is missing"));
  }

  const query = populationLayer.createQuery();
  query.where = `COUNTRY = '${countryName}'`;
  query.outFields = ["*"];
  query.returnGeometry = includeGeometry;

  return populationLayer.queryFeatures(query);
};

/**
 * Queries all countries from the population layer
 * @param {Object} populationLayer - ArcGIS FeatureLayer
 * @returns {Promise} - Promise that resolves with all features
 */
export const queryAllCountries = (populationLayer) => {
  if (!populationLayer) {
    return Promise.reject(new Error("Layer is missing"));
  }

  const query = populationLayer.createQuery();
  query.where = "1=1";
  query.outFields = ["*"];

  return populationLayer.queryFeatures(query);
};
