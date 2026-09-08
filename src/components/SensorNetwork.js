// Sensor Network Monitoring Component

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';

export function createSensorNetworkView() {
  const container = document.createElement('div');
  container.className = 'sensor-network-view animated-fade';

  let currentTypeFilter = 'all';

  function render() {
    const state = store.getState();

    let filteredSensors = state.sensors;
    if (currentTypeFilter !== 'all') {
      filteredSensors = state.sensors.filter(s => s.type === currentTypeFilter);
    }

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>📡 SENSOR TELEMETRY NETWORK</span>
            <span class="live-pulse-badge">${state.sensors.length} ACTIVE NODES / 1,284 MESH</span>
          </h1>
          <p>IoT edge telemetry nodes measuring river water levels, air quality PM2.5, thermal flame radiance, and soil saturation</p>
        </div>
        <div class="view-actions">
          <button class="btn-secondary" id="btn-export-sensors-csv">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export Raw Telemetry CSV</span>
          </button>
        </div>
      </div>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="tab-filter-pills">
          <button class="tab-pill ${currentTypeFilter === 'all' ? 'active' : ''}" data-type="all">All Sensors (${state.sensors.length})</button>
          <button class="tab-pill ${currentTypeFilter === 'water' ? 'active' : ''}" data-type="water">💧 Hydro Gauges</button>
          <button class="tab-pill ${currentTypeFilter === 'fire' ? 'active' : ''}" data-type="fire">🔥 Flame Sentinels</button>
          <button class="tab-pill ${currentTypeFilter === 'air' ? 'active' : ''}" data-type="air">🌫 Air Quality</button>
          <button class="tab-pill ${currentTypeFilter === 'heat' ? 'active' : ''}" data-type="heat">🌡 Thermal Nodes</button>
        </div>

        <div class="search-input-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="sensor-search-input" placeholder="Search sensor ID or location (e.g. N-003)...">
        </div>
      </div>

      <!-- Sensor Data Table -->
      <div class="table-container">
        <table class="data-table" id="sensor-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sensor Name & Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Risk Level</th>
              <th>Water Level</th>
              <th>Temp</th>
              <th>PM2.5</th>
              <th>Battery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredSensors.map(s => {
              const riskCls = getRiskClass(s.risk);
              return `
                <tr data-sensor-id="${s.id}" onclick="window.appStore.openSensorModal('${s.id}')">
                  <td class="table-cell-mono">${s.id}</td>
                  <td>
                    <div style="font-weight: 600; color: #fff;">${s.name}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${s.location}</div>
                  </td>
                  <td>
                    <span style="font-size: 14px;">${getHazardIcon(s.type)}</span>
                    <span style="font-size: 11px; text-transform: capitalize;">${s.type}</span>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${s.status === 'Online' ? 'var(--risk-low)' : 'var(--risk-high)'}; font-weight: 600;">
                      <span class="pulse-dot ${s.status === 'Online' ? '' : 'crit'}" style="width: 6px; height: 6px;"></span>
                      ${s.status}
                    </span>
                  </td>
                  <td>
                    <span class="risk-badge ${riskCls}">${s.risk}</span>
                  </td>
                  <td class="table-cell-mono" style="color: ${s.waterLevel > 3.2 ? 'var(--risk-crit)' : '#fff'};">
                    ${s.waterLevel ? s.waterLevel + ' m' : '—'}
                  </td>
                  <td class="table-cell-mono">${s.temp}°C</td>
                  <td class="table-cell-mono" style="color: ${s.pm25 > 150 ? 'var(--risk-high)' : '#fff'};">${s.pm25} µg/m³</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; width: 45px; overflow: hidden;">
                        <div style="width: ${s.battery}%; height: 100%; background: ${s.battery < 50 ? 'var(--risk-crit)' : 'var(--risk-low)'};"></div>
                      </div>
                      <span style="font-size: 11px; font-family: var(--font-mono);">${s.battery}%</span>
                    </div>
                  </td>
                  <td>
                    <button class="btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="event.stopPropagation(); window.appStore.openSensorModal('${s.id}')">
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

    // Handlers
    container.querySelectorAll('.tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentTypeFilter = pill.getAttribute('data-type');
        render();
      });
    });

    const searchInp = container.querySelector('#sensor-search-input');
    searchInp.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll('#sensor-data-table tbody tr').forEach(row => {
        const txt = row.textContent.toLowerCase();
        row.style.display = txt.includes(q) ? '' : 'none';
      });
    });

    container.querySelector('#btn-export-sensors-csv').addEventListener('click', () => {
      exportSensorsCSV();
    });
  }

  function exportSensorsCSV() {
    const state = store.getState();
    let csv = 'Sensor ID,Name,Location,Type,Status,Risk,Water Level (m),Temp (C),PM2.5 (ug/m3),Battery (%)\n';
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
      // Refresh cell values smoothly
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
