import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({server: {middlewareMode: true}, appType: 'custom'});
after(() => server.close());
const { fetchZenithWeather } = await server.ssrLoadModule('/src/services/weatherApi.ts');
const { searchLocations } = await server.ssrLoadModule('/src/services/geocoding.ts');
const now = Date.UTC(2026, 9, 14, 18) / 1000;
function forecast() {
  const current = { time: now + 900, interval: 900, temperature_2m: 28, relative_humidity_2m: 75, apparent_temperature: 31, is_day: 0, precipitation: 0, rain: 0, showers: 0, snowfall: 0, weather_code: 3, cloud_cover: 90, pressure_msl: 1010, wind_speed_10m: 12, wind_gusts_10m: 18, dew_point_2m: 21, visibility: 10000, uv_index: 0 };
  const hourly = {time: Array.from({length: 30}, (_, i) => now + (i - 2) * 3600)};
  for (const [key, value] of Object.entries({temperature_2m: 28, apparent_temperature: 31, relative_humidity_2m: 75, precipitation_probability: 0, weather_code: 3, wind_speed_10m: 12, uv_index: 0, is_day: 0})) hourly[key] = hourly.time.map(() => value);
  return {timezone: 'Asia/Bangkok', utc_offset_seconds: 25200, current, hourly, daily: {time: [now - 3600], temperature_2m_max: [32], temperature_2m_min: [24], precipitation_probability_max: [25], precipitation_sum: [1], uv_index_max: [8], weather_code: [61]}};
}
const air = {current: {us_aqi: 75, pm2_5: 12, pm10: 14, ozone: 50, nitrogen_dioxide: null, sulphur_dioxide: 1}};
function mockProvider(t, weather = forecast(), airResponse = new Response(JSON.stringify(air))) {
  t.mock.method(globalThis, 'fetch', async (url) => String(url).includes('air-quality-api') ? airResponse : new Response(JSON.stringify(weather)));
}
test('maps real units, WMO, night, zero UV, hourly horizon and local daily boundary', async t => {
  mockProvider(t);
  const result = await fetchZenithWeather(13.75, 100.5, 'Bangkok', 'Thailand');
  assert.equal(result.current.visibility, 10);
  assert.equal(result.current.windSpeed, 12);
  assert.equal(result.current.uvIndex, 0);
  assert.equal(result.current.precipitationIntervalMinutes, 15);
  assert.equal(result.current.isDay, false);
  assert.equal(result.current.condition.text, 'Overcast');
  assert.equal(result.current.airQuality.us_aqi, 75);
  assert.equal(result.current.airQuality.no2, null);
  assert.equal(result.hourly.length, 24);
  assert.equal(result.hourly[0].time, now);
  assert.equal(result.daily[0].date, '2026-10-15');
  assert.equal(result.location.timezone, 'Asia/Bangkok');
});
test('air quality outage leaves weather available', async t => {
  mockProvider(t, forecast(), new Response('', {status: 503}));
  assert.equal((await fetchZenithWeather(0, 0, 'Test', '')).current.airQuality, undefined);
});
test('null weather values fail honestly instead of becoming zero', async t => {
  const data = forecast(); data.current.temperature_2m = null;
  mockProvider(t, data);
  await assert.rejects(fetchZenithWeather(0, 0, 'Test', ''), /incomplete data/);
});
test('HTTP rate limiting is an actionable weather error', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', {status: 429}));
  await assert.rejects(fetchZenithWeather(0, 0, 'Test', ''), /try again shortly/);
});
test('invalid coordinates are rejected before any request', async t => {
  const fetch = t.mock.method(globalThis, 'fetch');
  await assert.rejects(fetchZenithWeather(NaN, 0, 'Test', ''), /valid location/);
  assert.equal(fetch.mock.callCount(), 0);
});
test('geocoding maps region/country and filters invalid coordinates', async t => {
  t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(new URL(url).searchParams.get('name'), 'Bangkok');
    assert.equal(new URL(url).searchParams.has('appid'), false);
    return new Response(JSON.stringify({results: [{name: 'Bangkok', latitude: 13.75, longitude: 100.5, country: 'Thailand', admin1: 'Bangkok'}, {name: 'Bad', latitude: 999, longitude: 0}]}));
  });
  const result = await searchLocations(' Bangkok ');
  assert.equal(result.length, 1);
  assert.equal(result[0].fullLabel, 'Bangkok, Bangkok, Thailand');
});
test('geocoding empty result and network failure return no matches', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  assert.deepEqual(await searchLocations('zzzz'), []);
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('offline'); });
  assert.deepEqual(await searchLocations('Bangkok'), []);
});

test('malformed optional air quality cannot break weather', async t => {
  mockProvider(t, forecast(), new Response(JSON.stringify({current: []})));
  assert.equal((await fetchZenithWeather(0, 0, 'Test', '')).current.airQuality, undefined);
});
