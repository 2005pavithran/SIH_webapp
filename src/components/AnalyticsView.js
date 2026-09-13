// Unified Analytics & Executive Reports Workspace Component

import { store } from '../state/store.js';
import { formatDate } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createAnalyticsView(initialTab = 'analytics') {
  const container = document.createElement('div');
  container.className = 'analytics-view animated-fade';

  let currentTab = initialTab; // 'analytics' or 'reports'
  let selectedParam = 'water';
  let selectedPeriod = '7d';

  // Reports state
  let selectedReportRegion = 'District X (Catchment Basin)';
  let selectedReportHazard = 'All Multi-Hazards';
  let selectedReportPeriod = '01 Sep – 08 Sep 2026';

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>📊 ENVIRONMENTAL ANALYTICS & EXECUTIVE REPORTS</span>
            <span class="status-badge info">LONG-TERM TELEMETRY</span>
          </h1>
          <p class="view-desc-sub">Multi-temporal environmental trends, predictive vulnerability models, and formal SDMA audit reports</p>
        </div>
      </div>

      <!-- Tab Switcher: Analytics | Reports -->
      <div class="controls-bar" style="margin-bottom: 20px;">
        <div class="tab-filter-pills">
          <button class="tab-pill ${currentTab === 'analytics' ? 'active' : ''}" id="tab-btn-analytics">
            📈 Environmental Analytics
          </button>
          <button class="tab-pill ${currentTab === 'reports' ? 'active' : ''}" id="tab-btn-reports">
            📑 Executive Reports & Briefs
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="analytics-tab-content">
        ${currentTab === 'analytics' ? renderAnalyticsTabHTML() : renderReportsTabHTML(state)}
      </div>
    `;

    // Tab buttons
    container.querySelector('#tab-btn-analytics').addEventListener('click', () => {
      currentTab = 'analytics';
      render();
    });

    container.querySelector('#tab-btn-reports').addEventListener('click', () => {
      currentTab = 'reports';
      render();
    });

    if (currentTab === 'analytics') {
      attachAnalyticsListeners();
    } else {
      attachReportsListeners();
    }
  }

  function renderAnalyticsTabHTML() {
    return `
      <!-- Analytics Filter Bar -->
      <div class="scenario-bar" style="border-left-color: var(--color-primary); margin-bottom: 20px;">
        <div class="scenario-info-text">
          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Catchment:</span>
            <select id="analytics-location" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="all">All Catchment Regions</option>
              <option value="dist_x" selected>District X (Catchment Basin)</option>
              <option value="zone_y">Zone Y (Forest Foothills)</option>
              <option value="dist_z">District Center Z (Metropolitan)</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Telemetry Parameter:</span>
            <select id="analytics-param" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="water" ${selectedParam === 'water' ? 'selected' : ''}>💧 Water Level / Hydro Discharge</option>
              <option value="pm25" ${selectedParam === 'pm25' ? 'selected' : ''}>🌫 PM2.5 / PM10 Air Quality</option>
              <option value="temp" ${selectedParam === 'temp' ? 'selected' : ''}>🌡 Ambient Temperature & Heat Index</option>
              <option value="soil" ${selectedParam === 'soil' ? 'selected' : ''}>🌱 Soil Moisture Saturation</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Audit Period:</span>
            <select id="analytics-period" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="7d" ${selectedPeriod === '7d' ? 'selected' : ''}>Past 7 Days</option>
              <option value="30d" ${selectedPeriod === '30d' ? 'selected' : ''}>Past 30 Days</option>
              <option value="seasonal">Monsoon Baseline</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Analytics Grid -->
      <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Trend Canvas Chart -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span id="chart-main-title">📈 WATER LEVEL TREND (PAST 7 DAYS)</span>
            </div>
            <span class="status-badge critical" id="chart-peak-tag">PEAK: 3.84m (CRITICAL DANGER)</span>
          </div>

          <div class="gov-card-body">
            <div style="height: 260px; position: relative;">
              <canvas id="analytics-trend-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Risk Distribution Breakdown -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🎯 Regional Hazard Distribution</span>
            </div>
            <span class="ai-confidence-pill">MONTHLY TOTAL</span>
          </div>

          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: var(--color-text-primary);">🌊 Flash Flood & Inundation</span>
                <strong style="font-family: var(--font-mono); color: var(--hazard-flood);">62%</strong>
              </div>
              <div style="height: 8px; background: var(--color-surface-muted); border-radius: 4px; overflow: hidden;">
                <div style="width: 62%; height: 100%; background: var(--hazard-flood);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: var(--color-text-primary);">🔥 Wildfire & Forest Thermal Spikes</span>
                <strong style="font-family: var(--font-mono); color: var(--hazard-fire);">24%</strong>
              </div>
              <div style="height: 8px; background: var(--color-surface-muted); border-radius: 4px; overflow: hidden;">
                <div style="width: 24%; height: 100%; background: var(--hazard-fire);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: var(--color-text-primary);">🌫 Air Pollution (PM2.5 / Smog)</span>
                <strong style="font-family: var(--font-mono); color: var(--hazard-air);">9%</strong>
              </div>
              <div style="height: 8px; background: var(--color-surface-muted); border-radius: 4px; overflow: hidden;">
                <div style="width: 9%; height: 100%; background: var(--hazard-air);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span style="font-weight: 600; color: var(--color-text-primary);">🌡 Urban Heat Island Anomaly</span>
                <strong style="font-family: var(--font-mono); color: var(--hazard-heat);">5%</strong>
              </div>
              <div style="height: 8px; background: var(--color-surface-muted); border-radius: 4px; overflow: hidden;">
                <div style="width: 5%; height: 100%; background: var(--hazard-heat);"></div>
              </div>
            </div>

            <div style="margin-top: 10px; padding: 10px; background: var(--color-surface-soft); border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 11px; color: var(--color-text-secondary);">
              📌 <strong>Historical Insight:</strong> Monsoon inundation incidents account for the majority (62%) of authority emergency mobilizations during September.
            </div>
          </div>
        </div>
      </div>

      <!-- Regional Risk Ranking Table -->
      <div class="gov-card">
        <div class="gov-card-header">
          <div class="gov-card-title">
            <span>🏆 Regional Vulnerability Ranking</span>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>District / Basin</th>
                <th>Dominant Threat</th>
                <th>Risk Score</th>
                <th>Exposed Population</th>
                <th>Active Sensors</th>
                <th>Preparedness Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-cell-mono" style="color: var(--color-critical);">#1</td>
                <td><strong>District X (Vythiri Basin)</strong></td>
                <td>🌊 Flash Flood Surge</td>
                <td><span class="status-badge critical">87 / 100</span></td>
                <td class="table-cell-mono">14,280</td>
                <td class="table-cell-mono">428 Nodes</td>
                <td><span class="status-badge success">HIGH</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--hazard-fire);">#2</td>
                <td><strong>Zone Y (Bandipur Timber)</strong></td>
                <td>🔥 Forest Wildfire</td>
                <td><span class="status-badge high">76 / 100</span></td>
                <td class="table-cell-mono">3,400</td>
                <td class="table-cell-mono">312 Nodes</td>
                <td><span class="status-badge moderate">MODERATE</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--color-warning);">#3</td>
                <td><strong>Hill Sector 4 (Meppadi)</strong></td>
                <td>⛰ Landslide Creep</td>
                <td><span class="status-badge moderate">58 / 100</span></td>
                <td class="table-cell-mono">6,800</td>
                <td class="table-cell-mono">245 Nodes</td>
                <td><span class="status-badge moderate">MODERATE</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--color-success);">#4</td>
                <td><strong>District Center Z</strong></td>
                <td>🌫 PM2.5 Inversion</td>
                <td><span class="status-badge low">35 / 100</span></td>
                <td class="table-cell-mono">48,000</td>
                <td class="table-cell-mono">299 Nodes</td>
                <td><span class="status-badge success">HIGH</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderReportsTabHTML(state) {
    return `
      <!-- Generator Config Bar -->
      <div class="scenario-bar" style="border-left-color: var(--color-primary); margin-bottom: 20px;">
        <div class="scenario-info-text">
          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Target Catchment:</span>
            <select id="rep-region" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="District X (Catchment Basin)" selected>District X (Catchment Basin)</option>
              <option value="Zone Y (Forest Foothills)">Zone Y (Forest Foothills)</option>
              <option value="Western Ghats Corridor">Western Ghats Corridor</option>
              <option value="All Monitored Regions">All Monitored Regions</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Hazard Scope:</span>
            <select id="rep-hazard" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="All Multi-Hazards" selected>All Multi-Hazards (Flood, Fire, AQI, Heat)</option>
              <option value="Flood & Inundation Only">Flood & Inundation Only</option>
              <option value="Wildfire Hotspots Only">Wildfire Hotspots Only</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary);">Audit Window:</span>
            <select id="rep-period" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 5px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;">
              <option value="01 Sep – 08 Sep 2026" selected>01 Sep – 08 Sep 2026 (Past 7 Days)</option>
              <option value="01 Aug – 31 Aug 2026">01 Aug – 31 Aug 2026 (Monthly Rollup)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn-primary" id="btn-generate-trigger">
            ⚡ Generate Brief
          </button>
          <button class="btn-secondary" id="btn-print-report">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <!-- Generated Report Canvas (Official SDMA Document) -->
      <div class="report-paper" id="printable-report-canvas">
        <div class="report-header-band">
          <div>
            <div class="report-org-title">STATE DISASTER MANAGEMENT AUTHORITY (SDMA)</div>
            <div class="report-subhead">
              ENVIRONMENTAL INTELLIGENCE & MULTI-HAZARD EARLY WARNING BRIEF
            </div>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              Document ID: SDMA-EOC-2026-0908-FLD • Classification: <strong>OFFICIAL USE ONLY</strong>
            </div>
          </div>

          <div style="text-align: right; font-size: 12px; color: var(--color-text-secondary);">
            <div>Generated: <strong>${formatDate()}</strong></div>
            <div>Authorizing Officer: <strong>District Magistrate (Incident Commander)</strong></div>
          </div>
        </div>

        <div class="report-meta-grid">
          <div>
            <span style="color: var(--color-text-muted); display: block; font-size: 10px; text-transform: uppercase;">Monitored Region</span>
            <strong id="rep-disp-region">${selectedReportRegion}</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted); display: block; font-size: 10px; text-transform: uppercase;">Assessment Period</span>
            <strong id="rep-disp-period">${selectedReportPeriod}</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted); display: block; font-size: 10px; text-transform: uppercase;">Hazard Profile</span>
            <strong id="rep-disp-hazard">${selectedReportHazard}</strong>
          </div>
        </div>

        <!-- 5 Key Metric Summary Tiles -->
        <div class="report-stat-summary-boxes">
          <div class="report-stat-box" style="border-top: 3px solid var(--color-primary);">
            <div class="report-stat-num">23</div>
            <div class="report-stat-label">Total Alerts</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--color-critical);">
            <div class="report-stat-num" style="color: var(--color-critical);">4</div>
            <div class="report-stat-label">Critical Incidents</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--hazard-fire);">
            <div class="report-stat-num" style="color: var(--hazard-fire);">18</div>
            <div class="report-stat-label">Affected Zones</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--color-success);">
            <div class="report-stat-num" style="color: var(--color-success);">${state.kpi.uptime}%</div>
            <div class="report-stat-label">Mesh Uptime</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--hazard-air);">
            <div class="report-stat-num" style="color: var(--hazard-air);">7</div>
            <div class="report-stat-label">High-Risk Events</div>
          </div>
        </div>

        <!-- Executive Narrative Summary -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            1. Executive Environmental Situation
          </h3>
          <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            During the assessment window, high-density precipitation in the upper Chembra catchment triggered acute hydrological surges. Edge hydro-sensors at Gauge <strong>N-003</strong> recorded water levels breaching the 3.20m critical danger threshold, cresting at 3.84m with +0.45m/hr acceleration. In parallel, secondary thermal flame signatures along Zone Y dry timber corridors necessitated tactical deployment of NDRF Battalion 4 and forestry drone teams. Overall telemetry mesh maintained 96.8% uptime with zero communication blackout across 1,284 nodes.
          </p>
        </div>

        <!-- Incident Audit Log Table -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            2. High-Priority Incidents & Tactical Actions
          </h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Hazard</th>
                  <th>Severity</th>
                  <th>Affected Area</th>
                  <th>Assigned Response Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.incidents.map(inc => `
                  <tr>
                    <td class="table-cell-mono">${inc.id}</td>
                    <td>${inc.hazard}</td>
                    <td><span class="status-badge ${inc.severity.toLowerCase()}">${inc.severity}</span></td>
                    <td class="table-cell-mono">${inc.affectedArea}</td>
                    <td><strong>${inc.assignedTeam || 'Pending Deployment'}</strong></td>
                    <td><strong>${inc.status}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sign-off Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid var(--color-border); padding-top: 18px; margin-top: 24px; font-size: 11px; color: var(--color-text-muted);">
          <div>
            <div>Digital Signature: <code>SHA-256: 8f92a4e17...b7c09</code></div>
            <div>Transmission: Integrated State Disaster Management Authority Mesh</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--color-primary-dark);">DISTRICT EMERGENCY OPERATIONS CENTER (EOC)</div>
            <div>Incident Command Division</div>
          </div>
        </div>
      </div>
    `;
  }

  function attachAnalyticsListeners() {
    container.querySelector('#analytics-param')?.addEventListener('change', (e) => {
      selectedParam = e.target.value;
      renderChart();
    });

    container.querySelector('#analytics-period')?.addEventListener('change', (e) => {
      selectedPeriod = e.target.value;
      renderChart();
    });

    setTimeout(() => renderChart(), 50);
  }

  function attachReportsListeners() {
    container.querySelector('#btn-generate-trigger')?.addEventListener('click', () => {
      selectedReportRegion = container.querySelector('#rep-region').value;
      selectedReportHazard = container.querySelector('#rep-hazard').value;
      selectedReportPeriod = container.querySelector('#rep-period').value;

      container.querySelector('#rep-disp-region').textContent = selectedReportRegion;
      container.querySelector('#rep-disp-hazard').textContent = selectedReportHazard;
      container.querySelector('#rep-disp-period').textContent = selectedReportPeriod;

      showToast('Executive Environmental Report generated successfully.', 'success');
    });

    container.querySelector('#btn-print-report')?.addEventListener('click', () => {
      window.print();
    });
  }

  function renderChart() {
    const canvas = container.querySelector('#analytics-trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement.clientWidth;
    const height = 260;
    canvas.width = width;
    canvas.height = height;

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun (Today)'];
    let data = [1.2, 1.4, 2.1, 2.7, 3.2, 3.5, 3.84];
    let unit = 'm';
    let maxVal = 5.0;

    if (selectedParam === 'pm25') {
      data = [42, 58, 76, 110, 145, 172, 184];
      unit = ' µg/m³';
      maxVal = 250;
      container.querySelector('#chart-main-title').textContent = '🌫 PM2.5 PARTICULATE TREND (PAST 7 DAYS)';
      container.querySelector('#chart-peak-tag').textContent = 'PEAK: 184 µg/m³ (SEVERE)';
    } else if (selectedParam === 'temp') {
      data = [28, 30, 33, 37, 41, 43, 44.5];
      unit = '°C';
      maxVal = 50;
      container.querySelector('#chart-main-title').textContent = '🌡 SURFACE TEMPERATURE ANOMALY';
      container.querySelector('#chart-peak-tag').textContent = 'PEAK: 44.5°C (HEATWAVE)';
    } else {
      container.querySelector('#chart-main-title').textContent = '💧 WATER LEVEL TREND (PAST 7 DAYS)';
      container.querySelector('#chart-peak-tag').textContent = 'PEAK: 3.84m (CRITICAL DANGER)';
    }

    const padding = { top: 25, right: 35, bottom: 35, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const getX = (i) => padding.left + (i / (labels.length - 1)) * chartW;
    const getY = (v) => padding.top + chartH - (v / maxVal) * chartH;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#E8EEF3';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#7B8794';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const v = (maxVal / 5) * i;
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${v.toFixed(1)}${unit}`, padding.left - 8, y + 3);
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    grad.addColorStop(0, 'rgba(30, 77, 120, 0.2)');
    grad.addColorStop(1, 'rgba(30, 77, 120, 0.0)');

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
    ctx.fillStyle = grad;
    ctx.fill();

    // Curve line
    ctx.strokeStyle = '#1E4D78';
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

    // Data points & X labels
    ctx.textAlign = 'center';
    data.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      ctx.fillStyle = '#1E4D78';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#17212B';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(labels[i], x, height - 10);
    });
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
