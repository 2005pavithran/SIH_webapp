// Live GIS Map Component using Leaflet & Custom Animated Overlays

import L from 'leaflet';
import { store } from '../state/store.js';
import { REGIONS, HAZARD_ZONES_GEOJSON } from '../utils/mockData.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';

export function createGISMap(containerId, options = { isCompact: false }) {
  let map = null;
  let layerGroups = {
    sensors: L.layerGroup(),
    fire: L.layerGroup(),
    flood: L.layerGroup(),
    air: L.layerGroup(),
    heat: L.layerGroup(),
    teams: L.layerGroup(),
    shelters: L.layerGroup(),
    hazardZones: L.layerGroup()
  };

  function initMap(el) {
    if (map) {
      map.remove();
      map = null;
    }

    const state = store.getState();
    const currentRegion = REGIONS.find(r => r.id === state.selectedRegionId) || REGIONS[0];

    map = L.map(el, {
      center: currentRegion.center,
      zoom: options.isCompact ? currentRegion.zoom - 0.5 : currentRegion.zoom,
      zoomControl: !options.isCompact,
      attributionControl: false
    });

    if (options.isCompact) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    // High Performance Basemap Tiles (OpenStreetMap - 100% Free & No API Key Required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Attach layer groups to map
    Object.values(layerGroups).forEach(lg => lg.addTo(map));

    renderLayers();
    return map;
  }

  function renderLayers() {
    if (!map) return;
    const state = store.getState();

    // Clear all layers
    Object.values(layerGroups).forEach(lg => lg.clearLayers());

    // 1. Render Sensor Nodes
    if (state.mapLayers.sensors) {
      state.sensors.forEach(sensor => {
        const riskCls = getRiskClass(sensor.risk);
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pulse ${riskCls}"></div>
            <div class="marker-pin ${riskCls} sensor" title="${sensor.name}">
              ${sensor.type === 'water' ? '💧' : sensor.type === 'fire' ? '🔥' : sensor.type === 'air' ? '🌫' : '🌡'}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon });

        const popupHTML = `
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${sensor.type === 'water' ? '💧 Hydro Node' : sensor.type === 'fire' ? '🔥 Thermal Node' : '📡 Environmental Node'}: ${sensor.id}</span>
            <span class="risk-badge ${riskCls}">${sensor.risk}</span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">${sensor.name} • ${sensor.location}</div>
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
            <button class="popup-btn primary" onclick="window.appStore.openSensorModal('${sensor.id}')">Sensor Diagnostics</button>
          </div>
        `;

        marker.bindPopup(popupHTML);
        layerGroups.sensors.addLayer(marker);
      });
    }

    // 2. Render Active Hazards (Fire, Flood, Air, Heat)
    state.alerts.forEach(alert => {
      const type = alert.hazard.toLowerCase();
      let targetGroup = null;
      if (type.includes('fire') && state.mapLayers.fire) targetGroup = layerGroups.fire;
      else if (type.includes('flood') && state.mapLayers.flood) targetGroup = layerGroups.flood;
      else if (type.includes('air') && state.mapLayers.air) targetGroup = layerGroups.air;
      else if (type.includes('heat') && state.mapLayers.heat) targetGroup = layerGroups.heat;

      if (targetGroup && alert.coordinates) {
        const riskCls = getRiskClass(alert.severity);
        const icon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div class="marker-pulse ${riskCls}"></div>
            <div class="marker-pin ${riskCls}">
              ${getHazardIcon(alert.hazard)}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker(alert.coordinates, { icon });
        const popupHTML = `
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${getHazardIcon(alert.hazard)} ${alert.hazard} Event</span>
            <span class="risk-badge ${riskCls}">${alert.severity}</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px;">${alert.title}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">${alert.location} • AI Confidence: ${alert.aiConfidence}%</div>
          <div style="font-size: 11px; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 6px;">${alert.description}</div>
          <div class="popup-actions">
            <button class="popup-btn primary" onclick="window.appStore.setView('incidents')">Deploy Response</button>
            <button class="popup-btn secondary" onclick="window.appStore.openAlertModal('${alert.id}')">Details</button>
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
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([team.lat, team.lng], { icon });
        marker.bindPopup(`
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">🚑 ${team.name}</span>
            <span class="risk-badge ${team.status === 'Deployed' ? 'critical' : 'low'}">${team.status}</span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">Role: ${team.type}</div>
          <div style="font-size: 11px; color: #94a3b8;">Personnel: ${team.personnel} | ETA: ${team.eta}</div>
        `);
        layerGroups.teams.addLayer(marker);
      });
    }

    // 4. Render Hazard Polygons (Contour Zones)
    if (state.mapLayers.flood || state.mapLayers.fire) {
      HAZARD_ZONES_GEOJSON.features.forEach(feat => {
        const isFlood = feat.properties.hazard === 'Flood';
        const color = isFlood ? '#06b6d4' : '#f97316';
        const poly = L.geoJSON(feat, {
          style: {
            color: color,
            weight: 2,
            opacity: 0.85,
            fillColor: color,
            fillOpacity: 0.22,
            dashArray: '4, 6'
          }
        });
        poly.bindPopup(`
          <div class="popup-hazard-header">
            <span class="popup-hazard-title">${feat.properties.name}</span>
            <span class="risk-badge critical">${feat.properties.risk}</span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">Hazard: ${feat.properties.hazard}</div>
          <div style="font-size: 11px; color: #cbd5e1;">Estimated Inundation Area: ${feat.properties.area}</div>
        `);
        layerGroups.hazardZones.addLayer(poly);
      });
    }
  }

  return {
    init: initMap,
    refresh: renderLayers,
    flyTo: (coords, zoom = 14) => {
      if (map && coords) {
        map.flyTo(coords, zoom, { duration: 1.2 });
      }
    },
    destroy: () => {
      if (map) {
        map.remove();
        map = null;
      }
    }
  };
}
