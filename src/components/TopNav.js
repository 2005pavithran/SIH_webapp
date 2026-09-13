// Top Navigation Bar Component (Government Digital Service Standard)

import { store } from '../state/store.js';
import { formatTime, formatDate } from '../utils/formatters.js';
import { REGIONS } from '../utils/mockData.js';
import { showToast } from './ToastNotification.js';

export function createTopNav() {
  const topnav = document.createElement('header');
  topnav.className = 'topnav';

  const state = store.getState();

  topnav.innerHTML = `
    <div class="topnav-left">
      <button class="sidebar-toggle-btn" id="btn-sidebar-toggle" aria-label="Toggle navigation menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <a href="#" class="brand-logo" id="brand-logo-btn" title="Go to Command Center">
        <div class="brand-emblem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="brand-title-group">
          <span class="brand-title" id="topnav-brand-title">${state.uiMode === 'PUBLIC' ? 'CITIZEN DISASTER ADVISORY' : 'ENVIRONMENTAL INTELLIGENCE'}</span>
          <span class="brand-subtitle" id="topnav-brand-sub">${state.uiMode === 'PUBLIC' ? 'PUBLIC EARLY WARNING & SAFETY PORTAL' : 'STATE DISASTER MANAGEMENT AUTHORITY'}</span>
        </div>
      </a>

      <div class="live-status-pill" id="topnav-live-pill">
        <span class="live-dot"></span>
        <span id="topnav-live-text">${state.uiMode === 'PUBLIC' ? 'ACTIVE ADVISORY' : 'LIVE COMMAND'}</span>
      </div>
    </div>

    <div class="topnav-center">
      <!-- Portal Experience Mode Switcher (GDS Standard) -->
      <div class="portal-mode-toggle" id="portal-mode-toggle" role="tablist" aria-label="Portal Mode">
        <button class="mode-toggle-btn ${state.uiMode === 'PUBLIC' ? 'active' : ''}" data-mode="PUBLIC" title="Citizen & Public Safety View">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Citizen Portal</span>
        </button>
        <button class="mode-toggle-btn ${state.uiMode === 'AUTHORITY' ? 'active' : ''}" data-mode="AUTHORITY" title="SDMA Authority Operational Command">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Authority Command</span>
        </button>
      </div>

      <!-- Global Categorized Search Box -->
      <div class="global-search-container">
        <div class="global-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="global-search-input" id="global-search-input" placeholder="Search district, sensor ID, alert, or shelter...">
        </div>
        <div class="search-results-dropdown hidden" id="global-search-results"></div>
      </div>

      <!-- Region Selector Dropdown -->
      <div class="region-dropdown-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <select class="region-dropdown-select" id="region-dropdown" aria-label="Select Monitored Region">
          ${REGIONS.map(r => `<option value="${r.id}" ${r.id === state.selectedRegionId ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="topnav-right">
      <div class="public-helpline-pill ${state.uiMode === 'PUBLIC' ? '' : 'hidden'}" id="topnav-public-helpline">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <span>Helpline: <strong>112</strong> | EOC <strong>1077</strong></span>
      </div>

      <div class="system-clock-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span id="clock-ticker">${formatDate()} • ${formatTime()}</span>
      </div>

      <button class="btn-danger ${state.uiMode === 'PUBLIC' ? 'hidden' : ''}" style="padding: 6px 12px; font-size: 12px;" id="btn-emergency-broadcast" title="Trigger Emergency CAP Broadcast">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>BROADCAST</span>
      </button>

      <button class="btn-icon" id="btn-audio-toggle" title="Toggle Acoustic Siren & Alert Audio" aria-label="Toggle Siren Audio">
        <svg id="audio-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </button>

      <button class="btn-icon" id="btn-nav-alerts" title="Active Alerts" aria-label="View Active Alerts">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="badge-counter" id="topnav-alert-badge">${state.alerts.length}</span>
      </button>

      <div class="user-profile-widget" id="btn-user-profile" title="Current Portal Role">
        <div class="user-avatar-badge" id="topnav-user-avatar">${state.uiMode === 'PUBLIC' ? 'CIT' : 'DM'}</div>
        <div class="user-meta-text">
          <span class="user-title-name" id="topnav-user-title">${state.uiMode === 'PUBLIC' ? 'Public Portal' : 'District Magistrate'}</span>
          <span class="user-role-name" id="topnav-user-role">${state.uiMode === 'PUBLIC' ? 'Citizen Access' : 'Incident Commander'}</span>
        </div>
      </div>
    </div>
  `;

  // Clock ticker interval
  setInterval(() => {
    const clock = topnav.querySelector('#clock-ticker');
    if (clock) {
      clock.textContent = `${formatDate()} • ${formatTime()}`;
    }
  }, 1000);

  // Logo -> Dashboard
  topnav.querySelector('#brand-logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    store.setView('dashboard');
  });

  // Region dropdown change
  topnav.querySelector('#region-dropdown').addEventListener('change', (e) => {
    store.setRegion(e.target.value);
    showToast(`Region focus set to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });

  // Audio siren toggle
  topnav.querySelector('#btn-audio-toggle').addEventListener('click', () => {
    const isMuted = !store.toggleSound();
    const btn = topnav.querySelector('#btn-audio-toggle');
    if (isMuted) {
      btn.style.opacity = '0.5';
      showToast('Audio alarms muted.', 'warning');
    } else {
      btn.style.opacity = '1';
      showToast('Acoustic sirens enabled.', 'info');
    }
  });

  // Emergency Broadcast Siren Modal
  topnav.querySelector('#btn-emergency-broadcast').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open_broadcast_modal'));
  });

  // Nav Alerts Jump
  topnav.querySelector('#btn-nav-alerts').addEventListener('click', () => {
    store.setView('alerts');
  });

  // Mobile sidebar toggle
  topnav.querySelector('#btn-sidebar-toggle')?.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
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

      // Click on search result item
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
            store.setView('incidents');
          } else if (type === 'shelter') {
            store.setView('risk-map');
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

  // Experience Mode Switcher (Citizen vs Authority)
  topnav.querySelectorAll('.mode-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      store.setUIMode(mode);
      showToast(`Switched to: ${mode === 'PUBLIC' ? '👤 Citizen Safety Portal' : '🛡️ Authority Command'}`, 'info');
    });
  });

  // Reactive updates
  store.subscribe((state, event) => {
    if (event === 'new_alert' || event === 'telemetry_tick') {
      const badge = topnav.querySelector('#topnav-alert-badge');
      if (badge) badge.textContent = state.alerts.length;
    } else if (event === 'ui_mode_change') {
      const isPublic = state.uiMode === 'PUBLIC';
      
      // Update toggle buttons
      topnav.querySelectorAll('.mode-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === state.uiMode);
      });

      // Update titles
      const titleEl = topnav.querySelector('#topnav-brand-title');
      const subEl = topnav.querySelector('#topnav-brand-sub');
      const liveTextEl = topnav.querySelector('#topnav-live-text');
      const helplineEl = topnav.querySelector('#topnav-public-helpline');
      const broadcastBtn = topnav.querySelector('#btn-emergency-broadcast');
      const userAvatar = topnav.querySelector('#topnav-user-avatar');
      const userTitle = topnav.querySelector('#topnav-user-title');
      const userRole = topnav.querySelector('#topnav-user-role');

      if (titleEl) titleEl.textContent = isPublic ? 'CITIZEN DISASTER ADVISORY' : 'ENVIRONMENTAL INTELLIGENCE';
      if (subEl) subEl.textContent = isPublic ? 'PUBLIC EARLY WARNING & SAFETY PORTAL' : 'STATE DISASTER MANAGEMENT AUTHORITY';
      if (liveTextEl) liveTextEl.textContent = isPublic ? 'ACTIVE ADVISORY' : 'LIVE COMMAND';
      if (helplineEl) helplineEl.classList.toggle('hidden', !isPublic);
      if (broadcastBtn) broadcastBtn.classList.toggle('hidden', isPublic);
      if (userAvatar) userAvatar.textContent = isPublic ? 'CIT' : 'DM';
      if (userTitle) userTitle.textContent = isPublic ? 'Public Portal' : 'District Magistrate';
      if (userRole) userRole.textContent = isPublic ? 'Citizen Access' : 'Incident Commander';
    }
  });

  return topnav;
}
