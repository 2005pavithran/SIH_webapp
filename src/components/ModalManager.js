// Centralized Modal Manager Component (Bright Government Standard)

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';
import { audioAlert } from '../utils/audioAlert.js';
import { showToast } from './ToastNotification.js';

export function initModalManager() {
  const modalBackdrop = document.getElementById('modal-container');
  if (!modalBackdrop) return;

  function closeModal() {
    modalBackdrop.classList.add('hidden');
    modalBackdrop.innerHTML = '';
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // 1. Sensor Diagnostics Modal Fallback (also available via Drawer)
  store.subscribe((state, event, payload) => {
    if (event === 'open_sensor_modal') {
      window.drawerManager?.openSensorDrawer(payload.id);
    }

    // 2. Incident Dispatch Tactical Modal
    if (event === 'open_incident_modal') {
      const inc = payload;
      const riskCls = getRiskClass(inc.severity);

      modalBackdrop.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <div class="modal-title">
              <span>🚑 Tactical Dispatch: Incident #${inc.id}</span>
              <span class="status-badge ${riskCls}">${inc.severity}</span>
            </div>
            <button class="modal-close-btn" id="modal-close" aria-label="Close dialog">&times;</button>
          </div>

          <div class="modal-body">
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-primary-dark);">${inc.title}</h3>
              <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">${inc.location} • Inundation Footprint: <strong>${inc.affectedArea}</strong></p>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">
                Assign Available Emergency Response Unit:
              </label>
              <select id="modal-team-select" style="width: 100%; background: #FFFFFF; border: 1px solid var(--color-border); color: var(--color-text-primary); padding: 10px; border-radius: var(--radius-md); outline: none; font-size: 13px; font-weight: 600;">
                ${state.teams.map(t => `<option value="${t.id}">${t.name} — [${t.status}] (${t.personnel} Personnel • ETA: ${t.eta})</option>`).join('')}
              </select>
            </div>

            <div style="background: var(--color-surface-soft); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 12px; color: var(--color-text-secondary);">
              <strong>Automated Dispatch Protocol:</strong> Confirming deployment will immediately transmit digital mission coordinates to the unit's field terminal and log the assignment in the State EOC database.
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" id="modal-cancel">Cancel</button>
            <button class="btn-primary" id="modal-dispatch-confirm">🚀 Confirm Tactical Deployment</button>
          </div>
        </div>
      `;

      modalBackdrop.classList.remove('hidden');
      modalBackdrop.querySelector('#modal-close').addEventListener('click', closeModal);
      modalBackdrop.querySelector('#modal-cancel').addEventListener('click', closeModal);

      modalBackdrop.querySelector('#modal-dispatch-confirm').addEventListener('click', () => {
        const teamId = modalBackdrop.querySelector('#modal-team-select').value;
        store.assignTeamToIncident(inc.id, teamId);
        showToast(`Tactical unit assigned to Incident #${inc.id}! Coordinates dispatched.`, 'success');
        audioAlert.playPing();
        closeModal();
      });
    }

    // 3. Alert Details Modal Fallback (routed to drawer)
    if (event === 'open_alert_modal') {
      window.drawerManager?.openAlertDrawer(payload.id);
    }
  });

  // Emergency Public Broadcast Siren Modal
  window.addEventListener('open_broadcast_modal', () => {
    modalBackdrop.innerHTML = `
      <div class="modal-window">
        <div class="modal-header">
          <div class="modal-title" style="color: var(--color-critical);">
            <span>🚨 CAP-INDIA EMERGENCY PUBLIC BROADCAST</span>
          </div>
          <button class="modal-close-btn" id="modal-close" aria-label="Close dialog">&times;</button>
        </div>

        <div class="modal-body">
          <div style="background: var(--color-critical-light); border: 1px solid var(--color-critical-border); border-radius: var(--radius-md); padding: 14px; font-size: 13px; color: var(--color-critical);">
            <strong>⚠️ WARNING:</strong> You are about to initiate a state-level emergency cell broadcast across regional telecom towers and acoustic siren stations.
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">
              Emergency Alert Advisory Content:
            </label>
            <textarea style="width: 100%; height: 95px; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); padding: 10px; font-size: 12px; resize: none; outline: none; line-height: 1.4;">EMERGENCY DISASTER ALERT: Severe Flash Flood Surge detected in District X (Vythiri Gorge). Evacuate low-lying river banks immediately and move to designated Relief Shelters SH-01/SH-02. Follow EOC instructions.</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; color: var(--color-text-primary); font-weight: 500;">
              <input type="checkbox" checked style="accent-color: var(--color-primary); width: 16px; height: 16px;"> Cell Broadcast (SMS)
            </label>
            <label style="display: flex; align-items: center; gap: 8px; color: var(--color-text-primary); font-weight: 500;">
              <input type="checkbox" checked style="accent-color: var(--color-primary); width: 16px; height: 16px;"> Acoustic Siren Towers
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-danger" id="modal-broadcast-confirm">🚨 TRANSMIT EMERGENCY BROADCAST</button>
        </div>
      </div>
    `;

    modalBackdrop.classList.remove('hidden');
    modalBackdrop.querySelector('#modal-close').addEventListener('click', closeModal);
    modalBackdrop.querySelector('#modal-cancel').addEventListener('click', closeModal);

    modalBackdrop.querySelector('#modal-broadcast-confirm').addEventListener('click', () => {
      audioAlert.playCriticalSiren();
      showToast('🚨 CAP-India Emergency Broadcast Dispatched to 14,280 citizens!', 'crit');
      closeModal();
    });
  });
}
