# 📊 GIS Population Analytics Dashboard

A modern, interactive web application for visualizing and analyzing global population data using ArcGIS Maps SDK for JavaScript and React.

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)
![ArcGIS](https://img.shields.io/badge/ArcGIS-4.30-0079C1?style=flat&logo=arcgis)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

- **Interactive Map Visualization**: Powered by ArcGIS Maps SDK for JavaScript with population data from 1970-2022
- **Country Search & Filter**: Quick search functionality to find and filter countries in real-time
- **Year Selection**: Browse historical population data across different time periods
- **Theme Toggle**: Switch between light and dark modes with automatic basemap updates
- **Responsive Layout**: Clean, modern UI with organized sidebar, navbar, and chart sections
- **Population Layer**: Dynamic visualization of world population data with formatted popups
- **Map Controls**: Home button, scale bar, and intuitive navigation controls

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.1.1** - Modern UI library with hooks and functional components
- **Vite 7.1.7** - Fast build tool and development server

### Mapping & GIS
- **@arcgis/core 4.30** - ArcGIS Maps SDK for JavaScript
- **ArcGIS Feature Layer** - World Population data service (1970-2022)
- **Basemaps**: 
  - Light mode: `gray-vector`
  - Dark mode: `dark-gray-vector`

### Styling
- **CSS3** - Custom styling with flexbox and grid layouts
- **Theme System** - Dynamic light/dark mode with smooth transitions
- **Glassmorphism** - Modern UI effects with backdrop filters

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
│   │   ├── Navbar.jsx          # Top navigation with search and theme toggle
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx         # Country selector and year picker
│   │   ├── Sidebar.css
│   │   ├── PopulationMap.jsx   # ArcGIS map component
│   │   ├── PopulationMap.css
│   │   ├── Charts.jsx          # Chart placeholders
│   │   └── Charts.css
│   ├── assets/          # Images and icons
│   ├── App.jsx          # Main application component
│   ├── App.css          # Global styles and theme definitions
│   ├── main.jsx         # Application entry point
│   └── index.css        # Base styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # Project documentation
```

## 🎨 Key Components

### PopulationMap
- Initializes ArcGIS Map and MapView
- Loads world population feature layer
- Handles theme-based basemap switching
- Implements map controls (Home, ScaleBar)
- Manages map lifecycle and cleanup

### Sidebar
- Country dropdown with 251 countries
- Real-time search filtering
- Year selector (1970-2022)
- Info boxes for data display
- Dynamic country list from feature layer

### Navbar
- Application branding and title
- Centralized search input
- Theme toggle button (light/dark)
- Responsive layout

### Charts
- Placeholder sections for future data visualizations
- Grid layout for multiple charts
- Theme-aware styling

## 🌐 Data Source

Population data is sourced from the ArcGIS Feature Service:
```
https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/WorldPopulationFrom_1970_To_2022/FeatureServer/0
```

## 🎯 Future Enhancements

- [ ] Implement interactive charts (population trends, comparisons)
- [ ] Add zoom-to-country functionality
- [ ] Connect year selector to dynamic data display
- [ ] Add population statistics in info boxes
- [ ] Export data functionality
- [ ] Additional data layers and analysis tools

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Nour Okbi**
- GitHub: [@nourokbi](https://github.com/nourokbi)

## 🙏 Acknowledgments

- ArcGIS Maps SDK for JavaScript
- World Population Dataset
- React and Vite communities

---

Made with ❤️ using React and ArcGIS
