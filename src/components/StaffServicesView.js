// Staff Services & Field Operations Portal Component

import { store } from '../state/store.js';
import { showToast } from './ToastNotification.js';

export function createStaffServicesView() {
  const container = document.createElement('div');
  container.className = 'staff-services-view animated-fade';

  function render() {
    const state = store.getState();
    const stateName = (state.loggedInStateName || 'Tamil Nadu').toUpperCase();
    const stateId = state.loggedInState || 'TN';
    const officerName = state.currentUser ? state.currentUser.name : 'Authorized Officer';
    const officerRole = state.currentUser ? state.currentUser.role : 'Incident Commander';

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🛡️ ${stateName} SDMA — STAFF SERVICES & FIELD OPERATIONS</span>
            <span class="status-badge info">AUTHORITY DISPATCH RESOURCE</span>
          </h1>
          <p class="view-desc-sub">Standard operating guidelines, tactical communications, emergency contacts, and disaster response resources for ${state.loggedInStateName || 'State'} Command</p>
        </div>
      </div>

      <div style="background: rgba(30, 77, 120, 0.08); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">👤</span>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--color-primary-dark);">Logged In: ${officerName} (${officerRole})</div>
            <div style="font-size: 11px; color: var(--color-text-secondary);">Authorized Jurisdiction: ${state.loggedInStateName || 'State'} State Disaster Management Authority • SEOC Active Duty</div>
          </div>
        </div>
        <span class="status-badge success">DUTY ROSTER ACTIVE</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;">
        <!-- Card 1: Radio Communications -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📻 Tactical VHF / UHF Channels</span>
            </div>
            <span class="status-badge success">SECURE MESH</span>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">${stateId}-SEOC Primary Net:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">154.600 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">NDRF Battalion Dispatch:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">148.250 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">${stateId}-SDRF Tactical Net:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">162.400 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
              <span style="color: var(--color-text-secondary);">Aviation Rescue SAR:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">121.500 MHz</strong>
            </div>
            <div style="font-size: 10px; color: var(--color-text-muted); margin-top: 4px;">* All radio channels encrypted with AES-256 for authority operations.</div>
          </div>
        </div>

        <!-- Card 2: Emergency Contacts -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>☎️ EOC Emergency Directory</span>
            </div>
            <span class="status-badge info">DEMO DIRECTORY</span>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">${state.loggedInStateName} SEOC Direct:</span>
              <strong style="font-family: var(--font-mono);">044-28593990</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">NDRF Regional Duty EOC:</span>
              <strong style="font-family: var(--font-mono);">011-24363260</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">State Police HQ Control:</span>
              <strong style="font-family: var(--font-mono);">112 / 100</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
              <span style="color: var(--color-text-secondary);">National Disaster Helpline:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-critical);">1070 / 1077</strong>
            </div>
            <div style="font-size: 10px; color: var(--color-text-muted); margin-top: 4px;">(Simulated contact directory for demonstration purposes)</div>
          </div>
        </div>

        <!-- Card 3: Training & SOG Protocols -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📋 Standard Operating Guidelines</span>
            </div>
            <span class="status-badge success">STANDARD v4.3</span>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--color-text-secondary);">
            <p><strong>• Flash Flood Response (Rev 4.2):</strong> Gauge rise >0.3m/hr mandates immediate alert escalation to Taluk level.</p>
            <p><strong>• Wildfire Containment (Rev 2.8):</strong> Deploy Forestry drone reconnaissance before perimeter back-burning.</p>
            <p><strong>• Landslide Early Warning:</strong> Displace downstream settlements upon cumulative rain >150mm in 24h.</p>
            <p><strong>• Sensor Field Calibration:</strong> Quarterly battery and hydro-pressure gauge maintenance protocol.</p>
          </div>
        </div>
      </div>

      <!-- Staff Recognition & Operational Highlights (Human Centered) -->
      <div class="gov-card" style="margin-bottom: 24px;">
        <div class="gov-card-header">
          <div class="gov-card-title">
            <span>🏆 Response Team Recognition & Field Highlights — ${state.loggedInStateName}</span>
          </div>
          <span class="status-badge success">SEPTEMBER 2026</span>
        </div>
        <div class="gov-card-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: var(--color-surface-soft); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 13px; margin-bottom: 4px;">
              🎖️ NDRF Unit — Rapid Flood Containment
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              Recognized for deploying flood containment barriers across critical river gorge within 18 minutes of initial hydro-gauge threshold breach in ${state.loggedInStateName}.
            </p>
          </div>

          <div style="background: var(--color-surface-soft); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 13px; margin-bottom: 4px;">
              🎖️ Forestry Drone Reconnaissance Team
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              Successfully mapped timber thermal flame progression in buffer corridor, preventing fire spread into sensitive ecological sanctuary zones.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
