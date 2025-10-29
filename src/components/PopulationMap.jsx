import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Home from "@arcgis/core/widgets/Home";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import "./PopulationMap.css";

function PopulationMap({ onLayerLoad, theme = "light" }) {
  const mapDiv = useRef(null);
  const viewRef = useRef(null);
  const layerRef = useRef(null);
  const mapRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!mapDiv.current || isInitialized.current) return;

    isInitialized.current = true;
    let isMounted = true;

    // Function to format numbers with K, M, B suffixes
    function formatPopulation(value) {
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + "B";
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + "M";
      } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + "K";
      } else {
        return value.toString();
      }
    }

    const map = new Map({
      basemap: "gray-vector",
    });

    mapRef.current = map;

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [0, 20],
      zoom: 2,
      constraints: {
        rotationEnabled: false,
        minZoom: 2,
        maxZoom: 18,
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: "top-right",
          breakpoint: false,
        },
      },
    });

    viewRef.current = view;

    view
      .when(() => {
        view.ui.remove("attribution");

        const homeWidget = new Home({
          view: view,
        });
        view.ui.add(homeWidget, "top-left");

        const scaleBar = new ScaleBar({
          view: view,
          unit: "metric",
        });
        view.ui.add(scaleBar, "bottom-left");
      })
      .catch((error) => {
        console.error("Error initializing view:", error);
      });

    const populationLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/UDCw00RKDRKPqASe/arcgis/rest/services/WorldPopulationFrom_1970_To_2022/FeatureServer/0",
      outFields: ["*"],
    });

    layerRef.current = populationLayer;
    populationLayer.popupTemplate = {
      title: "{COUNTRY}",
      content: function (feature) {
        const pop = feature.graphic.attributes.F2022_Population;
        return "<b>Population 2022:</b> " + formatPopulation(pop);
      },
    };

    map.add(populationLayer);

    populationLayer
      .when(() => {
        if (!isMounted) return;
        if (onLayerLoad) {
          onLayerLoad(populationLayer);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error loading layer:", error);
      });
    // Cleanup function
    return () => {
      isMounted = false;
      isInitialized.current = false;

      if (viewRef.current) {
        viewRef.current.container = null;
        viewRef.current.destroy();
        viewRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update basemap when theme changes
  useEffect(() => {
    if (mapRef.current && viewRef.current && isInitialized.current) {
      const newBasemap = theme === "dark" ? "dark-gray-vector" : "gray-vector";
      mapRef.current.basemap = newBasemap;
    }
  }, [theme]);

  return <div ref={mapDiv} className="map-view"></div>;
}

export default PopulationMap;
