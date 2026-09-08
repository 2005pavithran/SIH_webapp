// Top Navigation Bar Component

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
      <a href="#" class="brand-logo" id="brand-logo-btn">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div class="brand-title">
          <span>ENVIRONMENTAL INTELLIGENCE</span>
          <span class="brand-subtitle">AUTHORITY COMMAND PORTAL</span>
        </div>
      </a>
      <div class="live-pulse-badge">
        <span class="pulse-dot"></span>
        <span>LIVE TELEMETRY</span>
      </div>
    </div>

    <div class="topnav-center">
      <div class="region-selector">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <select id="region-dropdown">
          ${REGIONS.map(r => `<option value="${r.id}" ${r.id === state.selectedRegionId ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select>
      </div>

      <div class="system-clock">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span id="clock-ticker">${formatDate()} • ${formatTime()}</span>
      </div>
    </div>

    <div class="topnav-right">
      <button class="btn-emergency-broadcast" id="btn-emergency-broadcast" title="Trigger Emergency CAP Broadcast">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>BROADCAST ALARM</span>
      </button>

      <button class="btn-icon" id="btn-audio-toggle" title="Toggle Siren & Chimes">
        <svg id="audio-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </button>

      <button class="btn-icon" id="btn-nav-alerts" title="Active Alerts">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="badge-pill" id="topnav-alert-badge">${state.alerts.length}</span>
      </button>

      <div class="user-profile-btn" id="btn-user-profile">
        <div class="user-avatar">AUTH</div>
        <div class="user-info">
          <span class="user-name">District Magistrate</span>
          <span class="user-role">Incident Commander</span>
        </div>
      </div>

      <button class="btn-icon" id="btn-nav-settings" title="System Settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>
  `;

  // Attach Event Listeners
  setInterval(() => {
    const clock = topnav.querySelector('#clock-ticker');
    if (clock) {
      clock.textContent = `${formatDate()} • ${formatTime()}`;
    }
  }, 1000);

  topnav.querySelector('#brand-logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    store.setView('dashboard');
  });

  topnav.querySelector('#region-dropdown').addEventListener('change', (e) => {
    store.setRegion(e.target.value);
    showToast(`Switched region focus to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });

  topnav.querySelector('#btn-audio-toggle').addEventListener('click', () => {
    const isMuted = !store.toggleSound();
    const btn = topnav.querySelector('#btn-audio-toggle');
    if (isMuted) {
      btn.style.opacity = '0.5';
      showToast('Audio alerts muted', 'warning');
    } else {
      btn.style.opacity = '1';
      showToast('Audio alarms enabled (Web Audio Synthesizer)', 'info');
    }
  });

  topnav.querySelector('#btn-emergency-broadcast').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open_broadcast_modal'));
  });

  topnav.querySelector('#btn-nav-alerts').addEventListener('click', () => {
    store.setView('alerts');
  });

  topnav.querySelector('#btn-nav-settings').addEventListener('click', () => {
    store.setView('settings');
  });

  // Reactive updates from store
  store.subscribe((state, event) => {
    if (event === 'new_alert' || event === 'telemetry_tick') {
      const badge = topnav.querySelector('#topnav-alert-badge');
      if (badge) badge.textContent = state.alerts.length;
    }
  });

  return topnav;
}
