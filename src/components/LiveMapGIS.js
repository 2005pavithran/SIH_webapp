// Live GIS Map Component using Leaflet, OpenStreetMap, Carto & Satellite Overlays
// Supports State-Scoped Data Isolation for Operational Mode & National View for Landing

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { store } from '../state/store.js';
import { getRiskClass } from '../utils/formatters.js';

export function createGISMap(containerId, options = { isCompact: false, showTicker: false, isNational: false }) {
  let map = null;
  let resizeObserver = null;
  let currentTileLayer = null;
  let tickerInterval = null;
  let tickerTextEl = null;
  let tickerIdx = 0;
  const parentContainer = document.getElementById(containerId);

  let layerGroups = {
    sensors: L.layerGroup(),
    fire: L.layerGroup(),
    flood: L.layerGroup(),
    air: L.layerGroup(),
    heat: L.layerGroup(),
    teams: L.layerGroup(),
    shelters: L.layerGroup(),
    hazardZones: L.layerGroup(),
    hotspots: L.layerGroup()
  };

  const HAZARD_RISK_STYLES = {
    'Low':      { fill: '#5EC79E', stroke: '#3B9673', weight: 1.5, fillOpacity: 0.12, dash: '4, 6' },
    'Moderate': { fill: '#F1B44B', stroke: '#C98E20', weight: 2,   fillOpacity: 0.18, dash: '0' },
    'High':     { fill: '#E8833A', stroke: '#B85F1C', weight: 2.5, fillOpacity: 0.22, dash: '6, 3' },
    'Critical': { fill: '#D94242', stroke: '#A51E1E', weight: 3.5, fillOpacity: 0.30, dash: '0' },
    'Warning':  { fill: '#F1B44B', stroke: '#C98E20', weight: 2.2, fillOpacity: 0.20, dash: '6, 4' },
    'Watch':    { fill: '#2E8BC0', stroke: '#1E5E8C', weight: 2,   fillOpacity: 0.18, dash: '3, 5' }
  };

  const BASEMAPS = {
    osm: {
      name: 'OpenStreetMap (Original)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      }
    },
    cartoLight: {
      name: 'Carto Light (Gov)',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }
    },
    satellite: {
      name: 'Satellite Hybrid',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 18,
        attribution: '&copy; Esri World Imagery'
      }
    },
    topo: {
      name: 'Topographic',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 17,
        subdomains: ['a', 'b', 'c'],
        attribution: 'Map style &copy; OpenTopoMap'
      }
    }
  };

  let activeBasemapKey = 'osm';

  function setBasemap(key) {
    if (!map || !BASEMAPS[key]) return;
    if (currentTileLayer) {
      map.removeLayer(currentTileLayer);
    }
    const config = BASEMAPS[key];
    currentTileLayer = L.tileLayer(config.url, config.options);
    currentTileLayer.addTo(map);
    currentTileLayer.bringToBack();
    activeBasemapKey = key;
  }

  function renderTicker() {
    if (!options.showTicker || !parentContainer) return;
    if (document.getElementById(containerId + '-ticker')) return;
    const tickerWrap = document.createElement('div');
    tickerWrap.id = containerId + '-ticker';
    tickerWrap.className = 'map-footer-ticker';
    tickerWrap.innerHTML = `
      <div class="ticker-label">📡 LIVE FEED</div>
      <div class="ticker-marquee"><span class="ticker-text"></span></div>
    `;
    parentContainer.style.position = parentContainer.style.position || 'relative';
    parentContainer.appendChild(tickerWrap);
    tickerTextEl = tickerWrap.querySelector('.ticker-text');
    updateTickerContent();
    tickerInterval = setInterval(advanceTicker, 5500);
  }

  function updateTickerContent() {
    if (!tickerTextEl) return;
    const state = store.getState();
    const msgs = state.tickerMessages && state.tickerMessages.length ? state.tickerMessages : ['Live feed operational.'];
    tickerTextEl.textContent = msgs[tickerIdx % msgs.length] + '   •   ' + msgs[(tickerIdx + 1) % msgs.length];
  }

  function advanceTicker() {
    tickerIdx++;
    updateTickerContent();
  }

  function renderHotspots(state) {
    layerGroups.hotspots.clearLayers();
    const hotspots = state.alerts.filter(a => a.severity === 'Critical' || a.severity === 'Warning').slice(0, 10);
    hotspots.forEach(h => {
      if (!h.coordinates) return;
      const cls = h.severity === 'Critical' ? 'critical' : 'warning';
      L.circle(h.coordinates, {
        radius: 600 + (h.severity === 'Critical' ? 400 : 0),
        color: cls === 'critical' ? '#D94242' : '#E8833A',
        weight: 1.5,
        opacity: 0.65,
        fillColor: cls === 'critical' ? '#D94242' : '#E8833A',
        fillOpacity: 0.20,
        className: 'hotspot-pulse hotspot-' + cls
      }).addTo(layerGroups.hotspots);
    });
  }

  function initMap(el) {
    if (!el) return;

    if (map) {
      try {
        map.remove();
      } catch (e) {
        console.warn('Error removing map:', e);
      }
      map = null;
    }

    if (el._leaflet_id) {
      delete el._leaflet_id;
    }

    const state = store.getState();
    const stateConfig = store.getAuthorizedStateConfig();
    const activeDistrict = stateConfig.districts?.find(d => d.id === state.selectedRegionId) || stateConfig.districts?.[0] || stateConfig;

    const initialCenter = options.isCompact ? (activeDistrict.center || stateConfig.center) : stateConfig.center;
    const initialZoom = options.isCompact ? (activeDistrict.zoom || stateConfig.zoom) : (stateConfig.zoom || 8);

    map = L.map(el, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    setBasemap(activeBasemapKey);

    Object.values(layerGroups).forEach(lg => lg.addTo(map));

    renderLayers();
    renderHotspots(state);
    renderTicker();

    const triggerResize = () => {
      if (map) {
        map.invalidateSize();
      }
    };

    setTimeout(triggerResize, 60);
    setTimeout(triggerResize, 250);

    if (window.ResizeObserver && el) {
      resizeObserver = new ResizeObserver(() => {
        triggerResize();
      });
      resizeObserver.observe(el);
    }

    window.addEventListener('resize', triggerResize);

    return map;
  }

  function renderLayers() {
    if (!map) return;
    const state = store.getState();
    const stateId = store.getAuthorizedStateId();

    Object.values(layerGroups).forEach(lg => lg.clearLayers());

    // 1. Render Authorized State Sensor Nodes Only
    if (state.mapLayers.sensors) {
      state.sensors.forEach(sensor => {
        const riskCls = getRiskClass(sensor.risk);
        const dimOpacity = sensor.health === 'Damaged' ? 0.35 : (sensor.health === 'Inactive' ? 0.3 : (sensor.health === 'Maintenance Required' ? 0.72 : 1.0));
        
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pin sensor ${riskCls}" style="opacity:${dimOpacity}" title="${sensor.name} [${sensor.health}]">
              ${sensor.type === 'water' ? '💧' : sensor.type === 'fire' ? '🔥' : sensor.type === 'air' ? '🌫' : sensor.type === 'landslide' ? '⛰' : '🌡'}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon });

        const popupHTML = `
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${sensor.name}</span>
            <span class="status-badge ${riskCls}">${sensor.risk}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 6px;">ID: <strong>${sensor.id}</strong> • ${sensor.location}</div>
          <div class="popup-telemetry-grid">
            <div class="popup-telemetry-item">
              <span>Water Level</span>
              <span>${sensor.waterLevel ? sensor.waterLevel + ' m' : 'N/A'}</span>
            </div>
            <div class="popup-telemetry-item">
              <span>Temperature</span>
              <span>${sensor.temp}°C</span>
            </div>
            <div class="popup-telemetry-item">
              <span>PM 2.5</span>
              <span>${sensor.pm25} µg/m³</span>
            </div>
            <div class="popup-telemetry-item">
              <span>Battery</span>
              <span>${sensor.battery}%</span>
            </div>
          </div>
          <div class="popup-actions">
            <button class="popup-btn primary" onclick="window.drawerManager?.openSensorDrawer('${sensor.id}')">Sensor Diagnostics</button>
          </div>
        `;

        marker.bindPopup(popupHTML);
        layerGroups.sensors.addLayer(marker);
      });
    }

    // 2. Render Active State Alerts
    state.alerts.forEach(alert => {
      const type = alert.hazard.toLowerCase();
      let targetGroup = null;
      if (type.includes('fire') && state.mapLayers.fire) targetGroup = layerGroups.fire;
      else if (type.includes('flood') && state.mapLayers.flood) targetGroup = layerGroups.flood;
      else if (type.includes('air') && state.mapLayers.air) targetGroup = layerGroups.air;
      else if (type.includes('heat') && state.mapLayers.heat) targetGroup = layerGroups.heat;
      else if (state.mapLayers.flood) targetGroup = layerGroups.flood;

      if (targetGroup && alert.coordinates) {
        const riskCls = getRiskClass(alert.severity);
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pulse ${riskCls}"></div>
            <div class="marker-pin ${riskCls}">
              ${type.includes('flood') ? '🌊' : type.includes('fire') ? '🔥' : type.includes('air') ? '🌫' : type.includes('landslide') ? '⛰' : '⚠️'}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(alert.coordinates, { icon });
        const popupHTML = `
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${alert.hazard} (${alert.id})</span>
            <span class="status-badge ${riskCls}">${alert.severity}</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px;">${alert.title}</div>
          <div style="font-size: 11px; color: var(--color-text-muted); margin-bottom: 8px;">${alert.location} • AI Confidence: <strong>${alert.aiConfidence}%</strong></div>
          <div style="font-size: 11px; color: var(--color-text-secondary); background: var(--color-surface-soft); padding: 6px; border-radius: 6px; border: 1px solid var(--color-border-subtle);">${alert.description}</div>
          <div class="popup-actions">
            <button class="popup-btn primary" onclick="window.drawerManager?.openAlertDrawer('${alert.id}')">View Details & AI</button>
            <button class="popup-btn secondary" onclick="window.location.hash = '#incidents'">Dispatch Team</button>
          </div>
        `;
        marker.bindPopup(popupHTML);
        targetGroup.addLayer(marker);
      }
    });

    // 3. Render Emergency Response Teams
    if (state.mapLayers.teams) {
      state.teams.forEach(team => {
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pin team" title="${team.name}">
              🚑
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([team.lat, team.lng], { icon });
        marker.bindPopup(`
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">🚑 ${team.name}</span>
            <span class="status-badge ${team.status === 'Deployed' ? 'critical' : 'success'}">${team.status}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary);">Role: <strong>${team.type}</strong></div>
          <div style="font-size: 11px; color: var(--color-text-muted);">Personnel: ${team.personnel} | ETA: <strong>${team.eta}</strong></div>
          <div class="popup-actions" style="margin-top: 8px;">
            <button class="popup-btn primary" onclick="window.location.hash = '#incidents'">Manage Mission</button>
          </div>
        `);
        layerGroups.teams.addLayer(marker);
      });
    }

    // 4. Render Relief Shelters
    if (state.mapLayers.shelters) {
      state.shelters.forEach(shelter => {
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pin shelter" title="${shelter.name}">
              ⛺
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon });
        marker.bindPopup(`
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">⛺ ${shelter.name}</span>
            <span class="status-badge ${shelter.status === 'Active' ? 'success' : 'info'}">${shelter.status}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary);">Capacity: <strong>${shelter.capacity} Residents</strong></div>
          <div style="font-size: 11px; color: var(--color-text-muted);">Currently Occupied: ${shelter.occupied} (${Math.round((shelter.occupied / shelter.capacity) * 100)}%)</div>
        `);
        layerGroups.shelters.addLayer(marker);
      });
    }

    // 5. Render State Hazard Polygons
    const hazardZones = store.getAuthorizedHazardZones();
    if (hazardZones && hazardZones.features) {
      hazardZones.features.forEach(feat => {
        const hazard = feat.properties.hazard;
        const isFlood = hazard === 'Flood';
        const isFire = hazard === 'Forest Fire';
        if (isFlood && !state.mapLayers.flood) return;
        if (isFire && !state.mapLayers.fire) return;

        const riskLevel = feat.properties.risk || 'Moderate';
        const style = HAZARD_RISK_STYLES[riskLevel] || HAZARD_RISK_STYLES['Moderate'];
        const poly = L.geoJSON(feat, {
          style: {
            color: style.stroke,
            weight: style.weight,
            opacity: 0.95,
            fillColor: style.fill,
            fillOpacity: style.fillOpacity,
            dashArray: style.dash,
            className: 'hazard-polygon'
          }
        });

        poly.bindPopup(`
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${feat.properties.name}</span>
            <span class="status-badge ${getRiskClass(riskLevel)}">${riskLevel}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary);">Hazard Type: <strong>${feat.properties.hazard}</strong></div>
          <div style="font-size: 11px; color: var(--color-text-secondary);">Estimated Inundation Perimeter: <strong>${feat.properties.area}</strong></div>
          <div class="popup-actions" style="margin-top: 8px;">
            <button class="popup-btn primary" onclick="window.drawerManager?.openAIDrawer('${feat.properties.hazard}')">View AI Prediction</button>
          </div>
        `);
        layerGroups.hazardZones.addLayer(poly);
      });
    }

    renderHotspots(state);
  }

  function destroy() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (map) {
      try {
        map.remove();
      } catch (e) {}
      map = null;
    }
  }

  return {
    init: initMap,
    refresh: renderLayers,
    setBasemap: setBasemap,
    getActiveBasemap: () => activeBasemapKey,
    flyTo: (coords, zoom = 12) => {
      if (map && coords) {
        map.flyTo(coords, zoom, { duration: 1.2 });
      }
    },
    invalidateSize: () => {
      if (map) map.invalidateSize();
    },
    destroy
  };
}
