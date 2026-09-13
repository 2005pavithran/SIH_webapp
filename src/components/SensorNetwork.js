// Sensor Network Monitoring Component (Bright Government Standard)

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon, getHazardTagClass } from '../utils/formatters.js';

export function createSensorNetworkView() {
  const container = document.createElement('div');
  container.className = 'sensor-network-view animated-fade';

  let currentTypeFilter = 'all';
  let currentHealthFilter = 'all';

  function formatTimeAgo(isoString) {
    if (!isoString) return 'Recent';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hr ago`;
  }

  function render() {
    const state = store.getState();

    let filteredSensors = state.sensors;
    if (currentTypeFilter !== 'all') {
      filteredSensors = filteredSensors.filter(s => s.type === currentTypeFilter);
    }
    if (currentHealthFilter !== 'all') {
      filteredSensors = filteredSensors.filter(s => s.health === currentHealthFilter);
    }

    // Health counts across all sensors
    const healthCounts = {
      Active: state.sensors.filter(s => s.health === 'Active').length,
      Maintenance: state.sensors.filter(s => s.health === 'Maintenance Required').length,
      Damaged: state.sensors.filter(s => s.health === 'Damaged').length,
      Inactive: state.sensors.filter(s => s.health === 'Inactive').length
    };

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>📡 SENSOR HEALTH & TELEMETRY NETWORK</span>
            <span class="status-badge success">${healthCounts.Active} ACTIVE / ${state.sensors.length} SENSORS</span>
          </h1>
          <p class="view-desc-sub">Operational reliability monitoring of IoT edge mesh, LoRaWAN transceivers, battery degradation, and telemetry polling integrity</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-secondary" id="btn-export-sensors-csv">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- Government Notice on Sensor Health vs Disaster Risk Distinction -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid var(--color-info); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 18px; display: flex; align-items: center; gap: 12px; font-size: 12px;">
        <span style="font-size: 18px;">ℹ️</span>
        <div>
          <strong style="color: var(--color-primary-dark);">OPERATIONAL CLARIFICATION FOR AUTHORITY USERS:</strong>
          <span style="color: var(--color-text-secondary); margin-left: 4px;">
            <strong>Sensor Health</strong> represents <em>monitoring and data reliability</em> (battery voltage, signal SNR, and hardware transceiver condition). It is strictly independent of <strong>Environmental Hazard Risk</strong> (flood depth, flame radiance, or pollution severity).
          </span>
        </div>
      </div>

      <!-- 4 Sensor Health Status Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;">
        <div class="gov-card" style="padding: 14px 18px; border-top: 3px solid var(--color-success);">
          <div class="kpi-label" style="color: var(--color-success);">🟢 ACTIVE (HEALTHY)</div>
          <div class="kpi-numeric-val" style="font-size: 26px; color: var(--color-success);">${healthCounts.Active}</div>
          <div class="kpi-subtext">Nominal telemetry stream & battery &gt; 50%</div>
        </div>

        <div class="gov-card" style="padding: 14px 18px; border-top: 3px solid var(--color-warning);">
          <div class="kpi-label" style="color: var(--color-warning);">🟡 MAINTENANCE REQUIRED</div>
          <div class="kpi-numeric-val" style="font-size: 26px; color: var(--color-warning);">${healthCounts.Maintenance}</div>
          <div class="kpi-subtext">Low battery (&lt; 40%) or high signal jitter</div>
        </div>

        <div class="gov-card" style="padding: 14px 18px; border-top: 3px solid var(--color-critical);">
          <div class="kpi-label" style="color: var(--color-critical);">🔴 DAMAGED / CRITICAL</div>
          <div class="kpi-numeric-val" style="font-size: 26px; color: var(--color-critical);">${healthCounts.Damaged}</div>
          <div class="kpi-subtext">Transducer fault or battery depleted</div>
        </div>

        <div class="gov-card" style="padding: 14px 18px; border-top: 3px solid var(--color-text-muted);">
          <div class="kpi-label" style="color: var(--color-text-muted);">⚪ INACTIVE / DECOMMISSIONED</div>
          <div class="kpi-numeric-val" style="font-size: 26px; color: var(--color-text-muted);">${healthCounts.Inactive}</div>
          <div class="kpi-subtext">Standby node or off-season offline</div>
        </div>
      </div>

      <!-- Controls & Multi-Level Filtering Bar -->
      <div class="controls-bar" style="flex-direction: column; align-items: stretch; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <!-- Sensor Health Filters -->
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Filter by Health:</span>
            <button class="tab-pill health-pill ${currentHealthFilter === 'all' ? 'active' : ''}" data-health="all">All (${state.sensors.length})</button>
            <button class="tab-pill health-pill ${currentHealthFilter === 'Active' ? 'active' : ''}" data-health="Active">🟢 Active (${healthCounts.Active})</button>
            <button class="tab-pill health-pill ${currentHealthFilter === 'Maintenance Required' ? 'active' : ''}" data-health="Maintenance Required">🟡 Maintenance Required (${healthCounts.Maintenance})</button>
            <button class="tab-pill health-pill ${currentHealthFilter === 'Damaged' ? 'active' : ''}" data-health="Damaged">🔴 Damaged (${healthCounts.Damaged})</button>
            <button class="tab-pill health-pill ${currentHealthFilter === 'Inactive' ? 'active' : ''}" data-health="Inactive">⚪ Inactive (${healthCounts.Inactive})</button>
          </div>

          <div class="search-input-wrap" style="width: 280px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="sensor-search-input" placeholder="Search ID, location, or health...">
          </div>
        </div>

        <!-- Sensor Type Filters -->
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; border-top: 1px solid var(--color-border-subtle); padding-top: 8px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">Filter by Type:</span>
          <button class="tab-pill type-pill ${currentTypeFilter === 'all' ? 'active' : ''}" data-type="all">All Types</button>
          <button class="tab-pill type-pill ${currentTypeFilter === 'water' ? 'active' : ''}" data-type="water">💧 Hydro Gauges</button>
          <button class="tab-pill type-pill ${currentTypeFilter === 'fire' ? 'active' : ''}" data-type="fire">🔥 Flame Sentinels</button>
          <button class="tab-pill type-pill ${currentTypeFilter === 'air' ? 'active' : ''}" data-type="air">🌫 Air Quality</button>
          <button class="tab-pill type-pill ${currentTypeFilter === 'heat' ? 'active' : ''}" data-type="heat">🌡 Thermal Nodes</button>
        </div>
      </div>

      <!-- Sensor Data Table -->
      <div class="table-container">
        <table class="data-table" id="sensor-data-table">
          <thead>
            <tr>
              <th>Node ID</th>
              <th>Sensor Location & Name</th>
              <th>Sensor Type</th>
              <th>Connection Status</th>
              <th>Health (Reliability)</th>
              <th>Last Received Data</th>
              <th>Environmental Readings</th>
              <th>Hazard Risk (Disaster)</th>
              <th>Battery & Signal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredSensors.map(s => {
              const riskCls = getRiskClass(s.risk);
              const hazardTag = getHazardTagClass(s.type);

              // Sensor Health Badge
              let healthBadgeCls = 'success';
              let healthIcon = '🟢';
              if (s.health === 'Maintenance Required') {
                healthBadgeCls = 'warning';
                healthIcon = '🟡';
              } else if (s.health === 'Damaged') {
                healthBadgeCls = 'critical';
                healthIcon = '🔴';
              } else if (s.health === 'Inactive') {
                healthBadgeCls = 'neutral';
                healthIcon = '⚪';
              }

              return `
                <tr data-sensor-id="${s.id}" onclick="window.drawerManager.openSensorDrawer('${s.id}')">
                  <td class="table-cell-mono"><strong>${s.id}</strong></td>
                  <td>
                    <div style="font-weight: 600; color: var(--color-text-primary);">${s.location}</div>
                    <div style="font-size: 11px; color: var(--color-text-muted);">${s.name}</div>
                  </td>
                  <td>
                    <span class="hazard-tag ${hazardTag}">
                      ${s.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${s.status === 'Online' ? 'var(--color-success)' : s.status === 'Degraded' ? 'var(--color-warning)' : 'var(--color-text-muted)'}; font-weight: 600;">
                      <span class="live-dot" style="background-color: ${s.status === 'Online' ? 'var(--color-success)' : s.status === 'Degraded' ? 'var(--color-warning)' : 'var(--color-text-muted)'};"></span>
                      ${s.status}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge ${healthBadgeCls}" style="font-weight: 700;">
                      ${healthIcon} ${s.health}
                    </span>
                  </td>
                  <td>
                    <span class="table-cell-mono" style="font-size: 11px; color: var(--color-text-secondary);">
                      ⏱️ ${formatTimeAgo(s.lastDataTime)}
                    </span>
                  </td>
                  <td>
                    <div style="font-size: 12px; font-family: var(--font-mono);">
                      ${s.waterLevel ? `💧 ${s.waterLevel}m ` : ''}
                      ${s.temp ? `🌡️ ${s.temp}°C ` : ''}
                      ${s.pm25 ? `🌫 ${s.pm25}µg ` : ''}
                    </div>
                  </td>
                  <td>
                    <span class="status-badge ${riskCls}">${s.risk}</span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div style="flex: 1; height: 6px; background: var(--color-surface-muted); border-radius: 3px; width: 44px; overflow: hidden;">
                        <div style="width: ${s.battery}%; height: 100%; background: ${s.battery < 25 ? 'var(--color-critical)' : s.battery < 50 ? 'var(--color-warning)' : 'var(--color-success)'};"></div>
                      </div>
                      <span style="font-size: 11px; font-family: var(--font-mono);">${s.battery}%</span>
                    </div>
                    <div style="font-size: 10px; color: var(--color-text-muted); font-family: var(--font-mono);">${s.signal} dBm</div>
                  </td>
                  <td>
                    <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="event.stopPropagation(); window.drawerManager.openSensorDrawer('${s.id}')">
                      Diagnostics
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Health filter pills
    container.querySelectorAll('.health-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentHealthFilter = pill.getAttribute('data-health');
        render();
      });
    });

    // Type filter pills
    container.querySelectorAll('.type-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentTypeFilter = pill.getAttribute('data-type');
        render();
      });
    });

    // Search input
    const searchInp = container.querySelector('#sensor-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        container.querySelectorAll('#sensor-data-table tbody tr').forEach(row => {
          const txt = row.textContent.toLowerCase();
          row.style.display = txt.includes(q) ? '' : 'none';
        });
      });
    }

    container.querySelector('#btn-export-sensors-csv').addEventListener('click', exportSensorsCSV);
  }

  function exportSensorsCSV() {
    const state = store.getState();
    let csv = 'Sensor ID,Name,Location,Hazard Type,Status,Risk,Water Level (m),Temp (C),PM2.5 (ug/m3),Battery (%)\n';
    state.sensors.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.location}","${s.type}","${s.status}","${s.risk}",${s.waterLevel || 0},${s.temp},${s.pm25},${s.battery}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environmental_sensors_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  render();

  store.subscribe((state, event) => {
    if (event === 'telemetry_tick') {
      state.sensors.forEach(s => {
        const row = container.querySelector(`tr[data-sensor-id="${s.id}"]`);
        if (row) {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 8) {
            if (s.waterLevel) cells[5].textContent = `${s.waterLevel} m`;
            cells[6].textContent = `${s.temp}°C`;
            cells[7].textContent = `${s.pm25} µg/m³`;
          }
        }
      });
    }
  });

  return {
    element: container,
    destroy: () => {}
  };
}
