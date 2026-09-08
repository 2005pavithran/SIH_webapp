// Environmental Analytics View Component

import { store } from '../state/store.js';

export function createAnalyticsView() {
  const container = document.createElement('div');
  container.className = 'analytics-view animated-fade';

  let selectedParam = 'water';
  let selectedPeriod = '7d';

  function render() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>📈 ENVIRONMENTAL INTELLIGENCE ANALYTICS</span>
            <span class="live-pulse-badge">LONG-TERM TELEMETRY</span>
          </h1>
          <p>Multi-temporal environmental trends, predictive distribution models, and seasonal vulnerability indices</p>
        </div>
        <div class="view-actions">
          <button class="btn-secondary" onclick="window.appStore.setView('reports')">
            <span>Generate PDF Summary</span>
          </button>
        </div>
      </div>

      <!-- Controls Filter Bar -->
      <div class="risk-map-control-bar">
        <div class="risk-filters-group">
          <div class="filter-select-item">
            <span>Location:</span>
            <select id="analytics-location">
              <option value="all">All Catchment Regions</option>
              <option value="dist_x" selected>District X (Catchment Basin)</option>
              <option value="zone_y">Zone Y (Forest Foothills)</option>
              <option value="dist_z">District Center Z (Metropolitan)</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Parameter:</span>
            <select id="analytics-param">
              <option value="water" ${selectedParam === 'water' ? 'selected' : ''}>💧 Water Level / Hydro Discharge</option>
              <option value="pm25" ${selectedParam === 'pm25' ? 'selected' : ''}>🌫 PM2.5 / PM10 Air Quality</option>
              <option value="temp" ${selectedParam === 'temp' ? 'selected' : ''}>🌡 Ambient Temperature & Heat Index</option>
              <option value="soil" ${selectedParam === 'soil' ? 'selected' : ''}>🌱 Soil Moisture Saturation</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Time Period:</span>
            <select id="analytics-period">
              <option value="7d" ${selectedPeriod === '7d' ? 'selected' : ''}>Past 7 Days</option>
              <option value="30d" ${selectedPeriod === '30d' ? 'selected' : ''}>Past 30 Days</option>
              <option value="seasonal">Seasonal Monsoon Baseline</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Analytics Grid -->
      <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Trend Canvas Chart -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span id="chart-main-title">📈 WATER LEVEL TREND (PAST 7 DAYS)</span>
            </div>
            <span class="risk-badge critical" id="chart-peak-tag">PEAK: 3.84m (CRITICAL DANGER)</span>
          </div>

          <div class="command-card-body">
            <div style="height: 260px; position: relative;">
              <canvas id="analytics-trend-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Risk Distribution Breakdown -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🎯 REGIONAL HAZARD DISTRIBUTION</span>
            </div>
            <span class="ai-confidence-pill">MONTHLY TOTAL</span>
          </div>

          <div class="command-card-body">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="font-weight: 600; color: #fff;">🌊 Flash Flood & Inundation</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan);">62%</span>
                </div>
                <div class="factor-bar-bg" style="height: 10px;">
                  <div class="factor-bar-fill crit" style="width: 62%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="font-weight: 600; color: #fff;">🔥 Wildfire & Forest Heat Spikes</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: var(--risk-high);">24%</span>
                </div>
                <div class="factor-bar-bg" style="height: 10px;">
                  <div class="factor-bar-fill" style="width: 24%; background: #f97316;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="font-weight: 600; color: #fff;">🌫 Air Pollution (PM2.5 / Smog)</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: #a855f7;">9%</span>
                </div>
                <div class="factor-bar-bg" style="height: 10px;">
                  <div class="factor-bar-fill" style="width: 9%; background: #a855f7;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span style="font-weight: 600; color: #fff;">🌡 Urban Heat Island Anomaly</span>
                  <span style="font-family: var(--font-mono); font-weight: 700; color: var(--risk-mod);">5%</span>
                </div>
                <div class="factor-bar-bg" style="height: 10px;">
                  <div class="factor-bar-fill" style="width: 5%; background: #f59e0b;"></div>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 11px; color: var(--text-muted);">
              📌 <strong>Historical Insight:</strong> Monsoon inundation incidents account for the vast majority (62%) of authority emergency mobilizations during September.
            </div>
          </div>
        </div>
      </div>

      <!-- District Risk Ranking Table -->
      <div class="command-card">
        <div class="command-card-header">
          <div class="command-card-title">
            <span>🏆 REGIONAL VULNERABILITY RANKING</span>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>District / Basin</th>
                <th>Dominant Hazard</th>
                <th>Current Risk Score</th>
                <th>Exposed Population</th>
                <th>Active Sensors</th>
                <th>Preparedness Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-cell-mono" style="color: var(--risk-crit);">#1</td>
                <td><strong>District X (Vythiri Basin)</strong></td>
                <td>🌊 Flash Flood Surge</td>
                <td><span class="risk-badge critical">87 / 100</span></td>
                <td class="table-cell-mono">14,280</td>
                <td class="table-cell-mono">428 Nodes</td>
                <td><span class="risk-badge" style="background: rgba(16,185,129,0.15); color: var(--risk-low);">HIGH</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--risk-high);">#2</td>
                <td><strong>Zone Y (Bandipur Timber)</strong></td>
                <td>🔥 Forest Wildfire</td>
                <td><span class="risk-badge high">76 / 100</span></td>
                <td class="table-cell-mono">3,400</td>
                <td class="table-cell-mono">312 Nodes</td>
                <td><span class="risk-badge moderate">MODERATE</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--risk-mod);">#3</td>
                <td><strong>Hill Sector 4 (Meppadi)</strong></td>
                <td>⛰ Landslide Creep</td>
                <td><span class="risk-badge moderate">58 / 100</span></td>
                <td class="table-cell-mono">6,800</td>
                <td class="table-cell-mono">245 Nodes</td>
                <td><span class="risk-badge moderate">MODERATE</span></td>
              </tr>
              <tr>
                <td class="table-cell-mono" style="color: var(--risk-low);">#4</td>
                <td><strong>District Center Z</strong></td>
                <td>🌫 PM2.5 Inversion</td>
                <td><span class="risk-badge low">35 / 100</span></td>
                <td class="table-cell-mono">48,000</td>
                <td class="table-cell-mono">299 Nodes</td>
                <td><span class="risk-badge" style="background: rgba(16,185,129,0.15); color: var(--risk-low);">HIGH</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#analytics-param').addEventListener('change', (e) => {
      selectedParam = e.target.value;
      renderChart();
    });

    container.querySelector('#analytics-period').addEventListener('change', (e) => {
      selectedPeriod = e.target.value;
      renderChart();
    });

    setTimeout(() => renderChart(), 50);
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

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono';
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
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

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

    // Stroke
    ctx.strokeStyle = '#06b6d4';
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
    data.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter';
      ctx.fillText(labels[i], x, height - 10);
    });
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
