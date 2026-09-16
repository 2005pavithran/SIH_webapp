// Dashboard View Component (State Authority Command Center)

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { simulationEngine } from '../state/simulation.js';
import { getRiskClass } from '../utils/formatters.js';
import { createAnnouncementBanner } from './AnnouncementBanner.js';

export function createDashboardView() {
  const container = document.createElement('div');
  container.className = 'dashboard-view animated-fade';

  let gisInstance = null;

  function render() {
    const state = store.getState();
    const stateName = state.loggedInState || 'Tamil Nadu';
    const stateConfig = store.getAuthorizedStateConfig();

    container.innerHTML = `
      <!-- Container for announcement banner -->
      <div id="dashboard-banner-slot"></div>

      <!-- Simulation Scenario Control Bar -->
      <div class="scenario-bar">
        <div class="scenario-info-text">
          <span class="scenario-tag">SIH EVALUATION MODE</span>
          <span>Inject live multi-hazard early warning scenarios for ${stateName}:</span>
        </div>
        <div class="scenario-btn-group">
          ${state.loggedInStateId === 'TN' ? `
            <button class="btn-scenario ${state.activeScenario === 'avinashi_flood' ? 'active' : ''}" id="demo-avinashi-btn" title="Simulate Coimbatore cloudburst causing downstream flood in Avinashi">
              🌊 Coimbatore → Avinashi Surge
            </button>
          ` : ''}
          <button class="btn-scenario ${state.activeScenario === 'flood' ? 'active' : ''}" id="demo-flood-btn">
            🌊 Flash Flood Surge
          </button>
          <button class="btn-scenario ${state.activeScenario === 'fire' ? 'active' : ''}" id="demo-fire-btn">
            🔥 Forest Fire Thermal Spikes
          </button>
          <button class="btn-scenario ${state.activeScenario === 'baseline' ? 'active' : ''}" id="demo-reset-btn">
            🔄 Reset Baseline
          </button>
        </div>
      </div>

      <!-- View Header -->
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>${stateName.toUpperCase()} ENVIRONMENTAL COMMAND CENTER</span>
            <span class="status-badge success">OPERATIONAL • ${state.kpi.uptime}% UPTIME</span>
          </h1>
          <p class="view-desc-sub">
            Real-time telemetry, AI predictive risk trajectories, and field deployment status across ${stateConfig.districts.length} monitored sectors in ${stateName}
          </p>
        </div>
        <div class="view-actions-group">
          <button class="btn-secondary" id="btn-export-brief">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Situation Brief</span>
          </button>
          <button class="btn-primary" id="btn-create-incident">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Log Incident</span>
          </button>
        </div>
      </div>

      <!-- Quick Access Action Pills -->
      <div class="quick-access-bar">
        <span style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Quick Actions:</span>
        <button class="quick-action-pill" onclick="window.location.hash = '#risk-map'">🗺️ State Risk Map</button>
        <button class="quick-action-pill" onclick="window.location.hash = '#alerts'">🚨 Review ${state.alerts.length} Alerts</button>
        <button class="quick-action-pill" onclick="window.drawerManager?.openAIDrawer('${state.aiPrediction?.hazard || 'Flood'}')">🤖 AI Prediction Model</button>
        <button class="quick-action-pill" onclick="window.location.hash = '#analytics'">📊 Environmental Analytics</button>
        <button class="quick-action-pill" onclick="window.drawerManager?.openStaffDrawer()">🛡️ Tactical Radio Directory</button>
      </div>

      <!-- 4 Compact KPI Metric Cards (State Scoped) -->
      <div class="dashboard-kpi-grid">
        <div class="kpi-card" id="kpi-sensors-card" title="Click to view full sensor telemetry table">
          <div class="kpi-card-top">
            <span class="kpi-label">📡 STATE SENSOR MESH</span>
            <div class="kpi-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><circle cx="12" cy="12" r="2"></circle><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"></path></svg>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-numeric-val" id="kpi-sensors-val">${state.kpi.totalSensors.toLocaleString()}</span>
            <span class="kpi-delta-tag positive">Active Nodes</span>
          </div>
          <div class="kpi-subtext">${state.kpi.onlineSensors.toLocaleString()} Online Telemetry Channels in ${stateName}</div>
        </div>

        <div class="kpi-card" id="kpi-alerts-card" title="Click to view alert center">
          <div class="kpi-card-top">
            <span class="kpi-label">🚨 ACTIVE STATE ALERTS</span>
            <div class="kpi-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-numeric-val" id="kpi-alerts-val">${state.alerts.length}</span>
            <span class="kpi-delta-tag warning">${state.alerts.filter(a => a.severity === 'Critical').length} Critical</span>
          </div>
          <div class="kpi-subtext">${state.alerts.filter(a => a.severity === 'Critical').length} Critical • ${state.alerts.filter(a => a.severity === 'Warning').length} Warning</div>
        </div>

        <div class="kpi-card" id="kpi-crit-card" title="Click to view incidents">
          <div class="kpi-card-top">
            <span class="kpi-label">🔴 EMERGENCY MISSIONS</span>
            <div class="kpi-icon-wrap" style="color: var(--color-critical);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-numeric-val" style="color: var(--color-critical);" id="kpi-crit-val">${state.kpi.criticalIncidents < 10 ? '0' + state.kpi.criticalIncidents : state.kpi.criticalIncidents}</span>
            <span class="kpi-delta-tag critical">Action Active</span>
          </div>
          <div class="kpi-subtext">SOP Response Executing via SDRF</div>
        </div>

        <div class="kpi-card" id="kpi-uptime-card" title="Click to view system settings">
          <div class="kpi-card-top">
            <span class="kpi-label">🛡️ EDGE MESH LATENCY</span>
            <div class="kpi-icon-wrap" style="color: var(--color-success);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-numeric-val" id="kpi-uptime-val">${state.kpi.latencyMs} ms</span>
            <span class="kpi-delta-tag positive">Synchronized</span>
          </div>
          <div class="kpi-subtext">${stateConfig.code} Telemetry Stream Active</div>
        </div>
      </div>

      <!-- Main Command Grid: Live GIS Map + Active Alerts Feed -->
      <div class="dashboard-main-grid">
        <!-- Live Map Card -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🗺️ ${stateName} Situational GIS Map</span>
              <span class="status-badge success" style="font-size: 10px;">REAL-TIME</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="btn-fullscreen-map">
              <span>Full Screen</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </button>
          </div>

          <div style="height: 440px; position: relative;">
            <!-- Map Floating Controls -->
            <div class="map-floating-controls">
              <div class="map-search-box">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="map-search-input" placeholder="Search node, hazard or district in ${stateName}...">
              </div>

              <div class="map-control-actions">
                <div class="map-basemap-select-wrap">
                  <select id="map-basemap-select" title="Change Base Map Layer">
                    <option value="osm" selected>🗺️ Street Map</option>
                    <option value="cartoLight">🏙️ Carto Light</option>
                    <option value="satellite">🛰️ Satellite</option>
                    <option value="topo">⛰️ Topographic</option>
                  </select>
                </div>

                <div class="map-layer-pills">
                  <button class="layer-btn flood ${state.mapLayers.flood ? 'active' : ''}" data-layer="flood">🌊 Flood</button>
                  <button class="layer-btn fire ${state.mapLayers.fire ? 'active' : ''}" data-layer="fire">🔥 Fire</button>
                  <button class="layer-btn air ${state.mapLayers.air ? 'active' : ''}" data-layer="air">🌫 Air</button>
                  <button class="layer-btn ${state.mapLayers.sensors ? 'active' : ''}" data-layer="sensors">📡 Nodes</button>
                  <button class="layer-btn ${state.mapLayers.teams ? 'active' : ''}" data-layer="teams">🚑 Teams</button>
                </div>
              </div>
            </div>

            <!-- Leaflet Container -->
            <div id="dashboard-gis-map" class="gis-map-element"></div>

            <!-- Map Legend -->
            <div class="map-legend-overlay">
              <div class="legend-title">${stateName} Risk Severity</div>
              <div class="legend-items">
                <div class="legend-item"><div class="legend-dot low"></div> Low</div>
                <div class="legend-item"><div class="legend-dot mod"></div> Moderate</div>
                <div class="legend-item"><div class="legend-dot high"></div> High</div>
                <div class="legend-item"><div class="legend-dot crit"></div> Critical</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Alerts Feed Card -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🚨 Active Alerts in ${stateName}</span>
              <span class="status-badge critical" style="font-size: 11px;">${state.alerts.length} OPEN</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="btn-view-all-alerts">
              <span>View All</span>
            </button>
          </div>

          <div class="gov-card-body" style="padding: 14px;">
            <div class="alerts-feed-scroller" id="dashboard-alerts-feed">
              ${state.alerts.length === 0 ? `
                <div style="padding: 24px; text-align: center; color: var(--color-text-muted); font-size: 13px;">
                  No active alerts currently reported for ${stateName}.
                </div>
              ` : state.alerts.map(alert => {
                const riskCls = getRiskClass(alert.severity);
                return `
                  <div class="alert-card-item ${riskCls}" data-alert-id="${alert.id}">
                    <div class="alert-card-body">
                      <div class="alert-card-header">
                        <span class="status-badge ${riskCls}">${alert.severity}</span>
                        <span class="alert-card-title">${alert.hazard} Event</span>
                        <span class="ai-confidence-pill">AI ${alert.aiConfidence}%</span>
                      </div>
                      <div style="font-size: 12px; color: var(--color-text-primary); font-weight: 600;">${alert.title}</div>
                      <div class="alert-card-meta">
                        <span>📍 ${alert.location}</span>
                        <span>•</span>
                        <span>⏱️ ${alert.timeAgo}</span>
                      </div>
                    </div>
                    <div class="alert-card-actions">
                      <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="window.drawerManager?.openAlertDrawer('${alert.id}')">
                        DETAILS
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Grid: Hydro-Meteorological Trend + Recent Emergency Incidents -->
      <div class="dashboard-bottom-grid">
        <!-- Hydro-Meteorological Trend Chart Card -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📈 ${stateName} Hydro-Meteorological Trend</span>
            </div>
            <span class="status-badge critical" style="font-size: 11px;">DANGER THRESHOLD: 3.20m</span>
          </div>

          <div class="gov-card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px;">
              <span style="color: var(--color-text-secondary);">${stateConfig.primaryThreat}</span>
              <strong style="color: var(--color-critical); font-family: var(--font-mono);">Real-Time Flow Telemetry</strong>
            </div>
            <div style="height: 190px; position: relative;">
              <canvas id="dashboard-trend-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Emergency Incidents Card -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🚑 Emergency Incidents & Tactical SOP</span>
            </div>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="window.location.hash = '#incidents'">
              <span>View SOPs</span>
            </button>
          </div>

          <div class="gov-card-body" style="padding: 14px;">
            <div class="incidents-mini-list">
              ${state.incidents.length === 0 ? `
                <div style="padding: 24px; text-align: center; color: var(--color-text-muted); font-size: 13px;">
                  No active emergency incidents currently logged for ${stateName}.
                </div>
              ` : state.incidents.map(inc => {
                const completedCount = inc.sop.filter(s => s.done).length;
                const totalCount = inc.sop.length;
                const percent = Math.round((completedCount / totalCount) * 100);

                return `
                  <div class="incident-mini-card">
                    <div class="incident-mini-left">
                      <div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span class="incident-mini-id">#${inc.id}</span>
                          <span class="status-badge ${getRiskClass(inc.severity)}">${inc.severity}</span>
                          <span class="incident-mini-title">${inc.title}</span>
                        </div>
                        <div class="incident-mini-sub">
                          <span>${inc.location} • Assigned: <strong>${inc.assignedTeam || 'Pending'}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 11px; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono);">${completedCount}/${totalCount} SOP (${percent}%)</div>
                      <button class="btn-secondary" style="padding: 3px 8px; font-size: 11px; margin-top: 4px;" onclick="window.location.hash = '#incidents'">
                        Manage
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Announcement Banner in Slot
    const bannerSlot = container.querySelector('#dashboard-banner-slot');
    if (bannerSlot) {
      const banner = createAnnouncementBanner();
      bannerSlot.appendChild(banner);
    }

    // Attach Event Handlers
    attachEventListeners();

    // Initialize Map & Trend Chart
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
    // Scenario buttons
    container.querySelector('#demo-avinashi-btn')?.addEventListener('click', () => {
      simulationEngine.triggerAvinashiFloodScenario();
    });

    container.querySelector('#demo-flood-btn')?.addEventListener('click', () => {
      simulationEngine.triggerFlashFloodScenario();
    });

    container.querySelector('#demo-fire-btn')?.addEventListener('click', () => {
      simulationEngine.triggerWildfireScenario();
    });

    container.querySelector('#demo-reset-btn')?.addEventListener('click', () => {
      simulationEngine.resetBaselineScenario();
    });

    // KPI Clicks
    container.querySelector('#kpi-sensors-card')?.addEventListener('click', () => { window.location.hash = '#sensors'; });
    container.querySelector('#kpi-alerts-card')?.addEventListener('click', () => { window.location.hash = '#alerts'; });
    container.querySelector('#kpi-crit-card')?.addEventListener('click', () => { window.location.hash = '#incidents'; });
    container.querySelector('#kpi-uptime-card')?.addEventListener('click', () => { window.location.hash = '#settings'; });

    // Navigation jumps
    container.querySelector('#btn-view-all-alerts')?.addEventListener('click', () => { window.location.hash = '#alerts'; });
    container.querySelector('#btn-fullscreen-map')?.addEventListener('click', () => { window.location.hash = '#risk-map'; });
    container.querySelector('#btn-export-brief')?.addEventListener('click', () => { window.location.hash = '#reports'; });
    container.querySelector('#btn-create-incident')?.addEventListener('click', () => { window.location.hash = '#incidents'; });

    // Map layer buttons
    container.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        store.toggleLayer(layerKey);
        btn.classList.toggle('active', store.getState().mapLayers[layerKey]);
        if (gisInstance) gisInstance.refresh();
      });
    });

    // Map search input
    const searchInput = container.querySelector('#map-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;
        const matchedSensor = store.getState().sensors.find(s => 
          s.id.toLowerCase().includes(query) || s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
        );
        if (matchedSensor && gisInstance) {
          gisInstance.flyTo([matchedSensor.lat, matchedSensor.lng], 14);
        }
      });
    }

    // Basemap select change
    const basemapSelect = container.querySelector('#map-basemap-select');
    if (basemapSelect) {
      basemapSelect.addEventListener('change', (e) => {
        if (gisInstance) {
          gisInstance.setBasemap(e.target.value);
        }
      });
    }
  }

  function initTrendChart() {
    const canvas = container.querySelector('#dashboard-trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement.clientWidth;
    const height = 190;
    canvas.width = width;
    canvas.height = height;

    const labels = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00 (Now)', '21:00 (FC)', '22:00 (FC)'];
    const data = [1.2, 1.4, 1.8, 2.3, 2.9, 3.4, 3.84, 4.12, 4.35];
    const threshold = 3.2;

    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = 5.0;
    const minVal = 0.0;

    const getX = (i) => padding.left + (i / (labels.length - 1)) * chartW;
    const getY = (v) => padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

    ctx.clearRect(0, 0, width, height);

    // Grid lines & Y labels
    ctx.strokeStyle = '#E8EEF3';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#7B8794';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';

    [1, 2, 3, 4, 5].forEach(v => {
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${v}m`, padding.left - 8, y + 3);
    });

    // Danger Threshold Line (3.2m)
    const dangerY = getY(threshold);
    ctx.strokeStyle = '#B42318';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, dangerY);
    ctx.lineTo(width - padding.right, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#B42318';
    ctx.fillText('DANGER (3.2m)', width - padding.right, dangerY - 6);

    // Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(180, 35, 24, 0.15)');
    gradient.addColorStop(0.6, 'rgba(30, 77, 120, 0.08)');
    gradient.addColorStop(1, 'rgba(30, 77, 120, 0.0)');

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

    // Curve Line
    ctx.strokeStyle = '#B42318';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      const xc = (getX(i) + getX(i - 1)) / 2;
      const yc = (getY(data[i]) + getY(data[i - 1])) / 2;
      ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1]), xc, yc);
    }
    ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
    ctx.stroke();

    // Points & X labels
    ctx.textAlign = 'center';
    data.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);

      ctx.fillStyle = val >= threshold ? '#B42318' : '#1E4D78';
      ctx.beginPath();
      ctx.arc(x, y, i === 6 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = i === 6 ? '#17212B' : '#7B8794';
      ctx.font = i === 6 ? 'bold 10px Inter' : '10px Inter';
      ctx.fillText(labels[i], x, height - 10);
    });
  }

  const onResizeChart = () => {
    initTrendChart();
  };
  window.addEventListener('resize', onResizeChart);

  render();

  // Reactive store updates
  const unsubscribe = store.subscribe((state, event) => {
    if (event === 'telemetry_tick' || event === 'new_alert' || event === 'sop_update' || event === 'auth_login') {
      const kpiSensors = container.querySelector('#kpi-sensors-val');
      const kpiAlerts = container.querySelector('#kpi-alerts-val');
      const kpiCrit = container.querySelector('#kpi-crit-val');
      const kpiUptime = container.querySelector('#kpi-uptime-val');

      if (kpiSensors) kpiSensors.textContent = state.kpi.totalSensors.toLocaleString();
      if (kpiAlerts) kpiAlerts.textContent = state.alerts.length;
      if (kpiCrit) kpiCrit.textContent = state.kpi.criticalIncidents < 10 ? '0' + state.kpi.criticalIncidents : state.kpi.criticalIncidents;
      if (kpiUptime) kpiUptime.textContent = `${state.kpi.latencyMs} ms`;

      if (gisInstance) gisInstance.refresh();
    }
  });

  return {
    element: container,
    destroy: () => {
      window.removeEventListener('resize', onResizeChart);
      if (gisInstance) gisInstance.destroy();
      unsubscribe();
    }
  };
}
