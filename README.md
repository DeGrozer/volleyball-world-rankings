# 🏐 FIVB Senior World Ranking Visualization

An interactive 3D globe visualization of the official FIVB (Fédération Internationale de Volleyball) Senior World Rankings.

## 🌐 Live Demo

**[View Live →](https://degrozer.github.io/volleyball-world-rankings/)**

## Features

- **Interactive 3D Globe** - Rotate and explore countries worldwide using D3.js orthographic projection
- **Live FIVB Data** - Real-time rankings fetched directly from the official Volleyball World API
- **Gender Toggle** - Switch between Men's and Women's world rankings
- **Country Selection** - Click any country to view their current FIVB ranking and points
- **Zoom Controls** - Zoom in/out to explore regions in detail
- **Responsive Design** - Works on desktop and mobile devices

## Data Source

Rankings are fetched live from the official **[Volleyball World](https://en.volleyballworld.com/)** API:
- Updates automatically with the latest FIVB rankings
- Includes 100+ national teams for both men's and women's volleyball
- Shows rank position and decimal points

## Technologies

- **D3.js v7** - Globe rendering and geographic projections
- **TopoJSON** - Efficient world map data
- **Tailwind CSS** - Styling and responsive design
- **Vanilla JavaScript** - No framework dependencies
- **GitHub Pages** - Free hosting

## Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── app.js          # Main application logic
│   ├── globe-renderer.js   # D3.js globe rendering
│   ├── data-loader.js      # Map data loading
│   └── ranking-fetcher.js  # FIVB API integration
├── config/
│   ├── api.js          # API endpoints
│   └── constants.js    # Globe settings
└── world-110m.json     # TopoJSON world map
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/DeGrozer/volleyball-world-rankings.git
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   npx serve .
   ```

3. That's it! No build process or dependencies required.

## Notes

- Some countries may show "No ranking data available" if they don't participate in FIVB competitions
- Rankings are cached for 1 hour to reduce API calls
- Country names are normalized to match between the map data and FIVB federation names

## Author

**Jan Andrew R. Barte**

## License

This project is for educational and personal use. Ranking data is sourced from FIVB/Volleyball World.

---

*Created using FIVB Data | Powered by D3.js*
