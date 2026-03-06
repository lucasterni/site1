document.addEventListener('DOMContentLoaded', async () => {
  const mapRoot = document.getElementById('tickets-map');
  if (!mapRoot || typeof L === 'undefined') return;

  const map = L.map('tickets-map', {
    minZoom: 2,
    worldCopyJump: true
  }).setView([24, 8], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const manualCaptions = await loadTicketCaptions();
  const tickets = Object.entries(manualCaptions || {});

  const sessionCache = new Map();
  const persistedCache = loadGeocodeCache();
  const locationSlots = new Map();
  const locationMarkers = new Map();

  for (const [ticketKey, ticket] of tickets) {
    const title = ticket.title || '[unknown]';
    const location = (ticket.location || '[unknown]').trim();
    const cinema = ticket.cinema || '[unknown]';
    const year = ticket.year || '[unknown]';
    const imagePath = getTicketImagePath(ticketKey);

    const coords = getInitialCoordinates(location, sessionCache, persistedCache);
    if (!coords) continue;

    const overlapIndex = locationSlots.get(location) || 0;
    locationSlots.set(location, overlapIndex + 1);

    const jittered = jitterCoordinates(coords[0], coords[1], overlapIndex);

    const marker = L.circleMarker(jittered, {
      radius: 5,
      color: '#111',
      fillColor: '#FFF8E7',
      fillOpacity: 0.95,
      weight: 1.5
    }).addTo(map);

    marker.bindPopup(`
      <div class="ticket-popup">
        ${imagePath ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(title)}">` : ''}
        <strong>🎟 ${escapeHtml(title)}</strong><br>
        📍 ${escapeHtml(location)}<br>
        🎥 ${escapeHtml(cinema)}<br>
        🗓 ${escapeHtml(year)}
      </div>
    `);

    const markersForLocation = locationMarkers.get(location) || [];
    markersForLocation.push({ marker, overlapIndex });
    locationMarkers.set(location, markersForLocation);
  }

  const uniqueLocations = [...new Set(tickets.map(([, ticket]) => String(ticket.location || '[unknown]').trim()))];
  const geocodedLocations = await resolveUnknownLocations(uniqueLocations, sessionCache, persistedCache);

  for (const [location, coords] of geocodedLocations.entries()) {
    const markersForLocation = locationMarkers.get(location);
    if (!markersForLocation || !coords) continue;

    for (const entry of markersForLocation) {
      entry.marker.setLatLng(jitterCoordinates(coords[0], coords[1], entry.overlapIndex));
    }
  }

  saveGeocodeCache(persistedCache);
});

function getTicketImagePath(ticketKey) {
  const [projectPart, imagePart] = String(ticketKey).split('-');
  const projectNumber = Number(projectPart);
  const imageIndex = Number(imagePart);

  if (!Number.isInteger(projectNumber) || !Number.isInteger(imageIndex)) return '';
  if (projectNumber < 1 || projectNumber > 9 || imageIndex < 1 || imageIndex > 8) return '';

  const fileNumber = (projectNumber - 1) * 8 + imageIndex;
  return `Images/${fileNumber}.jpg`;
}

function jitterCoordinates(lat, lon, index) {
  if (!index) return [lat, lon];

  const angle = (index * 42) * (Math.PI / 180);
  const distance = 0.22 * Math.ceil(index / 6);

  return [
    lat + Math.sin(angle) * distance,
    lon + Math.cos(angle) * distance
  ];
}

async function loadTicketCaptions() {
  try {
    const response = await fetch('projects.js');
    if (!response.ok) return {};

    const scriptText = await response.text();
    const match = scriptText.match(/const\s+manualCaptions\s*=\s*(\{[\s\S]*?\n\s*\});/);
    if (!match || !match[1]) return {};

    return Function(`"use strict"; return (${match[1]});`)();
  } catch (error) {
    return {};
  }
}

function getInitialCoordinates(location, sessionCache, persistedCache) {
  if (!location) return null;

  if (sessionCache.has(location)) {
    return sessionCache.get(location);
  }

  const persisted = persistedCache[location];
  if (Array.isArray(persisted) && persisted.length === 2) {
    const lat = Number(persisted[0]);
    const lon = Number(persisted[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const coords = [lat, lon];
      sessionCache.set(location, coords);
      return coords;
    }
  }

  const fallback = fallbackCoordinates(location);
  sessionCache.set(location, fallback);
  return fallback;
}

async function resolveUnknownLocations(locations, sessionCache, persistedCache) {
  const result = new Map();
  const tasks = [];

  for (const location of locations) {
    if (!location) continue;

    const query = normalizeLocationQuery(location);
    if (!query) continue;

    if (persistedCache[location]) {
      result.set(location, sessionCache.get(location) || persistedCache[location]);
      continue;
    }

    tasks.push(
      fetchCoordinatesFromNominatim(query).then((coords) => {
        if (!coords) return;
        sessionCache.set(location, coords);
        persistedCache[location] = coords;
        result.set(location, coords);
      })
    );
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }

  return result;
}

function normalizeLocationQuery(location) {
  return String(location)
    .replace('[unknown]', '')
    .replace('(?)', '')
    .trim();
}

async function fetchCoordinatesFromNominatim(query) {
  try {
    const encoded = encodeURIComponent(query);
    if (!encoded) return null;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encoded}`);
    if (!response.ok) return null;

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const lat = Number(results[0].lat);
    const lon = Number(results[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    return [lat, lon];
  } catch (error) {
    return null;
  }
}

function loadGeocodeCache() {
  try {
    const raw = localStorage.getItem('ticketsGeocodeCache');
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};

    return parsed;
  } catch (error) {
    return {};
  }
}

function saveGeocodeCache(cache) {
  try {
    localStorage.setItem('ticketsGeocodeCache', JSON.stringify(cache));
  } catch (error) {
    // Ignore storage errors
  }
}

function fallbackCoordinates(location) {
  const text = (location || '').toLowerCase();

  const lookup = [
    { match: ['india'], coords: [22.5, 79.5] },
    { match: ['hollywood', 'los angeles'], coords: [34.0928, -118.3287] },
    { match: ['prague'], coords: [50.0755, 14.4378] },
    { match: ['jodhpur'], coords: [26.2389, 73.0243] },
    { match: ['berlin'], coords: [52.52, 13.405] },
    { match: ['lisbon'], coords: [38.7223, -9.1393] },
    { match: ['whittier'], coords: [33.9792, -118.0328] },
    { match: ['finland'], coords: [61.9241, 25.7482] },
    { match: ['egypt'], coords: [26.8206, 30.8025] },
    { match: ['valencia'], coords: [39.4699, -0.3763] },
    { match: ['new york'], coords: [40.7128, -74.006] },
    { match: ['centralia'], coords: [46.7162, -122.9543] },
    { match: ['bizerte'], coords: [37.2744, 9.8739] },
    { match: ['forsyth'], coords: [46.2753, -106.6778] },
    { match: ['spain'], coords: [40.4637, -3.7492] },
    { match: ['soviet union', 'russia'], coords: [55.7558, 37.6173] },
    { match: ['france'], coords: [46.2276, 2.2137] },
    { match: ['belfort'], coords: [47.6397, 6.8638] },
    { match: ['paris'], coords: [48.8566, 2.3522] },
    { match: ['barcelona'], coords: [41.3851, 2.1734] },
    { match: ['detroit'], coords: [42.3314, -83.0458] },
    { match: ['las palmas'], coords: [28.1235, -15.4363] },
    { match: ['chile'], coords: [-33.4569, -70.6483] },
    { match: ['albacete'], coords: [38.9942, -1.8585] },
    { match: ['galapagar'], coords: [40.5784, -4.0036] },
    { match: ['madrid'], coords: [40.4168, -3.7038] },
    { match: ['toronto'], coords: [43.6532, -79.3832] },
    { match: ['hong kong'], coords: [22.3193, 114.1694] },
    { match: ['australia'], coords: [-25.2744, 133.7751] },
    { match: ['nairobi', 'kenya'], coords: [-1.2921, 36.8219] },
    { match: ['ibiza'], coords: [38.9067, 1.4206] },
    { match: ['porto'], coords: [41.1579, -8.6291] },
    { match: ['portugal'], coords: [39.3999, -8.2245] },
    { match: ['punpin', 'thailand'], coords: [9.0268, 99.2311] },
    { match: ['london'], coords: [51.5072, -0.1276] },
    { match: ['uk', 'united kingdom'], coords: [55.3781, -3.436] },
    { match: ['brest'], coords: [48.3904, -4.4861] },
    { match: ['leeds'], coords: [53.8008, -1.5491] },
    { match: ['malta'], coords: [35.9375, 14.3754] },
    { match: ['bracknell'], coords: [51.4143, -0.7536] },
    { match: ['manchester'], coords: [53.4808, -2.2426] },
    { match: ['lille'], coords: [50.6292, 3.0573] },
    { match: ['guildford'], coords: [51.2362, -0.5704] },
    { match: ['brescia'], coords: [45.5416, 10.2118] },
    { match: ['italy'], coords: [41.8719, 12.5674] },
    { match: ['westfield'], coords: [40.6584, -74.3474] },
    { match: ['dublin', 'ireland'], coords: [53.3498, -6.2603] },
    { match: ['grapevine'], coords: [32.9343, -97.0781] },
    { match: ['providence'], coords: [41.824, -71.4128] },
    { match: ['glasgow'], coords: [55.8642, -4.2518] },
    { match: ['godalming'], coords: [51.1858, -0.6149] },
    { match: ['koblenz'], coords: [50.3569, 7.5889] },
    { match: ['germany'], coords: [51.1657, 10.4515] },
    { match: ['canada'], coords: [56.1304, -106.3468] },
    { match: ['tunisia'], coords: [33.8869, 9.5375] },
    { match: ['moscow'], coords: [55.7558, 37.6173] }
  ];

  for (const item of lookup) {
    if (item.match.some(token => text.includes(token))) {
      return item.coords;
    }
  }

  return [20, 0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
