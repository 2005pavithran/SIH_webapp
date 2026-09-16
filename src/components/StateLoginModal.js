// State Authority Authentication & Jurisdiction Access Modal

import { store } from '../state/store.js';
import { STATES_CONFIG } from '../utils/mockData.js';
import { showToast } from './ToastNotification.js';
import { audioAlert } from '../utils/audioAlert.js';

export function openStateLoginModal(preSelectedStateId = 'TN') {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const targetState = STATES_CONFIG.find(s => s.id === preSelectedStateId) || STATES_CONFIG[0];

  modalContainer.innerHTML = `
    <div class="modal-window" style="max-width: 540px; background: #04120a; border: 1.5px solid var(--landing-border); color: #F0FDF4; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15);">
      <div class="modal-header" style="border-bottom: 1px solid var(--landing-border); background: rgba(1, 6, 4, 0.8);">
        <div class="modal-title" style="color: #FFFFFF; font-size: 16px;">
          <span>🛡️ STATE AUTHORITY ACCESS GATEWAY</span>
        </div>
        <button class="modal-close-btn" id="login-modal-close" style="color: var(--landing-text-muted); font-size: 20px;" aria-label="Close dialog">&times;</button>
      </div>

      <div class="modal-body" style="padding: 24px; display: flex; flex-direction: column; gap: 18px;">
        <!-- Institutional Notice -->
        <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid var(--landing-border); border-radius: var(--radius-md); padding: 12px 14px; font-size: 12px; color: var(--landing-text-secondary); line-height: 1.5;">
          <strong style="color: var(--landing-emerald-light);">AUTHORITY ACCESS ONLY:</strong> This gateway provides direct command access to state environmental telemetry networks and CAP-India emergency broadcast sirens.
        </div>

        <div id="login-error-msg" style="display: none; background: rgba(220, 38, 38, 0.15); border: 1px solid #ef4444; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #fca5a5; font-weight: 600;">
          ⚠️ ACCESS DENIED: Invalid passcode or unauthorized state credentials.
        </div>

        <!-- Form Elements -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px;">
            Target State Jurisdiction:
          </label>
          <select id="login-state-select" style="background: #010604; border: 1px solid var(--landing-border); color: #FFFFFF; padding: 10px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; outline: none;">
            ${STATES_CONFIG.map(s => `
              <option value="${s.id}" ${s.id === targetState.id ? 'selected' : ''}>
                ${s.name} (${s.code}) • ${s.districts.length} Monitored Districts
              </option>
            `).join('')}
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px;">
            Officer Authorized Role:
          </label>
          <select id="login-role-select" style="background: #010604; border: 1px solid var(--landing-border); color: #FFFFFF; padding: 10px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; outline: none;">
            <option value="STATE_INCIDENT_COMMANDER" selected>State Incident Commander / SDMA Lead</option>
            <option value="DISTRICT_MAGISTRATE">District Magistrate / Disaster EOC Head</option>
            <option value="OPERATIONS_CHIEF">Emergency Operations Center (EOC) Chief</option>
            <option value="TELEMETRY_ENGINEER">SDMA Senior Telemetry & GIS Officer</option>
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 12px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px;">
              Authority Passcode / Token:
            </label>
            <span style="font-size: 11px; color: var(--landing-emerald-light); font-family: var(--font-mono);">Demo: SDMA2026</span>
          </div>
          <input type="password" id="login-passcode-input" placeholder="Enter SDMA Passcode (e.g. SDMA2026)..." value="SDMA2026" style="background: #010604; border: 1px solid var(--landing-border); color: #FFFFFF; padding: 10px 12px; border-radius: var(--radius-md); font-size: 13px; font-family: var(--font-mono); outline: none;">
        </div>

        <!-- Quick 1-Click Demo Evaluation Presets -->
        <div style="background: rgba(1, 6, 4, 0.7); border: 1px solid var(--landing-border); border-radius: var(--radius-md); padding: 12px 14px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--landing-text-muted); text-transform: uppercase; margin-bottom: 8px;">
            ⚡ Quick Evaluator Demo Access:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-demo-quick" data-state="TN" style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--landing-border); color: var(--landing-emerald-light); padding: 5px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600; cursor: pointer;">
              📍 Tamil Nadu
            </button>
            <button class="btn-demo-quick" data-state="UT" style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--landing-border); color: var(--landing-emerald-light); padding: 5px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600; cursor: pointer;">
              📍 Uttarakhand
            </button>
            <button class="btn-demo-quick" data-state="KL" style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--landing-border); color: var(--landing-emerald-light); padding: 5px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600; cursor: pointer;">
              📍 Kerala
            </button>
            <button class="btn-demo-quick" data-state="AS" style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--landing-border); color: var(--landing-emerald-light); padding: 5px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600; cursor: pointer;">
              📍 Assam
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="border-top: 1px solid var(--landing-border); background: rgba(1, 6, 4, 0.9); padding: 16px 24px;">
        <button class="btn-landing-secondary" id="login-modal-cancel" style="padding: 8px 18px; font-size: 13px;">
          Cancel
        </button>
        <button class="btn-landing-primary" id="login-submit-btn" style="padding: 8px 24px; font-size: 13px;">
          <span>🚀 Enter State Command Center</span>
        </button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  function closeModal() {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }

  // Close handlers
  modalContainer.querySelector('#login-modal-close').addEventListener('click', closeModal);
  modalContainer.querySelector('#login-modal-cancel').addEventListener('click', closeModal);

  // Quick Demo Buttons
  modalContainer.querySelectorAll('.btn-demo-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-state');
      const selectEl = modalContainer.querySelector('#login-state-select');
      if (selectEl) selectEl.value = sId;
      modalContainer.querySelector('#login-passcode-input').value = 'SDMA2026';
      performLogin();
    });
  });

  // Submit Handler
  function performLogin() {
    const stateId = modalContainer.querySelector('#login-state-select').value;
    const role = modalContainer.querySelector('#login-role-select').value;
    const passcode = modalContainer.querySelector('#login-passcode-input').value.trim();
    const errorEl = modalContainer.querySelector('#login-error-msg');

    // Safe Prototype / Demo Authentication Check
    // Valid passcodes: SDMA2026, admin, emergency, 1234, or any non-empty in demo mode
    const isValid = passcode.toUpperCase() === 'SDMA2026' || passcode.toLowerCase() === 'admin' || passcode.length >= 4;

    if (!isValid) {
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = '⚠️ ACCESS DENIED: Invalid passcode. Please enter valid SDMA authorization (e.g. SDMA2026).';
      }
      return;
    }

    if (errorEl) errorEl.style.display = 'none';

    // Execute state authority login
    store.loginStateAuthority(stateId, role, passcode);
    const selectedStateObj = STATES_CONFIG.find(s => s.id === stateId);
    showToast(`🛡️ Authenticated: ${selectedStateObj?.name} State Command Center established!`, 'success');
    audioAlert.playPing();

    closeModal();
    window.location.hash = '#dashboard';
  }

  modalContainer.querySelector('#login-submit-btn').addEventListener('click', performLogin);
  modalContainer.querySelector('#login-passcode-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performLogin();
  });
}
