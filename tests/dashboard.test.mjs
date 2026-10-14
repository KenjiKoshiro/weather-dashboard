import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { WeatherHighlights } = await server.ssrLoadModule('/src/components/WeatherHighlights.tsx');
const { HourlyForecast } = await server.ssrLoadModule('/src/components/HourlyForecast.tsx');
const { Header } = await server.ssrLoadModule('/src/components/Header.tsx');
const data = { windGusts: 12, pressure: 1005, dewPoint: 10, precipitation: 0, uvIndex: null, visibility: 10, precipitationIntervalMinutes: 15 };

test('dew point follows Fahrenheit, with explicit unavailable UV and AQI', () => {
  const html = renderToStaticMarkup(createElement(WeatherHighlights, { data, unit: 'f' }));
  assert.match(html, /50<span>°F/);
  assert.match(html, /Unavailable/);
  assert.match(html, /Not provided by this data source/);
  assert.doesNotMatch(html, /New Moon|Thermal Comfort/);
});
test('provider AQI uses US AQI thresholds', () => {
  const html = renderToStaticMarkup(createElement(WeatherHighlights, { data: { ...data, airQuality: { us_aqi: 75, pm2_5: 3, o3: 4, no2: 5 } }, unit: 'c' }));
  assert.match(html, /Moderate/);
  assert.match(html, /US AQI 75/);
  assert.match(html, /10<span>°C/);
});
test('forecast renders actual slot, units and zero rain without calling it Now', () => {
  const hours = [{ time: 1792000000, temperature: 0, isDay: true, condition: { code: 800, text: 'Clear' }, precipitationProbability: 0 }];
  const html = renderToStaticMarkup(createElement(HourlyForecast, { hours, unit: 'f', timezone: 'Asia/Bangkok' }));
  assert.match(html, /32°F/);
  assert.match(html, /0% chance of precipitation/);
  assert.match(html, /datetime=/i);
  assert.doesNotMatch(html, />NOW</);
});
test('header exposes destination unit and theme plus location access', () => {
  const noop = () => {};
  const html = renderToStaticMarkup(createElement(Header, { onSearch: noop, onUseLocation: noop, onToggleUnit: noop, onToggleTheme: noop, unit: 'c', theme: 'light', isSearching: false }));
  assert.match(html, /aria-label="Switch to degrees Fahrenheit"/);
  assert.match(html, /aria-label="Switch to dark theme"/);
  assert.match(html, /aria-label="Use current location"/);
  assert.match(html, /for="city-search"/);
});

const { getAqiLabel } = await server.ssrLoadModule('/src/utils/weatherFormat.ts');
test('US AQI boundaries include zero and all six categories', () => {
  const labels = [[0, 'Good'], [50, 'Good'], [51, 'Moderate'], [100, 'Moderate'], [101, 'Unhealthy for sensitive groups'], [150, 'Unhealthy for sensitive groups'], [151, 'Unhealthy'], [200, 'Unhealthy'], [201, 'Very unhealthy'], [300, 'Very unhealthy'], [301, 'Hazardous']];
  for (const [us_aqi, expected] of labels) assert.equal(getAqiLabel({ us_aqi }), expected);
});
test('zero UV is a real reading, not missing data', () => {
  const html = renderToStaticMarkup(createElement(WeatherHighlights, { data: { ...data, uvIndex: 0 }, unit: 'c' }));
  assert.match(html, /0.0<span/);
  assert.match(html, /Modelled current UV index/);
});
