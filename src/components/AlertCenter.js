// Alert Center View Component

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

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
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>🚨 MULTI-HAZARD ALERT CENTER</span>
            <span class="risk-badge critical">${criticalCount} CRITICAL REQUIRING ACTION</span>
          </h1>
          <p>Real-time early warning dispatches, sensor anomaly triggers, and AI confidence scores</p>
        </div>
        <div class="view-actions">
          <button class="btn-primary" id="btn-broadcast-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Broadcast Regional Warning</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="controls-bar">
        <div class="tab-filter-pills">
          <button class="tab-pill ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
            All Alerts (${state.alerts.length})
          </button>
          <button class="tab-pill ${currentFilter === 'critical' ? 'active' : ''}" data-filter="critical" style="${currentFilter === 'critical' ? 'background: var(--risk-crit); border-color: var(--risk-crit);' : ''}">
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
          <input type="text" id="alert-search-input" placeholder="Search alert title or location...">
        </div>
      </div>

      <!-- Alerts Detailed List -->
      <div style="display: flex; flex-direction: column; gap: 12px;" id="alerts-master-list">
        ${filteredAlerts.map(alert => {
          const riskCls = getRiskClass(alert.severity);
          return `
            <div class="command-card" style="border-left: 5px solid var(--risk-${riskCls === 'critical' ? 'crit' : riskCls === 'high' ? 'high' : riskCls === 'moderate' ? 'mod' : 'low'});">
              <div class="command-card-body" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                <div style="display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 280px;">
                  <div class="hazard-icon-circle" style="font-size: 24px; min-width: 48px; height: 48px;">
                    ${getHazardIcon(alert.hazard)}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                      <span class="risk-badge ${riskCls}">${alert.severity}</span>
                      <span style="font-size: 15px; font-weight: 700; color: #fff;">${alert.title}</span>
                      <span class="ai-confidence-pill">AI Confidence: ${alert.aiConfidence}%</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                      ${alert.description}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 12px; margin-top: 4px;">
                      <span>📍 ${alert.location}</span>
                      <span>•</span>
                      <span>⏱️ Detected: ${alert.timestamp} (${alert.timeAgo})</span>
                      <span>•</span>
                      <span>📡 Trigger Sensor: <strong>${alert.sensorId || 'Mesh Aggregate'}</strong></span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <button class="btn-secondary" onclick="window.appStore.openAlertModal('${alert.id}')">
                    VIEW DETAILS
                  </button>
                  <button class="btn-primary" onclick="window.appStore.setView('incidents')">
                    DISPATCH TEAM
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach Handlers
    container.querySelectorAll('.tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentFilter = pill.getAttribute('data-filter');
        render();
      });
    });

    const searchInp = container.querySelector('#alert-search-input');
    searchInp.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll('#alerts-master-list .command-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });

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
