// Sidebar Navigation Component

import { store } from '../state/store.js';

export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const state = store.getState();

  const navStructure = [
    {
      section: 'DASHBOARD',
      items: [
        { id: 'dashboard', label: 'Overview', icon: '◉', badge: null },
        { id: 'live-map', label: 'Live GIS Map', icon: '🗺️', badge: 'LIVE' }
      ]
    },
    {
      section: 'MONITORING',
      items: [
        { id: 'sensors', label: 'Sensor Network', icon: '📡', badge: '1.2k' },
        { id: 'risk-map', label: 'Dynamic Risk Map', icon: '🔴', badge: '87%' },
        { id: 'ai-prediction', label: 'AI Risk Intelligence', icon: '🤖', badge: 'XAI' },
        { id: 'analytics', label: 'Environmental Analytics', icon: '📈', badge: null }
      ]
    },
    {
      section: 'RESPONSE',
      items: [
        { id: 'alerts', label: 'Alert Center', icon: '🚨', badge: `${state.alerts.length}`, badgeType: 'danger' },
        { id: 'incidents', label: 'Incident Response', icon: '🚑', badge: '#FLD-042', badgeType: 'warning' }
      ]
    },
    {
      section: 'REPORTS',
      items: [
        { id: 'reports', label: 'Executive Reports', icon: '📑', badge: null }
      ]
    },
    {
      section: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Command Settings', icon: '⚙️', badge: null }
      ]
    }
  ];

  function renderNav() {
    const currentState = store.getState();

    let html = '';
    navStructure.forEach(sec => {
      html += `
        <div class="nav-section">
          <div class="nav-section-title">${sec.section}</div>
          ${sec.items.map(item => {
            const isActive = currentState.currentView === item.id;
            let badgeHTML = '';
            if (item.id === 'alerts') {
              badgeHTML = `<span class="nav-badge danger">${currentState.alerts.length}</span>`;
            } else if (item.badge) {
              badgeHTML = `<span class="nav-badge ${item.badgeType || ''}">${item.badge}</span>`;
            }

            return `
              <div class="nav-item ${isActive ? 'active' : ''}" data-view="${item.id}">
                <div class="nav-item-left">
                  <span>${item.icon}</span>
                  <span>${item.label}</span>
                </div>
                ${badgeHTML}
              </div>
            `;
          }).join('')}
        </div>
      `;
    });

    html += `
      <div class="sidebar-footer">
        <div class="telemetry-status-box">
          <div class="telemetry-row">
            <span>EDGE LATENCY</span>
            <span id="sidebar-latency">${currentState.kpi.latencyMs} ms</span>
          </div>
          <div class="telemetry-row" style="margin-top: 4px;">
            <span>INGEST RATE</span>
            <span>2.4k pkt/s</span>
          </div>
          <div class="telemetry-row" style="margin-top: 4px;">
            <span>CAP-INDIA GW</span>
            <span style="color: var(--risk-low);">ONLINE</span>
          </div>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;

    // Reattach click events
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) store.setView(view);
      });
    });
  }

  renderNav();

  store.subscribe((state, event) => {
    if (event === 'view_change' || event === 'new_alert') {
      renderNav();
    } else if (event === 'telemetry_tick') {
      const latEl = sidebar.querySelector('#sidebar-latency');
      if (latEl) latEl.textContent = `${state.kpi.latencyMs} ms`;
    }
  });

  return sidebar;
}
