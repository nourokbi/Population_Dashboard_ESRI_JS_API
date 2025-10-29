# Population Dashboard - React + ArcGIS

This project integrates ArcGIS API for JavaScript with React to display a world population dashboard.

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install ArcGIS API:**
   ```bash
   npm install @arcgis/core
   ```

## Running the Application

```bash
npm run dev
```

Then open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Features

- **Interactive World Map**: Displays a topo-vector basemap centered on the world
- **Population Layer**: Shows world population data from 1970 to 2022
- **Smart Formatting**: Population numbers are formatted with K (thousands), M (millions), and B (billions) suffixes
- **Interactive Popups**: Click on any country to see its 2022 population

## Technologies Used

- React 19
- Vite
- ArcGIS API for JavaScript 4.30
- ESLint

## Project Structure

```
src/
├── components/
│   ├── PopulationMap.jsx    # Main map component
│   └── PopulationMap.css    # Map styles
├── App.jsx                  # Main app component
├── App.css                  # App styles
├── index.css                # Global styles
└── main.jsx                 # Entry point
```

## API Information

The population data is sourced from:

- **Service URL**: https://services3.arcgis.com/UDCw00RKDRKPqASe/arcgis/rest/services/WorldPopulationFrom_1970_To_2022/FeatureServer/0
- **Data**: Country-level population statistics from 1970 to 2022
