// Dynamic Risk Map Component

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { getRiskClass } from '../utils/formatters.js';

export function createRiskMapDynamic() {
  const container = document.createElement('div');
  container.className = 'risk-map-view animated-fade';

  let gisInstance = null;

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>🔴 DYNAMIC RISK & HAZARD CONTOUR MAP</span>
            <span class="risk-badge critical">PROBABILISTIC HOTSPOTS</span>
          </h1>
          <p>Real-time spatial vulnerability index, multi-hazard risk trends, and calculated affected inundation perimeters</p>
        </div>
        <div class="view-actions">
          <button class="btn-primary" onclick="window.appStore.setView('incidents')">
            <span>Escalate to Incident Response</span>
          </button>
        </div>
      </div>

      <!-- Risk Control Bar -->
      <div class="risk-map-control-bar">
        <div class="risk-filters-group">
          <div class="filter-select-item">
            <span>Hazard:</span>
            <select id="risk-hazard-select">
              <option value="Flood" selected>🌊 Flood (Inundation)</option>
              <option value="Fire">🔥 Forest Fire (Wildfire)</option>
              <option value="Air">🌫 Air Quality (PM2.5)</option>
              <option value="Landslide">⛰ Landslide / Creep</option>
              <option value="Heat">🌡 Urban Heat Wave</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Time Window:</span>
            <select id="risk-time-select">
              <option value="24h" selected>Last 24 Hours (Observed)</option>
              <option value="6h">Last 6 Hours (Rapid Rise)</option>
              <option value="3h_forecast">Next 3 Hours (AI Forecast)</option>
              <option value="12h_forecast">Next 12 Hours (Ensemble Model)</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Vulnerability Layer:</span>
            <select id="risk-layer-select">
              <option value="population">Population Density Overlay</option>
              <option value="critical_infra" selected>Critical Infrastructure (Bridges/Hospitals)</option>
              <option value="agriculture">Crop & Farmland Exposure</option>
            </select>
          </div>
        </div>

        <div class="risk-score-overview-bar">
          <div class="risk-score-pill">
            <span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">CURRENT RISK SCORE</span>
            <span class="risk-score-number">${state.aiPrediction.riskScore}/100</span>
            <span class="risk-badge critical">${state.aiPrediction.riskLevel}</span>
          </div>
          <div class="risk-trend-tag">
            <span>Risk Trend:</span>
            <span style="font-size: 13px; color: var(--risk-crit); font-family: var(--font-mono);">${state.aiPrediction.trend}</span>
          </div>
        </div>
      </div>

      <!-- Risk Level Matrix Indicator -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div class="command-card" style="padding: 12px; border-left: 4px solid var(--risk-low); display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 20px;">🟢</div>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--risk-low);">LOW (0 - 39)</div>
            <div style="font-size: 10px; color: var(--text-muted);">Normal operational conditions</div>
          </div>
        </div>

        <div class="command-card" style="padding: 12px; border-left: 4px solid var(--risk-mod); display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 20px;">🟡</div>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--risk-mod);">MODERATE / WATCH (40 - 59)</div>
            <div style="font-size: 10px; color: var(--text-muted);">Enhanced telemetry frequency</div>
          </div>
        </div>

        <div class="command-card" style="padding: 12px; border-left: 4px solid var(--risk-high); display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 20px;">🟠</div>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--risk-high);">HIGH / WARNING (60 - 79)</div>
            <div style="font-size: 10px; color: var(--text-muted);">Early response mobilization</div>
          </div>
        </div>

        <div class="command-card" style="padding: 12px; border-left: 4px solid var(--risk-crit); display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 20px;">🔴</div>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: var(--risk-crit);">CRITICAL (80 - 100)</div>
            <div style="font-size: 10px; color: var(--text-muted);">Immediate evacuation orders</div>
          </div>
        </div>
      </div>

      <!-- Main Risk Map & Affected Zone Summary -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <!-- Dynamic GIS Risk Contour Map -->
        <div class="command-card" style="height: 520px; position: relative;">
          <div id="dynamic-risk-gis-map" class="gis-map-element"></div>
        </div>

        <!-- Affected Zone & Impact Intelligence -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="command-card">
            <div class="command-card-header">
              <div class="command-card-title">
                <span>📍 AFFECTED ZONE SUMMARY</span>
              </div>
              <span class="risk-badge critical">SECTOR C-1</span>
            </div>
            <div class="command-card-body">
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                  <span style="color: var(--text-muted);">Primary Target Area:</span>
                  <span style="font-weight: 700; color: #fff;">District X (Vythiri Basin)</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                  <span style="color: var(--text-muted);">Estimated Affected Area:</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: var(--risk-crit);">4.2 km²</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                  <span style="color: var(--text-muted);">Exposed Population:</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;">14,280 Residents</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                  <span style="color: var(--text-muted);">Critical Assets at Risk:</span>
                  <span style="color: var(--risk-high); font-weight: 600;">Bridge 04, 2 Sub-stations</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-bottom: 6px;">
                  <span style="color: var(--text-muted);">Assigned Evac Shelters:</span>
                  <span style="color: var(--accent-cyan); font-weight: 600;">Shelter SH-01 & SH-02</span>
                </div>
              </div>

              <div style="margin-top: 14px; display: flex; gap: 8px;">
                <button class="btn-primary" style="flex: 1; font-size: 12px;" onclick="window.appStore.setView('incidents')">
                  Issue Evacuation SOP
                </button>
              </div>
            </div>
          </div>

          <!-- Dynamic Hotspot Matrix breakdown -->
          <div class="command-card">
            <div class="command-card-header">
              <div class="command-card-title">
                <span>🔥 HOTSPOT PRIORITY RANKING</span>
              </div>
            </div>
            <div class="command-card-body" style="padding: 10px;">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 12px; border-radius: 6px;">
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 12px;">1. Vythiri River Gorge Pass</div>
                    <div style="font-size: 10px; color: var(--text-muted);">Flood Inundation • Gauge N-003</div>
                  </div>
                  <span class="risk-badge critical">96% RISK</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); padding: 8px 12px; border-radius: 6px;">
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 12px;">2. Bandipur Forest Perimeter</div>
                    <div style="font-size: 10px; color: var(--text-muted);">Timber Flame Spread • Sentinel N-011</div>
                  </div>
                  <span class="risk-badge high">88% RISK</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 8px 12px; border-radius: 6px;">
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 12px;">3. Meppadi Slope Incline</div>
                    <div style="font-size: 10px; color: var(--text-muted);">Landslide Saturation • Inclinometer N-006</div>
                  </div>
                  <span class="risk-badge moderate">74% RISK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

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
