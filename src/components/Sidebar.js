// Sidebar Navigation Component (State Authority Command Center)

import { store } from '../state/store.js';

export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const navStructure = [
    {
      section: 'COMMAND',
      items: [
        {
          id: 'dashboard',
          hash: '#dashboard',
          label: 'Command Center',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
          badge: null
        },
        {
          id: 'landing',
          hash: '#landing',
          label: '← National Portal',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 12 8"></polygon><line x1="16" y1="12" x2="8" y2="12"></line></svg>`,
          badge: 'ALL-INDIA'
        }
      ]
    },
    {
      section: 'MONITOR',
      items: [
        {
          id: 'risk-map',
          hash: '#risk-map',
          label: 'Risk Map',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
          badge: 'GIS'
        },
        {
          id: 'dynamic-risk',
          hash: '#dynamic-risk',
          label: 'Dynamic Risk',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>`,
          badge: 'CONTOURS'
        },
        {
          id: 'sensors',
          hash: '#sensors',
          label: 'Sensors',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"></path></svg>`,
          badge: 'MESH'
        }
      ]
    },
    {
      section: 'RESPOND',
      items: [
        {
          id: 'alerts',
          hash: '#alerts',
          label: 'Alerts',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
          badge: 'alerts-count',
          badgeClass: 'crit'
        },
        {
          id: 'incidents',
          hash: '#incidents',
          label: 'Incidents & SOP',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`,
          badge: 'SOP',
          badgeClass: 'neutral'
        }
      ]
    },
    {
      section: 'ANALYZE',
      items: [
        {
          id: 'ai-prediction',
          hash: '#ai-prediction',
          label: 'AI Predictions',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
          badge: 'XAI'
        },
        {
          id: 'analytics',
          hash: '#analytics',
          label: 'Analytics',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
          badge: null
        },
        {
          id: 'reports',
          hash: '#reports',
          label: 'Executive Reports',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
          badge: 'PDF'
        }
      ]
    },
    {
      section: 'STAFF & OPERATIONS',
      items: [
        {
          id: 'staff-services',
          hash: '#staff-services',
          label: 'Staff Services',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
          badge: 'RADIO'
        }
      ]
    },
    {
      section: 'SYSTEM',
      items: [
        {
          id: 'settings',
          hash: '#settings',
          label: 'Settings',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
          badge: null
        }
      ]
    }
  ];

  function renderNav() {
    const currentState = store.getState();

    let html = '';
    navStructure.forEach(sec => {
      html += `
        <div class="nav-group">
          <div class="nav-group-label">${sec.section}</div>
          ${sec.items.map(item => {
            const isActive = currentState.currentView === item.id;
            let badgeHTML = '';
            if (item.badge === 'alerts-count') {
              badgeHTML = `<span class="nav-badge-pill crit">${currentState.alerts.length}</span>`;
            } else if (item.badge) {
              badgeHTML = `<span class="nav-badge-pill ${item.badgeClass || 'neutral'}">${item.badge}</span>`;
            }

            return `
              <button class="nav-item-btn ${isActive ? 'active' : ''}" data-hash="${item.hash}" data-view="${item.id}" aria-label="${item.label}">
                <div class="nav-item-left">
                  <span class="nav-item-icon">${item.icon}</span>
                  <span>${item.label}</span>
                </div>
                ${badgeHTML}
              </button>
            `;
          }).join('')}
        </div>
      `;
    });

    html += `
      <div class="sidebar-footer-box">
        <div class="sidebar-service-card">
          <div class="sidebar-service-row">
            <span>EDGE LATENCY</span>
            <strong id="sidebar-latency">${currentState.kpi.latencyMs} ms</strong>
          </div>
          <div class="sidebar-service-row" style="margin-top: 4px;">
            <span>INGEST RATE</span>
            <strong>2.4k pkt/s</strong>
          </div>
          <div class="sidebar-service-row" style="margin-top: 4px;">
            <span>CAP-INDIA GW</span>
            <strong style="color: var(--color-success);">ONLINE</strong>
          </div>
        </div>
      </div>
    `;

    sidebar.innerHTML = html;

    // Attach click events
    sidebar.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hash = btn.getAttribute('data-hash');
        if (hash) {
          window.location.hash = hash;
          sidebar.classList.remove('open');
        }
      });
    });
  }

  renderNav();

  store.subscribe((state, event) => {
    if (event === 'view_change' || event === 'new_alert' || event === 'auth_login' || event === 'auth_logout') {
      renderNav();
    } else if (event === 'telemetry_tick') {
      const latEl = sidebar.querySelector('#sidebar-latency');
      if (latEl) latEl.textContent = `${state.kpi.latencyMs} ms`;
    }
  });

  return sidebar;
}
