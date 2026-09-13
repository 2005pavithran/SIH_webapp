// Staff Services & Field Operations Portal Component

import { store } from '../state/store.js';
import { showToast } from './ToastNotification.js';

export function createStaffServicesView() {
  const container = document.createElement('div');
  container.className = 'staff-services-view animated-fade';

  function render() {
    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🛡️ STAFF SERVICES & FIELD OPERATIONS PORTAL</span>
            <span class="status-badge info">OFFICIAL DISPATCH RESOURCE</span>
          </h1>
          <p class="view-desc-sub">Standard operating guidelines, tactical communications, emergency contacts, and disaster response resources</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;">
        <!-- Card 1: Radio Communications -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📻 Tactical Radio Network</span>
            </div>
            <span class="status-badge success">SECURE</span>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">State EOC Primary:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">154.600 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">NDRF Tactical Unit:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">148.250 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">SDRF Channel 2:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">162.400 MHz</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
              <span style="color: var(--color-text-secondary);">Aviation Rescue Frequency:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-primary);">121.500 MHz</strong>
            </div>
          </div>
        </div>

        <!-- Card 2: Emergency Contacts -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>☎️ Emergency Directory</span>
            </div>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">District Magistrate Control:</span>
              <strong style="font-family: var(--font-mono);">04936-202201</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">NDRF 4th Battalion Duty:</span>
              <strong style="font-family: var(--font-mono);">04936-244109</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
              <span style="color: var(--color-text-secondary);">Civil Hospital Trauma:</span>
              <strong style="font-family: var(--font-mono);">04936-203310</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
              <span style="color: var(--color-text-secondary);">State EOC Helpline:</span>
              <strong style="font-family: var(--font-mono); color: var(--color-critical);">1077</strong>
            </div>
          </div>
        </div>

        <!-- Card 3: Training & SOG Protocols -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📋 Standard Operating Guidelines</span>
            </div>
          </div>
          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--color-text-secondary);">
            <p><strong>• Flash Flood Response (Rev 4.2):</strong> Gauge rise >0.3m/hr mandates immediate alert escalation to Taluk level.</p>
            <p><strong>• Wildfire Containment (Rev 2.8):</strong> Deploy Forestry drone reconnaissance before perimeter back-burning.</p>
            <p><strong>• Sensor Field Calibration:</strong> Quarterly battery and hydro-pressure gauge maintenance protocol.</p>
          </div>
        </div>
      </div>

      <!-- Staff Recognition & Operational Highlights (Human Centered) -->
      <div class="gov-card" style="margin-bottom: 24px;">
        <div class="gov-card-header">
          <div class="gov-card-title">
            <span>🏆 Response Team Recognition & Field Highlights</span>
          </div>
          <span class="status-badge success">SEPTEMBER 2026</span>
        </div>
        <div class="gov-card-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: var(--color-surface-soft); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 13px; margin-bottom: 4px;">
              🎖️ NDRF Unit 09 — Exemplary Rapid Response
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              Recognized for deploying flood containment barriers across Vythiri River Gorge within 18 minutes of initial hydro-gauge threshold breach.
            </p>
          </div>

          <div style="background: var(--color-surface-soft); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 13px; margin-bottom: 4px;">
              🎖️ Forestry Drone Reconnaissance Team 02
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              Successfully mapped timber thermal flame progression in Zone Y buffer corridor, preventing fire spread into wildlife sanctuary.
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
