// Top Navigation Bar Component (State Authority Command Center)

import { store } from '../state/store.js';
import { formatTime, formatDate } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createTopNav() {
  const topnav = document.createElement('header');
  topnav.className = 'topnav';

  function render() {
    const state = store.getState();
    const authorizedDistricts = store.getAuthorizedDistricts();
    const stateName = state.loggedInState || 'Tamil Nadu';
    const stateId = state.loggedInStateId || 'TN';
    const officerRole = state.loggedInOfficerRole || 'STATE_AUTHORITY';

    topnav.innerHTML = `
      <div class="topnav-left">
        <button class="sidebar-toggle-btn" id="btn-sidebar-toggle" aria-label="Toggle navigation menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <a href="#dashboard" class="brand-logo" id="brand-logo-btn" title="Go to Command Center">
          <div class="brand-emblem" style="background: linear-gradient(135deg, #1E4D78 0%, #153A5B 100%);">
            🇮🇳
          </div>
          <div class="brand-title-group">
            <span class="brand-title" id="topnav-brand-title">NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
            <span class="brand-subtitle" id="topnav-brand-sub">${stateName.toUpperCase()} STATE DISASTER MANAGEMENT AUTHORITY</span>
          </div>
        </a>

        <div class="live-status-pill" id="topnav-live-pill">
          <span class="live-dot"></span>
          <span id="topnav-live-text">${stateId} LIVE COMMAND</span>
        </div>
      </div>

      <div class="topnav-center">
        <!-- Global Categorized Search Box -->
        <div class="global-search-container">
          <div class="global-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="global-search-input" id="global-search-input" placeholder="Search ${stateName} sensors, alerts, or shelters...">
          </div>
          <div class="search-results-dropdown hidden" id="global-search-results"></div>
        </div>

        <!-- Region / District Selector Scoped to Authorized State -->
        <div class="region-dropdown-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <select class="region-dropdown-select" id="region-dropdown" aria-label="Select Monitored District">
            ${authorizedDistricts.map(r => `<option value="${r.id}" ${r.id === state.selectedRegionId ? 'selected' : ''}>${r.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="topnav-right">
        <!-- Live System Clock -->
        <div class="system-clock-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span id="clock-ticker">${formatDate()} • ${formatTime()}</span>
        </div>

        <!-- Emergency Broadcast Button -->
        <button class="btn-danger" style="padding: 6px 12px; font-size: 12px;" id="btn-emergency-broadcast" title="Trigger Emergency CAP Broadcast">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>BROADCAST</span>
        </button>

        <!-- Audio Siren Toggle -->
        <button class="btn-icon" id="btn-audio-toggle" title="Toggle Acoustic Siren & Alert Audio" aria-label="Toggle Siren Audio">
          <svg id="audio-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>

        <!-- Active Alerts Jump -->
        <button class="btn-icon" id="btn-nav-alerts" title="Active State Alerts" aria-label="View Active Alerts">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="badge-counter" id="topnav-alert-badge">${state.alerts.length}</span>
        </button>

        <!-- Authenticated Officer Profile Widget -->
        <div class="user-profile-widget" id="btn-user-profile" title="Authenticated Authority Session">
          <div class="user-avatar-badge" id="topnav-user-avatar">${stateId}</div>
          <div class="user-meta-text">
            <span class="user-title-name" id="topnav-user-title">${stateName} Command</span>
            <span class="user-role-name" id="topnav-user-role">${officerRole.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <!-- Logout Button -->
        <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px; color: var(--color-critical); border-color: var(--color-critical-border);" id="btn-authority-logout" title="Exit Command Session">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>LOGOUT</span>
        </button>
      </div>
    `;

    attachTopNavEvents();
  }

  function attachTopNavEvents() {
    // Logo click -> Dashboard
    topnav.querySelector('#brand-logo-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#dashboard';
    });

    // Region dropdown change
    topnav.querySelector('#region-dropdown')?.addEventListener('change', (e) => {
      store.setRegion(e.target.value);
      showToast(`District focus set to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });

    // Audio alarm toggle
    topnav.querySelector('#btn-audio-toggle')?.addEventListener('click', () => {
      const isMuted = !store.toggleSound();
      const btn = topnav.querySelector('#btn-audio-toggle');
      if (btn) {
        btn.style.opacity = isMuted ? '0.5' : '1';
      }
      showToast(isMuted ? 'Audio alarms muted.' : 'Acoustic sirens enabled.', isMuted ? 'warning' : 'info');
    });

    // Emergency Broadcast Modal
    topnav.querySelector('#btn-emergency-broadcast')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open_broadcast_modal'));
    });

    // Nav Alerts Jump
    topnav.querySelector('#btn-nav-alerts')?.addEventListener('click', () => {
      window.location.hash = '#alerts';
    });

    // Mobile sidebar toggle
    topnav.querySelector('#btn-sidebar-toggle')?.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('open');
      }
    });

    // Logout Handler
    topnav.querySelector('#btn-authority-logout')?.addEventListener('click', () => {
      store.logoutAuthority();
      showToast('Authority session terminated. Returned to National Portal.', 'info');
      window.location.hash = '#landing';
    });

    // Global Search Autocomplete Logic
    const searchInput = topnav.querySelector('#global-search-input');
    const searchResults = topnav.querySelector('#global-search-results');

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          searchResults.classList.add('hidden');
          searchResults.innerHTML = '';
          return;
        }

        const currentState = store.getState();
        const matchedSensors = currentState.sensors.filter(s => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q));
        const matchedAlerts = currentState.alerts.filter(a => a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.hazard.toLowerCase().includes(q));
        const matchedIncidents = currentState.incidents.filter(i => i.id.toLowerCase().includes(q) || i.title.toLowerCase().includes(q));
        const matchedShelters = currentState.shelters.filter(sh => sh.name.toLowerCase().includes(q));

        let html = '';

        if (matchedSensors.length > 0) {
          html += `<div class="search-group-header">Sensors (${matchedSensors.length})</div>`;
          matchedSensors.slice(0, 3).forEach(s => {
            html += `
              <div class="search-result-item" data-type="sensor" data-id="${s.id}">
                <span>📡 <strong>${s.id}</strong> — ${s.name}</span>
                <span class="status-badge ${s.risk.toLowerCase()}">${s.risk}</span>
              </div>
            `;
          });
        }

        if (matchedAlerts.length > 0) {
          html += `<div class="search-group-header">Alerts (${matchedAlerts.length})</div>`;
          matchedAlerts.slice(0, 3).forEach(a => {
            html += `
              <div class="search-result-item" data-type="alert" data-id="${a.id}">
                <span>🚨 <strong>${a.id}</strong> — ${a.title}</span>
                <span class="status-badge ${a.severity.toLowerCase()}">${a.severity}</span>
              </div>
            `;
          });
        }

        if (matchedIncidents.length > 0) {
          html += `<div class="search-group-header">Incidents (${matchedIncidents.length})</div>`;
          matchedIncidents.slice(0, 3).forEach(inc => {
            html += `
              <div class="search-result-item" data-type="incident" data-id="${inc.id}">
                <span>🚑 <strong>#${inc.id}</strong> — ${inc.title}</span>
                <span class="status-badge critical">${inc.status}</span>
              </div>
            `;
          });
        }

        if (matchedShelters.length > 0) {
          html += `<div class="search-group-header">Shelters (${matchedShelters.length})</div>`;
          matchedShelters.slice(0, 2).forEach(sh => {
            html += `
              <div class="search-result-item" data-type="shelter" data-id="${sh.id}">
                <span>⛺ ${sh.name}</span>
                <span style="font-size: 11px; color: var(--color-text-muted);">Cap: ${sh.capacity}</span>
              </div>
            `;
          });
        }

        if (!html) {
          html = `<div style="padding: 12px; font-size: 12px; color: var(--color-text-muted); text-align: center;">No matches found for "${q}".</div>`;
        }

        searchResults.innerHTML = html;
        searchResults.classList.remove('hidden');

        searchResults.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const id = item.getAttribute('data-id');
            searchResults.classList.add('hidden');
            searchInput.value = '';

            if (type === 'sensor') {
              window.drawerManager?.openSensorDrawer(id);
            } else if (type === 'alert') {
              window.drawerManager?.openAlertDrawer(id);
            } else if (type === 'incident') {
              window.location.hash = '#incidents';
            } else if (type === 'shelter') {
              window.location.hash = '#risk-map';
            }
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.classList.add('hidden');
        }
      });
    }
  }

  // Live Clock Interval
  setInterval(() => {
    const clock = topnav.querySelector('#clock-ticker');
    if (clock) {
      clock.textContent = `${formatDate()} • ${formatTime()}`;
    }
  }, 1000);

  render();

  // Reactive updates
  store.subscribe((state, event) => {
    if (event === 'auth_login' || event === 'auth_logout') {
      render();
    } else if (event === 'new_alert' || event === 'telemetry_tick') {
      const badge = topnav.querySelector('#topnav-alert-badge');
      if (badge) badge.textContent = state.alerts.length;
    }
  });

  return topnav;
}
