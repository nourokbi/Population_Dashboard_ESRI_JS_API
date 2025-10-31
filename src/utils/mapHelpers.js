import { ZOOM_CONFIG } from "./constants";

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

export const queryAllCountries = (populationLayer) => {
  if (!populationLayer) {
    return Promise.reject(new Error("Layer is missing"));
  }

  const query = populationLayer.createQuery();
  query.where = "1=1";
  query.outFields = ["*"];

  return populationLayer.queryFeatures(query);
};
