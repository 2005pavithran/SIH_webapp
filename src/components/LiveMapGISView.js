// Live GIS Map Full-Screen View Component

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { REGIONS } from '../utils/mockData.js';

export function createLiveMapGISView() {
  const container = document.createElement('div');
  container.className = 'live-map-view animated-fade';
  container.style.height = 'calc(100vh - 115px)';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  let gisInstance = null;

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 12px;">
        <div class="view-title-group">
          <h1>
            <span>🗺️ LIVE GIS MULTI-HAZARD MAP</span>
            <span class="live-pulse-badge">GIS ENGINE ACTIVE</span>
          </h1>
          <p>Real-time spatial visualization of sensor nodes, perimeter propagation, high-risk inundation zones, and rescue assets</p>
        </div>
        <div class="view-actions">
          <div class="region-selector" style="background: var(--bg-card);">
            <select id="gis-focus-region">
              ${REGIONS.map(r => `<option value="${r.id}" ${r.id === state.selectedRegionId ? 'selected' : ''}>Focus: ${r.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="map-container-wrapper" style="flex: 1; min-height: 520px;">
        <!-- Map Floating Controls -->
        <div class="map-floating-controls">
          <div class="map-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="full-map-search-input" placeholder="Search node, river basin or district...">
          </div>

          <div class="map-layer-pills">
            <button class="layer-btn fire ${state.mapLayers.fire ? 'active' : ''}" data-layer="fire">🔥 Fire Hotspots</button>
            <button class="layer-btn flood ${state.mapLayers.flood ? 'active' : ''}" data-layer="flood">🌊 Flood Inundation</button>
            <button class="layer-btn air ${state.mapLayers.air ? 'active' : ''}" data-layer="air">🌫 Air Quality Plumes</button>
            <button class="layer-btn heat ${state.mapLayers.heat ? 'active' : ''}" data-layer="heat">🌡 Heat Thermal</button>
            <button class="layer-btn water ${state.mapLayers.sensors ? 'active' : ''}" data-layer="sensors">📡 Sensor Nodes</button>
            <button class="layer-btn ${state.mapLayers.teams ? 'active' : ''}" data-layer="teams">🚑 NDRF Teams</button>
            <button class="layer-btn ${state.mapLayers.shelters ? 'active' : ''}" data-layer="shelters">⛺ Relief Shelters</button>
          </div>
        </div>

        <!-- Leaflet GIS Map Element -->
        <div id="full-screen-gis-map" class="gis-map-element"></div>

        <!-- Map Legend -->
        <div class="map-legend-overlay">
          <div class="legend-title">Hazard Severity & Assets</div>
          <div class="legend-items">
            <div class="legend-item"><div class="legend-dot low"></div> Low Risk</div>
            <div class="legend-item"><div class="legend-dot mod"></div> Moderate</div>
            <div class="legend-item"><div class="legend-dot high"></div> High Warning</div>
            <div class="legend-item"><div class="legend-dot crit"></div> Critical Action</div>
            <div class="legend-item">🚑 Response Unit</div>
            <div class="legend-item">⛺ Safe Shelter</div>
          </div>
        </div>
      </div>
    `;

    // Attach Handlers
    container.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        store.toggleLayer(layerKey);
        btn.classList.toggle('active', store.getState().mapLayers[layerKey]);
        if (gisInstance) gisInstance.refresh();
      });
    });

    container.querySelector('#gis-focus-region').addEventListener('change', (e) => {
      store.setRegion(e.target.value);
      const reg = REGIONS.find(r => r.id === e.target.value);
      if (reg && gisInstance) {
        gisInstance.flyTo(reg.center, reg.zoom);
      }
    });

    const searchInp = container.querySelector('#full-map-search-input');
    searchInp.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      const match = store.getState().sensors.find(s => 
        s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
      );
      if (match && gisInstance) {
        gisInstance.flyTo([match.lat, match.lng], 15);
      }
    });

    setTimeout(() => {
      const el = container.querySelector('#full-screen-gis-map');
      if (el) {
        gisInstance = createGISMap('full-screen-gis-map', { isCompact: false });
        gisInstance.init(el);
      }
    }, 50);
  }

  render();

  return {
    element: container,
    destroy: () => {
      if (gisInstance) gisInstance.destroy();
    }
  };
}
