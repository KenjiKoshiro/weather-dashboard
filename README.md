# Atmos Weather Dashboard

A production-style real-time weather dashboard built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- Search weather by city name
- Press Enter or click Search to fetch data
- Live current weather conditions
- Next 12 hours hourly forecast
- 7-day forecast
- Weather highlight cards
- Geolocation-based local weather lookup
- Recent searches saved in localStorage
- Celsius/Fahrenheit toggle
- Light/Dark mode toggle
- Auto-refresh every 5 minutes
- Search suggestions powered by WeatherAPI search endpoint
- Loading and error states
- Responsive dashboard UI

## Folder Structure

```text
.
├── index.html
├── README.md
├── src
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components
│   │   ├── CurrentWeather.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Header.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── Loader.tsx
│   │   ├── RecentSearches.tsx
│   │   ├── SectionHeading.tsx
│   │   └── WeatherHighlights.tsx
│   ├── services
│   │   └── weatherApi.ts
│   ├── types
│   │   └── weather.ts
│   └── utils
│       ├── storage.ts
│       └── weatherFormat.ts
└── ...project config files
```

## API Setup

This app uses [WeatherAPI.com](https://www.weatherapi.com/).

1. Create a free WeatherAPI account.
2. Copy your API key.
3. Create a `.env` file in the project root.
4. Add this variable:

```env
VITE_WEATHER_API_KEY=your_weatherapi_key_here
```

> Important: Vite only exposes environment variables that start with `VITE_`.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Build for Production

```bash
npm run build
```

## Data Flow Explanation

1. The user enters a city in the search input.
2. `App.tsx` triggers the weather service function.
3. `src/services/weatherApi.ts` calls WeatherAPI forecast endpoint:
   - `forecast.json` for current, hourly, and daily weather
   - `search.json` for autocomplete suggestions
4. The API response is stored in React state.
5. State is passed into modular dashboard components:
   - `CurrentWeather` shows live conditions
   - `HourlyForecast` shows the next 12 hours
   - `DailyForecast` shows the next 7 days
   - `WeatherHighlights` shows atmospheric metrics
6. Recent searches, unit preference, and theme preference are stored in `localStorage`.
7. The app automatically refreshes the active city weather every 5 minutes.

## Important Implementation Notes

- Weather icons are read directly from WeatherAPI condition icon URLs.
- The app handles invalid cities and missing API key errors.
- The geolocation button fetches weather for the user’s current coordinates.
- The background styling changes based on weather conditions in light mode.

## Future Improvements

- Add precipitation charts using a chart library
- Add weather alerts panel when alert data is available
- Add radar or weather map integration
- Add favorite pinned cities
- Add multilingual support
- Add accessibility enhancements like live regions for refresh updates
- Add offline caching with service workers
- Add sunrise/sunset progress visualization
- Add more detailed air quality breakdown card
