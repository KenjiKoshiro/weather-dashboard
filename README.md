# Zenith Weather Dashboard

React, Vite, TypeScript and Tailwind dashboard powered by [Open-Meteo](https://open-meteo.com/), selected from the [Public APIs weather list](https://github.com/public-apis/public-apis#weather).

## Run and verify

```sh
npm ci
npm run dev
npm test
npx tsc --noEmit
npm run build
```

No API key, account or environment variable is required. The former `VITE_WEATHER_API_KEY` is no longer read. Existing Vercel variables can remain unused; no credentials belong in source control.

## Data and behavior

- Forecast API: modelled current conditions, 24 upcoming hourly slots, five daily forecasts, UV, dew point and day/night conditions. Temperatures use Celsius internally and convert in the UI.
- Geocoding API: type at least two characters and select a matching place. Names include region and country to distinguish cities.
- Air Quality API: US AQI (0–500 scale) and pollutant concentrations. Missing/unavailable air quality does not block weather; unavailable values display a dash.
- Hourly times use the selected location's IANA timezone. Daily dates use the API's documented daily UTC offset. Precipitation is labeled with its current aggregation interval.
- Geolocation requests browser permission and fetches the coordinates as “Your location”; Open-Meteo does not provide reverse geocoding.
- Recent places, units and theme remain in localStorage. Forecasts refresh every five minutes. Requests have timeouts and weather HTTP/malformed-data failures show a retry state.

## Hosting and usage

Vercel builds with `npm run build` and serves `dist`. The free Open-Meteo endpoint is for **non-commercial use** and is rate-limited, without an uptime guarantee. Commercial use requires a [subscription](https://open-meteo.com/en/pricing) and a server-side integration for its key; do not put a paid key in Vite client variables.

Attribution is displayed for Open-Meteo, GeoNames and CAMS. See the provider's [forecast](https://open-meteo.com/en/docs), [geocoding](https://open-meteo.com/en/docs/geocoding-api), and [air-quality](https://open-meteo.com/en/docs/air-quality-api) documentation.
