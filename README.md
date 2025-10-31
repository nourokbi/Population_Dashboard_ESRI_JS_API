# 📊 GIS Population Analytics Dashboard

A modern, interactive web application for visualizing and analyzing global population data using ArcGIS Maps SDK for JavaScript and React. Features intelligent search, real-time data visualization, and comprehensive analytics charts.

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)
![ArcGIS](https://img.shields.io/badge/ArcGIS-4.30-0079C1?style=flat&logo=arcgis)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.9-FF6384?style=flat&logo=chartdotjs)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Interactive Map & Navigation

- **Interactive Map Visualization**: Powered by ArcGIS Maps SDK with population data from 1970-2022
- **Smart Autocomplete Search**: Real-time country suggestions with keyboard navigation (Arrow keys, Enter, Escape)
- **Three-Way Country Selection**: Select countries via search bar, dropdown menu, or direct map click
- **Smart Zoom**: Automatically zoom to country borders with optimized extent fitting
- **Map Click Integration**: Click any country on the map to automatically update selection and view data
- **Theme Toggle**: Switch between light and dark modes with automatic basemap updates

### Data Analytics & Visualization

- **Info Boxes**: Real-time display of country-specific or world population data
  - **Current Population**: Formatted with K/M/B suffixes for easy reading
  - **Growth Rate**: Year-over-year percentage change with color-coded indicators (green: positive, red: negative)
- **Population Trend Chart**: Interactive line chart showing population changes from 1970-2022
  - Displays selected country or world total data
  - Smooth animations and responsive design
  - Formatted tooltips with population values
- **Top 10 Countries Chart**: Horizontal bar chart of most populated countries
  - Dynamic data based on selected year
  - Gradient color scheme with hover effects
  - Sorted by population (descending)

### User Experience

- **Year-Based Filtering**: Browse historical data across 8 time periods (1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022)
- **Responsive Layout**: Clean, modern UI with organized sections
  - Top section (60vh): Map + Sidebar
  - Bottom section (40vh): Dual charts
  - Navbar (60px): Search and theme controls
- **Formatted Data Display**: All numbers formatted with K (thousands), M (millions), B (billions) suffixes
- **Map Controls**: Home button, scale bar, and intuitive navigation

## 🛠️ Technologies Used

### Frontend Framework

- **React 19.1.1** - Modern UI library with hooks and functional components
- **Vite 7.1.7** - Fast build tool and development server

### Mapping & GIS

- **@arcgis/core 4.30** - ArcGIS Maps SDK for JavaScript
- **ArcGIS Feature Layer** - World Population data service (1970-2022, 251 countries)
- **Basemaps**:
  - Light mode: `gray-vector`
  - Dark mode: `dark-gray-vector`

### Data Visualization

- **Chart.js 4.4.9** - Powerful charting library for data visualization
- **react-chartjs-2 5.3.0** - React wrapper for Chart.js
- **Registered Chart Components**: Line, Bar, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler

### Styling

- **CSS3** - Custom styling with flexbox and grid layouts
- **Muted Green Theme** - Primary: #4a7c59, Secondary: #2d5a3d
- **Glassmorphism** - Modern UI effects with backdrop filters
- **Gradient Backgrounds** - Smooth color transitions for enhanced visuals

### Development Tools

- **ESLint** - Code quality and consistency
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/nourokbi/Population_Dashboard_ESRI_JS_API.git
cd Population_Dashboard_ESRI_JS_API
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.jsx          # Top navigation with autocomplete search and theme toggle
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx         # Country selector, year picker, and info boxes
│   │   ├── Sidebar.css
│   │   ├── PopulationMap.jsx   # ArcGIS map with click handler
│   │   ├── PopulationMap.css
│   │   ├── Charts.jsx          # Line and bar charts for data visualization
│   │   └── Charts.css
│   ├── utils/           # Utility functions
│   │   └── formatters.js       # Data formatting helpers (population, axis labels, field names)
│   ├── assets/          # Images and icons
│   ├── App.jsx          # Main application component with state management
│   ├── App.css          # Global styles and theme definitions
│   ├── main.jsx         # Application entry point
│   └── index.css        # Base styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # Project documentation
```

## 🎨 Key Components

### App.jsx

- Central state management (selectedCountry, selectedYear, searchTerm, theme)
- Coordinates data flow between all components
- Manages mapView and populationLayer references
- Implements callback functions for component communication

### PopulationMap.jsx

- Initializes ArcGIS Map and MapView
- Loads world population feature layer (251 countries)
- Handles theme-based basemap switching
- Implements map click handler to update country selection
- Map controls: Home button, ScaleBar
- Manages map lifecycle and cleanup
- Disabled popups (data shown in info boxes instead)

### Navbar.jsx

- Autocomplete search with real-time suggestions (max 5)
- Keyboard navigation (Arrow Up/Down, Enter, Escape)
- Dropdown positioning and outside-click detection
- Theme toggle button (light/dark mode)
- Fetches country list from feature layer

### Sidebar.jsx

- Country dropdown with 251 countries
- Year selector (8 time periods: 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022)
- **Info Box 1**: Current year population (country or world total)
- **Info Box 2**: Growth rate between years (color-coded: green for positive, red for negative)
- Zoom to country on selection (extent.expand(1.3))
- Helper functions: formatPopulation, getYearFieldName, getPreviousYear, calculateGrowthRate
- Fetches country-specific data and world totals
- Synchronizes with map clicks and search selections

### Charts.jsx

- **Line Chart**: Population trend from 1970 to 2022
  - Shows selected country or world total data
  - Filled area with smooth tension curve
  - Formatted Y-axis labels (K/M/B)
  - Interactive tooltips with population values
- **Horizontal Bar Chart**: Top 10 most populated countries
  - Dynamic data based on selected year
  - Gradient opacity backgrounds (100% → 50%)
  - Sorted by population (descending)
  - Rounded borders with hover effects
- Theme-aware colors and styling
- Responsive design with proper viewport fitting

### utils/formatters.js

- `formatPopulation()`: Converts numbers to K/M/B format
- `formatAxisLabel()`: Formats chart axis labels
- `getYearFieldName()`: Maps year to field name (e.g., "2022" → "F2022_Population")
- `AVAILABLE_YEARS`: Array of available data years [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022]

## 🌐 Data Source

Population data is sourced from the ArcGIS Feature Service:

```
https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/WorldPopulationFrom_1970_To_2022/FeatureServer/0
```

## 🔧 How It Works

### Three-Way Country Selection

1. **Search Bar**: Type to get autocomplete suggestions, use arrow keys to navigate, press Enter to select
2. **Dropdown Menu**: Click the sidebar dropdown and select any country from the list
3. **Map Click**: Click directly on a country on the map to select it

All three methods synchronize automatically - selecting a country via any method updates all components.

### Data Flow

1. User selects a country and year
2. Map zooms to country with optimized extent (expand factor: 1.3)
3. Sidebar info boxes update with:
   - Current year population for the selected country
   - Growth rate calculation between current and previous year
4. Charts update to show:
   - Line chart: Historical population trend 1970-2022
   - Bar chart: Top 10 most populated countries for the selected year
5. All data formatted with K/M/B suffixes for readability

### Theme System

- Toggle between light and dark modes
- Automatic basemap switching:
  - Light: `gray-vector`
  - Dark: `dark-gray-vector`
- All components respect theme settings (charts, text colors, backgrounds)

## 🎯 Future Enhancements

- [ ] Export data and charts as images/PDFs
- [ ] Additional analysis tools (density maps, projections)
- [ ] Multiple country comparison feature
- [ ] Animation of population changes over time
- [ ] Integration with additional demographic datasets
- [ ] Mobile app version

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Nour Okbi**

- GitHub: [@nourokbi](https://github.com/nourokbi)

## 🙏 Acknowledgments

- ArcGIS Maps SDK for JavaScript for powerful mapping capabilities
- World Population Dataset for comprehensive historical data
- Chart.js for beautiful and interactive data visualizations
- React and Vite communities for excellent development tools

---

Made with ❤️ using React, ArcGIS, and Chart.js
