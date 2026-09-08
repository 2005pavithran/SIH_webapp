// Executive Environmental Report Generator Component

import { store } from '../state/store.js';
import { formatDate } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createReportGeneratorView() {
  const container = document.createElement('div');
  container.className = 'report-generator-view animated-fade';

  let selectedRegion = 'District X (Catchment Basin)';
  let selectedHazard = 'All Multi-Hazards';
  let dateRange = '01 Sep – 08 Sep 2026';
  let isReportGenerated = true;

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>📑 EXECUTIVE ENVIRONMENTAL REPORT GENERATOR</span>
            <span class="live-pulse-badge">AUTOMATED AUDIT</span>
          </h1>
          <p>Generate formal situational intelligence briefs for state disaster management authorities, ministry officials, and field command</p>
        </div>
        <div class="view-actions">
          <button class="btn-primary" id="btn-print-report">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <!-- Generator Filter Configuration -->
      <div class="risk-map-control-bar">
        <div class="risk-filters-group">
          <div class="filter-select-item">
            <span>Target Region:</span>
            <select id="rep-region">
              <option value="District X (Catchment Basin)" selected>District X (Catchment Basin)</option>
              <option value="Zone Y (Forest Foothills)">Zone Y (Forest Foothills)</option>
              <option value="Western Ghats Corridor">Western Ghats Corridor</option>
              <option value="All Monitored Regions">All Monitored Regions</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Hazard Scope:</span>
            <select id="rep-hazard">
              <option value="All Multi-Hazards" selected>All Multi-Hazards (Flood, Fire, AQI, Heat)</option>
              <option value="Flood & Inundation Only">Flood & Inundation Only</option>
              <option value="Wildfire Hotspots Only">Wildfire Hotspots Only</option>
              <option value="Air Quality Pollution Only">Air Quality Pollution Only</option>
            </select>
          </div>

          <div class="filter-select-item">
            <span>Audit Period:</span>
            <select id="rep-period">
              <option value="01 Sep – 08 Sep 2026" selected>01 Sep – 08 Sep 2026 (Past 7 Days)</option>
              <option value="01 Aug – 31 Aug 2026">01 Aug – 31 Aug 2026 (Monthly Rollup)</option>
              <option value="Monsoon Season 2026">Monsoon Season 2026 (Quarterly)</option>
            </select>
          </div>
        </div>

        <div>
          <button class="btn-primary" id="btn-generate-trigger">
            ⚡ Generate Intelligence Brief
          </button>
        </div>
      </div>

      <!-- Generated Report Canvas View -->
      <div class="report-paper" id="printable-report-canvas">
        <div class="report-header-band">
          <div>
            <div class="report-org-title">STATE DISASTER MANAGEMENT AUTHORITY (SDMA)</div>
            <div style="font-size: 13px; color: var(--accent-cyan); font-weight: 700; letter-spacing: 0.5px;">
              ENVIRONMENTAL INTELLIGENCE & MULTI-HAZARD EARLY WARNING BRIEF
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
              Document ID: SDMA-EOC-2026-0908-FLD • Classification: OFFICIAL USE ONLY
            </div>
          </div>

          <div style="text-align: right; font-size: 12px; color: var(--text-muted);">
            <div>Generated: <strong>${formatDate()}</strong></div>
            <div>Authorizing Officer: <strong>District Magistrate</strong></div>
          </div>
        </div>

        <div class="report-meta-grid">
          <div>
            <span style="color: var(--text-dim); display: block; font-size: 10px; text-transform: uppercase;">Monitored Region</span>
            <strong id="rep-disp-region">${selectedRegion}</strong>
          </div>
          <div>
            <span style="color: var(--text-dim); display: block; font-size: 10px; text-transform: uppercase;">Assessment Period</span>
            <strong id="rep-disp-period">${dateRange}</strong>
          </div>
          <div>
            <span style="color: var(--text-dim); display: block; font-size: 10px; text-transform: uppercase;">Hazard Profile</span>
            <strong id="rep-disp-hazard">${selectedHazard}</strong>
          </div>
        </div>

        <!-- 5 Key Metric Summary Tiles -->
        <div class="report-stat-summary-boxes">
          <div class="report-stat-box" style="border-top: 3px solid var(--accent-blue);">
            <div class="report-stat-num">23</div>
            <div class="report-stat-label">Total Alerts</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--risk-crit);">
            <div class="report-stat-num" style="color: var(--risk-crit);">4</div>
            <div class="report-stat-label">Critical Incidents</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--risk-high);">
            <div class="report-stat-num" style="color: var(--risk-high);">18</div>
            <div class="report-stat-label">Affected Zones</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid var(--risk-low);">
            <div class="report-stat-num" style="color: var(--risk-low);">${state.kpi.uptime}%</div>
            <div class="report-stat-label">Sensor Uptime</div>
          </div>
          <div class="report-stat-box" style="border-top: 3px solid #a855f7;">
            <div class="report-stat-num" style="color: #c084fc;">7</div>
            <div class="report-stat-label">High-Risk Events</div>
          </div>
        </div>

        <!-- Executive Narrative Summary -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            1. Executive Environmental Situation
          </h3>
          <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
            During the assessment window, high-density precipitation in the upper Chembra catchment triggered acute hydrological surges. Edge hydro-sensors at Gauge <strong>N-003</strong> recorded water levels breaching the 3.20m critical red danger threshold, cresting at 3.84m with +0.45m/hr acceleration. In parallel, secondary thermal flame signatures along Zone Y dry timber corridors necessitated tactical deployment of NDRF Battalion 4 and forestry drone teams. Overall telemetry mesh maintained 96.8% uptime with zero communication blackout across 1,284 nodes.
          </p>
        </div>

        <!-- Incident Audit Log Table -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
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
                    <td><span class="risk-badge ${inc.severity.toLowerCase()}">${inc.severity}</span></td>
                    <td class="table-cell-mono">${inc.affectedArea}</td>
                    <td>${inc.assignedTeam || 'Pending Deployment'}</td>
                    <td><strong>${inc.status}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sign-off Authority Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 18px; margin-top: 24px; font-size: 11px; color: var(--text-dim);">
          <div>
            <div>Authenticated Digital Signature: <code>SHA-256: 8f92a4e17...b7c09</code></div>
            <div>Transmission: Integrated State Disaster Management Authority Mesh</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: #fff;">DISTRICT EMERGENCY OPERATIONS CENTER (EOC)</div>
            <div>Incident Command Division</div>
          </div>
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#btn-generate-trigger').addEventListener('click', () => {
      selectedRegion = container.querySelector('#rep-region').value;
      selectedHazard = container.querySelector('#rep-hazard').value;
      dateRange = container.querySelector('#rep-period').value;

      container.querySelector('#rep-disp-region').textContent = selectedRegion;
      container.querySelector('#rep-disp-hazard').textContent = selectedHazard;
      container.querySelector('#rep-disp-period').textContent = dateRange;

      showToast('Environmental Report successfully compiled.', 'success');
    });

    container.querySelector('#btn-print-report').addEventListener('click', () => {
      window.print();
    });
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
