// Dashboard View Component (Primary Command Center Demo Screen)

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { simulationEngine } from '../state/simulation.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';

export function createDashboardView() {
  const container = document.createElement('div');
  container.className = 'dashboard-view animated-fade';

  let gisInstance = null;

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <!-- Simulation & Demo Control Bar -->
      <div class="scenario-bar">
        <div class="scenario-info">
          <span class="scenario-badge">SIH DEMO MODE</span>
          <span>Test live multi-hazard early warning & response workflows:</span>
        </div>
        <div class="scenario-actions">
          <button class="btn-scenario ${state.activeScenario === 'flood' ? 'active' : ''}" id="demo-flood-btn">
            🌊 Trigger Flash Flood Surge
          </button>
          <button class="btn-scenario ${state.activeScenario === 'fire' ? 'active' : ''}" id="demo-fire-btn">
            🔥 Trigger Forest Fire Outbreak
          </button>
          <button class="btn-scenario ${state.activeScenario === 'baseline' ? 'active' : ''}" id="demo-reset-btn">
            🔄 Reset to Nominal Baseline
          </button>
        </div>
      </div>

      <!-- View Header -->
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>GOOD EVENING, AUTHORITY</span>
            <span class="risk-badge critical" style="font-size: 12px; margin-left: 8px;">MONITORING ACTIVE</span>
          </h1>
          <p>Real-time multi-hazard environmental situation across monitored regions and catchment basins</p>
        </div>
        <div class="view-actions">
          <button class="btn-secondary" id="btn-export-brief">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export Situation Brief</span>
          </button>
          <button class="btn-primary" id="btn-create-incident">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Log Emergency Incident</span>
          </button>
        </div>
      </div>

      <!-- Top Statistics 4-Card Grid -->
      <div class="dashboard-kpi-grid">
        <div class="kpi-card success" style="cursor: pointer;" id="kpi-sensors-card">
          <div class="kpi-header">
            <span class="kpi-title">📡 SENSORS</span>
            <div class="kpi-icon">📶</div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" id="kpi-sensors-val">${state.kpi.totalSensors.toLocaleString()}</span>
            <span class="kpi-delta positive">98.4% Health</span>
          </div>
          <div class="kpi-subtitle">${state.kpi.onlineSensors.toLocaleString()} Online • 29 Degraded • 12 Offline</div>
        </div>

        <div class="kpi-card warning" style="cursor: pointer;" id="kpi-alerts-card">
          <div class="kpi-header">
            <span class="kpi-title">🚨 ALERTS</span>
            <div class="kpi-icon">⚡</div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" id="kpi-alerts-val">${state.alerts.length}</span>
            <span class="kpi-delta negative">+3 past hr</span>
          </div>
          <div class="kpi-subtitle">${state.alerts.filter(a => a.severity === 'Critical').length} Critical • ${state.alerts.filter(a => a.severity === 'Warning').length} Warning</div>
        </div>

        <div class="kpi-card crit" style="cursor: pointer;" id="kpi-crit-card">
          <div class="kpi-header">
            <span class="kpi-title">🔴 CRITICAL</span>
            <div class="kpi-icon">⚠️</div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" id="kpi-crit-val">${state.kpi.criticalIncidents < 10 ? '0' + state.kpi.criticalIncidents : state.kpi.criticalIncidents}</span>
            <span class="kpi-delta negative">Immediate Action</span>
          </div>
          <div class="kpi-subtitle">Flash Flood #FLD-042 & Fire #FIR-019</div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" id="kpi-uptime-card">
          <div class="kpi-header">
            <span class="kpi-title">🟢 SYSTEM</span>
            <div class="kpi-icon">🛡️</div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" id="kpi-uptime-val">${state.kpi.uptime}%</span>
            <span class="kpi-delta positive">Telemetry Latency ${state.kpi.latencyMs}ms</span>
          </div>
          <div class="kpi-subtitle">Fault-tolerant edge mesh active</div>
        </div>
      </div>

      <!-- Main Command Grid: Live GIS Map + Active Alerts -->
      <div class="dashboard-main-grid">
        <!-- Live GIS Map Card -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🗺️ LIVE GIS SITUATIONAL MAP</span>
              <span class="live-pulse-badge" style="padding: 2px 8px; font-size: 10px;">REAL-TIME</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="btn-fullscreen-map">
              <span>Full Screen Map</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
              </svg>
            </button>
          </div>

          <div style="height: 440px; position: relative;">
            <!-- Map Floating Toolbar -->
            <div class="map-floating-controls">
              <div class="map-search-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="map-search-input" placeholder="Search location, hazard or node...">
              </div>

              <div class="map-layer-pills">
                <button class="layer-btn fire ${state.mapLayers.fire ? 'active' : ''}" data-layer="fire">🔥 Fire</button>
                <button class="layer-btn flood ${state.mapLayers.flood ? 'active' : ''}" data-layer="flood">🌊 Flood</button>
                <button class="layer-btn air ${state.mapLayers.air ? 'active' : ''}" data-layer="air">🌫 Air</button>
                <button class="layer-btn heat ${state.mapLayers.heat ? 'active' : ''}" data-layer="heat">🌡 Heat</button>
                <button class="layer-btn water ${state.mapLayers.sensors ? 'active' : ''}" data-layer="sensors">💧 Nodes</button>
                <button class="layer-btn ${state.mapLayers.teams ? 'active' : ''}" data-layer="teams">🚑 Teams</button>
              </div>
            </div>

            <!-- Leaflet Container -->
            <div id="dashboard-gis-map" class="gis-map-element"></div>

            <!-- Map Legend -->
            <div class="map-legend-overlay">
              <div class="legend-title">Risk Levels</div>
              <div class="legend-items">
                <div class="legend-item"><div class="legend-dot low"></div> Low</div>
                <div class="legend-item"><div class="legend-dot mod"></div> Moderate</div>
                <div class="legend-item"><div class="legend-dot high"></div> High</div>
                <div class="legend-item"><div class="legend-dot crit"></div> Critical</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alerts Feed Card -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🚨 ACTIVE ALERTS</span>
              <span class="risk-badge critical" style="font-size: 11px;">${state.alerts.length} OPEN</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="btn-view-all-alerts">
              <span>View all alerts</span>
            </button>
          </div>

          <div class="command-card-body">
            <div class="alerts-list-container" id="dashboard-alerts-feed">
              ${state.alerts.map(alert => {
                const riskCls = getRiskClass(alert.severity);
                return `
                  <div class="alert-feed-item ${riskCls}" data-alert-id="${alert.id}">
                    <div class="alert-feed-content">
                      <div class="alert-feed-header">
                        <span class="risk-badge ${riskCls}">${alert.severity}</span>
                        <span class="alert-feed-title">${getHazardIcon(alert.hazard)} ${alert.hazard} Risk</span>
                        <span class="ai-confidence-pill">AI ${alert.aiConfidence}%</span>
                      </div>
                      <div style="font-size: 12px; color: #f1f5f9; font-weight: 500;">${alert.title}</div>
                      <div class="alert-feed-meta">
                        <span>${alert.location}</span>
                        <span>•</span>
                        <span>${alert.timeAgo}</span>
                      </div>
                    </div>
                    <div class="alert-feed-action">
                      <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="window.appStore.openAlertModal('${alert.id}')">
                        VIEW
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Command Grid: Risk Trend & AI Prediction Widget -->
      <div class="dashboard-bottom-grid">
        <!-- Risk Trend Visualization Card -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>📈 HYDRO-METEOROLOGICAL RISK TREND</span>
              <span class="risk-trend-tag">↗ Accelerating Inflow</span>
            </div>
            <div class="filter-select-item">
              <select id="trend-timeframe">
                <option value="24h">Past 24 Hours</option>
                <option value="7d">Past 7 Days</option>
              </select>
            </div>
          </div>

          <div class="command-card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 12px;">
              <div style="color: var(--text-muted);">Gorge Catchment Water Level vs Red Danger Level (3.2m)</div>
              <div style="font-family: var(--font-mono); color: var(--risk-crit); font-weight: 700;">Peak Runoff: 3.84m (CRITICAL)</div>
            </div>
            <div style="height: 180px; position: relative;">
              <canvas id="dashboard-trend-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- AI Risk Intelligence & Explainability Card -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🤖 AI RISK INTELLIGENCE & XAI</span>
              <span class="ai-confidence-pill">DEEP SHAP</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="btn-deep-ai-view">
              <span>Explain Model</span>
            </button>
          </div>

          <div class="command-card-body">
            <div class="ai-prediction-card">
              <div class="ai-hero-box">
                <div class="ai-hero-hazard">
                  <div class="hazard-icon-circle">🌊</div>
                  <div>
                    <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Target Threat</div>
                    <div style="font-size: 16px; font-weight: 800; color: #fff;">${state.aiPrediction.hazard} Hazard</div>
                  </div>
                </div>

                <div class="ai-risk-score-display">
                  <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Confidence Index</div>
                  <div class="ai-risk-percent">${state.aiPrediction.riskScore}%</div>
                  <span class="risk-badge ${getRiskClass(state.aiPrediction.riskLevel)}" style="font-size: 10px; padding: 2px 6px;">
                    ${state.aiPrediction.riskLevel}
                  </span>
                </div>
              </div>

              <div class="ai-prediction-summary">
                <span>🔮</span>
                <div>${state.aiPrediction.predictionText}</div>
              </div>

              <div class="attribution-factors">
                <div style="font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px;">
                  Explainable AI Factor Attribution (Weights):
                </div>
                ${state.aiPrediction.factors.map(factor => `
                  <div class="factor-item">
                    <div class="factor-meta">
                      <span class="factor-name">${factor.name}</span>
                      <span class="factor-val">${factor.value} (${factor.weight}%)</span>
                    </div>
                    <div class="factor-bar-bg">
                      <div class="factor-bar-fill ${factor.impact === 'critical' ? 'crit' : ''}" style="width: ${factor.weight * 2.5}%;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Handlers
    attachEventListeners();

    // Initialize Leaflet Map
    setTimeout(() => {
      const mapEl = container.querySelector('#dashboard-gis-map');
      if (mapEl) {
        gisInstance = createGISMap('dashboard-gis-map', { isCompact: true });
        gisInstance.init(mapEl);
      }
      initTrendChart();
    }, 50);
  }

  function attachEventListeners() {
    // Demo Scenario Injector buttons
    container.querySelector('#demo-flood-btn').addEventListener('click', () => {
      simulationEngine.triggerFlashFloodScenario();
    });

    container.querySelector('#demo-fire-btn').addEventListener('click', () => {
      simulationEngine.triggerWildfireScenario();
    });

    container.querySelector('#demo-reset-btn').addEventListener('click', () => {
      simulationEngine.resetBaselineScenario();
    });

    // KPI Card Click jumps
    container.querySelector('#kpi-sensors-card').addEventListener('click', () => store.setView('sensors'));
    container.querySelector('#kpi-alerts-card').addEventListener('click', () => store.setView('alerts'));
    container.querySelector('#kpi-crit-card').addEventListener('click', () => store.setView('incidents'));
    container.querySelector('#kpi-uptime-card').addEventListener('click', () => store.setView('settings'));

    // Navigation jumps
    container.querySelector('#btn-view-all-alerts').addEventListener('click', () => store.setView('alerts'));
    container.querySelector('#btn-fullscreen-map').addEventListener('click', () => store.setView('live-map'));
    container.querySelector('#btn-deep-ai-view').addEventListener('click', () => store.setView('ai-prediction'));
    container.querySelector('#btn-export-brief').addEventListener('click', () => store.setView('reports'));
    container.querySelector('#btn-create-incident').addEventListener('click', () => store.setView('incidents'));

    // Map Layer Toggles
    container.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        store.toggleLayer(layerKey);
        btn.classList.toggle('active', store.getState().mapLayers[layerKey]);
        if (gisInstance) gisInstance.refresh();
      });
    });

    // Map Search
    const searchInput = container.querySelector('#map-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;
        const matchedSensor = store.getState().sensors.find(s => 
          s.id.toLowerCase().includes(query) || s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
        );
        if (matchedSensor && gisInstance) {
          gisInstance.flyTo([matchedSensor.lat, matchedSensor.lng], 15);
        }
      });
    }
  }

  function initTrendChart() {
    const canvas = container.querySelector('#dashboard-trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw clean custom HTML5 Canvas Chart with glowing line
    const width = canvas.parentElement.clientWidth;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    const labels = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00 (Now)', '21:00 (FC)', '22:00 (FC)'];
    const data = [1.2, 1.4, 1.8, 2.3, 2.9, 3.4, 3.84, 4.12, 4.35];
    const threshold = 3.2; // Red danger level

    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = 5.0;
    const minVal = 0.0;

    const getX = (index) => padding.left + (index / (labels.length - 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    ctx.clearRect(0, 0, width, height);

    // Grid lines & Y labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'right';

    [1, 2, 3, 4, 5].forEach(v => {
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${v}m`, padding.left - 8, y + 3);
    });

    // Danger threshold line (3.2m)
    const dangerY = getY(threshold);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, dangerY);
    ctx.lineTo(width - padding.right, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('DANGER (3.2m)', width - padding.right, dangerY - 6);

    // Gradient area fill under curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
    gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      const xc = (getX(i) + getX(i - 1)) / 2;
      const yc = (getY(data[i]) + getY(data[i - 1])) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1]), xc, yc);
    }
    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
    ctx.lineTo(getX(data.length - 1), height - padding.bottom);
    ctx.lineTo(getX(0), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line curve stroke
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      const xc = (getX(i) + getX(i - 1)) / 2;
      const yc = (getY(data[i]) + getY(data[i - 1])) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1]), xc, yc);
    }
    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
    ctx.stroke();

    // Data points & X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';

    data.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);

      ctx.fillStyle = val >= threshold ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, i >= 6 ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // X Label
      ctx.fillStyle = i === 6 ? '#f8fafc' : '#64748b';
      ctx.font = i === 6 ? 'bold 10px Inter' : '10px Inter';
      ctx.fillText(labels[i], x, height - 10);
    });
  }

  render();

  // Listen to store updates
  store.subscribe((state, event) => {
    if (event === 'telemetry_tick' || event === 'new_alert' || event === 'sop_update') {
      const kpiSensors = container.querySelector('#kpi-sensors-val');
      const kpiAlerts = container.querySelector('#kpi-alerts-val');
      const kpiCrit = container.querySelector('#kpi-crit-val');
      const kpiUptime = container.querySelector('#kpi-uptime-val');

      if (kpiSensors) kpiSensors.textContent = state.kpi.totalSensors.toLocaleString();
      if (kpiAlerts) kpiAlerts.textContent = state.alerts.length;
      if (kpiCrit) kpiCrit.textContent = state.kpi.criticalIncidents < 10 ? '0' + state.kpi.criticalIncidents : state.kpi.criticalIncidents;
      if (kpiUptime) kpiUptime.textContent = `${state.kpi.uptime}%`;

      if (gisInstance) gisInstance.refresh();
    }
  });

  return {
    element: container,
    destroy: () => {
      if (gisInstance) gisInstance.destroy();
    }
  };
}
