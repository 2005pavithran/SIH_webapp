// Alert Center View Component (Bright Government Standard)

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon, getHazardTagClass } from '../utils/formatters.js';

export function createAlertCenter() {
  const container = document.createElement('div');
  container.className = 'alerts-view animated-fade';

  let currentFilter = 'all'; // all, critical, warning, watch

  function render() {
    const state = store.getState();

    let filteredAlerts = state.alerts;
    if (currentFilter === 'critical') {
      filteredAlerts = state.alerts.filter(a => a.severity === 'Critical');
    } else if (currentFilter === 'warning') {
      filteredAlerts = state.alerts.filter(a => a.severity === 'Warning');
    } else if (currentFilter === 'watch') {
      filteredAlerts = state.alerts.filter(a => a.severity === 'Watch');
    }

    const criticalCount = state.alerts.filter(a => a.severity === 'Critical').length;
    const warningCount = state.alerts.filter(a => a.severity === 'Warning').length;
    const watchCount = state.alerts.filter(a => a.severity === 'Watch').length;

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🚨 MULTI-HAZARD ALERT CENTER</span>
            <span class="status-badge critical">${criticalCount} CRITICAL REQUIRING ATTENTION</span>
          </h1>
          <p class="view-desc-sub">Real-time early warning dispatches, sensor anomaly triggers, and AI confidence scores across monitored districts</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-danger" id="btn-broadcast-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Broadcast Warning</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="controls-bar">
        <div class="tab-filter-pills">
          <button class="tab-pill ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
            All Alerts (${state.alerts.length})
          </button>
          <button class="tab-pill ${currentFilter === 'critical' ? 'active' : ''}" data-filter="critical" style="${currentFilter === 'critical' ? 'background: var(--color-critical-light); border-color: var(--color-critical-border); color: var(--color-critical);' : ''}">
            🔴 Critical (${criticalCount})
          </button>
          <button class="tab-pill ${currentFilter === 'warning' ? 'active' : ''}" data-filter="warning">
            🟠 Warning (${warningCount})
          </button>
          <button class="tab-pill ${currentFilter === 'watch' ? 'active' : ''}" data-filter="watch">
            🟡 Watch (${watchCount})
          </button>
        </div>

        <div class="search-input-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="alert-search-input" placeholder="Search alert title or district...">
        </div>
      </div>

      <!-- Alerts List -->
      <div style="display: flex; flex-direction: column; gap: 12px;" id="alerts-master-list">
        ${filteredAlerts.length === 0 ? `
          <div class="empty-state-box gov-card">
            <div style="font-size: 32px;">✅</div>
            <div class="empty-state-title">No Alerts in this Category</div>
            <p style="font-size: 13px; color: var(--color-text-muted);">All monitored catchment zones are operating within safe seasonal thresholds.</p>
          </div>
        ` : filteredAlerts.map(alert => {
          const riskCls = getRiskClass(alert.severity);
          const hazardTag = getHazardTagClass(alert.hazard);

          return `
            <div class="gov-card interactive" style="border-left: 5px solid ${alert.severity === 'Critical' ? 'var(--color-critical)' : alert.severity === 'Warning' ? 'var(--color-warning)' : 'var(--color-info)'};">
              <div class="gov-card-body" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                <div style="display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 280px;">
                  <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-surface-soft); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--color-primary);">
                    ${alert.hazard.includes('Flood') ? '🌊' : alert.hazard.includes('Fire') ? '🔥' : alert.hazard.includes('Air') ? '🌫' : '⚠️'}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span class="status-badge ${riskCls}">${alert.severity}</span>
                      <span class="hazard-tag ${hazardTag}">${alert.hazard}</span>
                      <span style="font-size: 15px; font-weight: 700; color: var(--color-text-primary);">${alert.title}</span>
                      <span class="ai-confidence-pill">AI Confidence: ${alert.aiConfidence}%</span>
                    </div>
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
                      ${alert.description}
                    </div>
                    <div style="font-size: 11px; color: var(--color-text-muted); display: flex; align-items: center; gap: 12px; margin-top: 4px;">
                      <span>📍 ${alert.location}</span>
                      <span>•</span>
                      <span>⏱️ Detected: ${alert.timestamp} (${alert.timeAgo})</span>
                      <span>•</span>
                      <span>📡 Sensor Node: <strong>${alert.sensorId || 'Mesh Aggregate'}</strong></span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn-secondary" onclick="window.drawerManager.openAlertDrawer('${alert.id}')">
                    VIEW DETAILS
                  </button>
                  <button class="btn-primary" onclick="window.appStore.setView('incidents')">
                    DISPATCH UNIT
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Filter pills
    container.querySelectorAll('.tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentFilter = pill.getAttribute('data-filter');
        render();
      });
    });

    // Search filter
    const searchInp = container.querySelector('#alert-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        container.querySelectorAll('#alerts-master-list .gov-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(q) ? 'block' : 'none';
        });
      });
    }

    container.querySelector('#btn-broadcast-all').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open_broadcast_modal'));
    });
  }

  render();

  store.subscribe((state, event) => {
    if (event === 'new_alert') {
      render();
    }
  });

  return {
    element: container,
    destroy: () => {}
  };
}
