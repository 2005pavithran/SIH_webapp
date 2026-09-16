// Dynamic Risk & Hazard Contour Map Component (State Scoped)

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { getRiskClass } from '../utils/formatters.js';

export function createRiskMapDynamic() {
  const container = document.createElement('div');
  container.className = 'risk-map-view animated-fade';

  let gisInstance = null;

  function render() {
    const state = store.getState();
    const stateName = state.loggedInState || 'Tamil Nadu';
    const stateConfig = store.getAuthorizedStateConfig();

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🗺️ ${stateName.toUpperCase()} DYNAMIC RISK & HAZARD CONTOURS</span>
            <span class="status-badge critical">PROBABILISTIC HOTSPOTS</span>
          </h1>
          <p class="view-desc-sub">Spatial vulnerability indices, multi-hazard risk trajectories, and calculated inundation perimeters in ${stateName}</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-primary" onclick="window.drawerManager?.openAIDrawer('${state.aiPrediction?.hazard || 'Flood'}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>AI Risk Explanation</span>
          </button>
          <button class="btn-secondary" onclick="window.location.hash = '#incidents'">
            <span>Escalate SOP</span>
          </button>
        </div>
      </div>

      <!-- Risk Control Bar -->
      <div class="scenario-bar" style="border-left-color: var(--color-primary);">
        <div class="scenario-info-text">
          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Dominant Hazard:</span>
            <select id="risk-hazard-select" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="Flood" selected>🌊 Flood & Inundation</option>
              <option value="Fire">🔥 Forest Wildfire</option>
              <option value="Air">🌫 Air Quality (PM2.5)</option>
              <option value="Landslide">⛰ Landslide / Slope Creep</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Forecast Horizon:</span>
            <select id="risk-time-select" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="24h" selected>Last 24 Hours (Observed Telemetry)</option>
              <option value="3h_forecast">Next 3 Hours (AI Neural Model)</option>
              <option value="12h_forecast">Next 12 Hours (Ensemble Trajectory)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">CURRENT ${state.loggedInStateId} INDEX:</span>
            <span style="font-family: var(--font-display); font-size: 18px; font-weight: 800; color: var(--color-critical);">${state.aiPrediction.riskScore} / 100</span>
            <span class="status-badge critical">${state.aiPrediction.riskLevel}</span>
          </div>
        </div>
      </div>

      <!-- Severity Reference Matrix (4-Grid) -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div class="gov-card" style="padding: 12px 14px; border-left: 4px solid var(--color-success);">
          <div style="font-size: 12px; font-weight: 700; color: var(--color-success);">LOW RISK (0–39)</div>
          <div style="font-size: 11px; color: var(--color-text-muted);">Nominal seasonal baseline</div>
        </div>

        <div class="gov-card" style="padding: 12px 14px; border-left: 4px solid var(--color-warning);">
          <div style="font-size: 12px; font-weight: 700; color: var(--color-warning);">MODERATE / WATCH (40–59)</div>
          <div style="font-size: 11px; color: var(--color-text-muted);">Heightened sensor polling</div>
        </div>

        <div class="gov-card" style="padding: 12px 14px; border-left: 4px solid var(--hazard-fire);">
          <div style="font-size: 12px; font-weight: 700; color: var(--hazard-fire);">HIGH WARNING (60–79)</div>
          <div style="font-size: 11px; color: var(--color-text-muted);">SDRF / NDRF standby</div>
        </div>

        <div class="gov-card" style="padding: 12px 14px; border-left: 4px solid var(--color-critical);">
          <div style="font-size: 12px; font-weight: 700; color: var(--color-critical);">CRITICAL ACTION (80–100)</div>
          <div style="font-size: 11px; color: var(--color-text-muted);">Immediate evacuation SOP</div>
        </div>
      </div>

      <!-- Main Map + Affected Zone Intelligence -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <!-- GIS Map -->
        <div class="gov-card" style="height: 520px; position: relative;">
          <div class="map-floating-controls">
            <div class="map-control-actions">
              <div class="map-basemap-select-wrap">
                <select id="dynamic-risk-basemap-select" title="Change Base Map Layer">
                  <option value="osm" selected>🗺️ Street Map</option>
                  <option value="cartoLight">🏙️ Carto Light</option>
                  <option value="satellite">🛰️ Satellite</option>
                  <option value="topo">⛰️ Topographic</option>
                </select>
              </div>

              <div class="map-layer-pills">
                <button class="layer-btn flood ${state.mapLayers.flood ? 'active' : ''}" data-layer="flood">🌊 Flood</button>
                <button class="layer-btn fire ${state.mapLayers.fire ? 'active' : ''}" data-layer="fire">🔥 Fire</button>
                <button class="layer-btn ${state.mapLayers.sensors ? 'active' : ''}" data-layer="sensors">📡 Nodes</button>
                <button class="layer-btn ${state.mapLayers.teams ? 'active' : ''}" data-layer="teams">🚑 Teams</button>
              </div>
            </div>
          </div>

          <div id="dynamic-risk-gis-map" class="gis-map-element"></div>
        </div>

        <!-- Affected Zone & Hotspots -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="gov-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>📍 ${stateName} Catchment Assessment</span>
              </div>
              <span class="status-badge critical">SECTOR ALERT</span>
            </div>
            <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                <span style="color: var(--color-text-secondary);">Active Threat Model:</span>
                <strong style="color: var(--color-primary);">${stateConfig.primaryThreat}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                <span style="color: var(--color-text-secondary);">Monitored Sectors:</span>
                <strong style="font-family: var(--font-mono);">${stateConfig.districts.length} Districts</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                <span style="color: var(--color-text-secondary);">Relief Camps Ready:</span>
                <strong style="color: var(--color-primary);">${state.shelters.length} Designated Sites</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                <span style="color: var(--color-text-secondary);">Telemetry Nodes:</span>
                <strong style="font-family: var(--font-mono); color: var(--color-success);">${state.sensors.length} Mesh Points</strong>
              </div>

              <div style="margin-top: 8px;">
                <button class="btn-primary" style="width: 100%; justify-content: center; font-size: 12px;" onclick="window.drawerManager?.openAIDrawer('${state.aiPrediction?.hazard || 'Flood'}')">
                  Explore AI Prediction & Evidence
                </button>
              </div>
            </div>
          </div>

          <!-- Hotspot Ranking Scoped to State Districts -->
          <div class="gov-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>🔥 Priority Vulnerability Ranking</span>
              </div>
            </div>
            <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 8px; padding: 12px;">
              ${stateConfig.districts.slice(0, 3).map((dist, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-surface-soft); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                  <div>
                    <div style="font-weight: 700; font-size: 12px; color: var(--color-text-primary);">${idx + 1}. ${dist.name}</div>
                    <div style="font-size: 11px; color: var(--color-text-muted);">${stateConfig.primaryThreat}</div>
                  </div>
                  <span class="status-badge ${idx === 0 ? 'critical' : idx === 1 ? 'high' : 'warning'}">
                    ${idx === 0 ? '94%' : idx === 1 ? '82%' : '68%'} RISK
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Layer buttons
    container.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        store.toggleLayer(layerKey);
        btn.classList.toggle('active', store.getState().mapLayers[layerKey]);
        if (gisInstance) gisInstance.refresh();
      });
    });

    // Basemap selector
    const basemapSelect = container.querySelector('#dynamic-risk-basemap-select');
    if (basemapSelect) {
      basemapSelect.addEventListener('change', (e) => {
        if (gisInstance) {
          gisInstance.setBasemap(e.target.value);
        }
      });
    }

    setTimeout(() => {
      const el = container.querySelector('#dynamic-risk-gis-map');
      if (el) {
        gisInstance = createGISMap('dynamic-risk-gis-map', { isCompact: false });
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
