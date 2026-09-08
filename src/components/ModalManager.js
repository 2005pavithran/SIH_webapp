// Centralized Modal Manager Component

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

  // 1. Sensor Details Modal
  store.subscribe((state, event, payload) => {
    if (event === 'open_sensor_modal') {
      const sensor = payload;
      const riskCls = getRiskClass(sensor.risk);

      modalBackdrop.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <div class="modal-title">
              <span>📡 SENSOR NODE DIAGNOSTICS: ${sensor.id}</span>
              <span class="risk-badge ${riskCls}">${sensor.risk} RISK</span>
            </div>
            <button class="modal-close-btn" id="modal-close">&times;</button>
          </div>

          <div class="modal-body">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="font-size: 16px; color: #fff;">${sensor.name}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">Location: <strong>${sensor.location}</strong> • Lat: ${sensor.lat}, Lng: ${sensor.lng}</div>
              </div>
              <div style="text-align: right;">
                <span class="live-pulse-badge">ONLINE • ${sensor.signal} dBm</span>
              </div>
            </div>

            <!-- Telemetry 4-Stat Box -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <div class="report-stat-box">
                <div class="report-stat-num" style="color: ${sensor.waterLevel > 3.2 ? 'var(--risk-crit)' : '#fff'};">
                  ${sensor.waterLevel ? sensor.waterLevel + 'm' : 'N/A'}
                </div>
                <div class="report-stat-label">Water Level</div>
              </div>

              <div class="report-stat-box">
                <div class="report-stat-num">${sensor.temp}°C</div>
                <div class="report-stat-label">Temperature</div>
              </div>

              <div class="report-stat-box">
                <div class="report-stat-num" style="color: ${sensor.pm25 > 100 ? 'var(--risk-high)' : '#fff'};">${sensor.pm25}</div>
                <div class="report-stat-label">PM2.5 (µg/m³)</div>
              </div>

              <div class="report-stat-box">
                <div class="report-stat-num" style="color: var(--risk-low);">${sensor.battery}%</div>
                <div class="report-stat-label">Battery Health</div>
              </div>
            </div>

            <!-- Live Canvas Oscillograph -->
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px;">
              <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; font-weight: 700;">
                Live Oscillograph Stream (Past 60 Seconds):
              </div>
              <div style="height: 120px; position: relative;">
                <canvas id="sensor-modal-canvas" style="width: 100%; height: 100%;"></canvas>
              </div>
            </div>

            <!-- Node Metadata -->
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--text-secondary);">
              <div style="display: flex; justify-content: space-between;">
                <span>Firmware:</span>
                <span style="font-family: var(--font-mono);">v4.8.2-edge-lorawan</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>AI Anomaly Score:</span>
                <span style="color: var(--risk-crit); font-weight: 700; font-family: var(--font-mono);">91.4% (Threshold Exceeded)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Telemetry Ingest Mode:</span>
                <span style="color: var(--risk-low);">Continuous (3000ms heartbeat)</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" id="modal-view-gis-btn">View On GIS Map</button>
            <button class="btn-primary" id="modal-close-confirm">Done</button>
          </div>
        </div>
      `;

      modalBackdrop.classList.remove('hidden');
      modalBackdrop.querySelector('#modal-close').addEventListener('click', closeModal);
      modalBackdrop.querySelector('#modal-close-confirm').addEventListener('click', closeModal);

      modalBackdrop.querySelector('#modal-view-gis-btn').addEventListener('click', () => {
        closeModal();
        store.setView('live-map');
      });

      // Draw oscillograph
      setTimeout(() => {
        const canvas = modalBackdrop.querySelector('#sensor-modal-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const w = canvas.parentElement.clientWidth;
          const h = 120;
          canvas.width = w;
          canvas.height = h;

          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          for (let x = 0; x < w; x += 10) {
            const y = (h / 2) + Math.sin(x * 0.08) * 25 + (Math.random() * 10 - 5);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }, 50);
    }

    // 2. Incident Dispatch Modal
    if (event === 'open_incident_modal') {
      const inc = payload;
      const riskCls = getRiskClass(inc.severity);

      modalBackdrop.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <div class="modal-title">
              <span>🚑 DEPLOY TACTICAL RESPONSE: #${inc.id}</span>
              <span class="risk-badge ${riskCls}">${inc.severity}</span>
            </div>
            <button class="modal-close-btn" id="modal-close">&times;</button>
          </div>

          <div class="modal-body">
            <div>
              <h3 style="font-size: 16px; color: #fff;">${inc.title}</h3>
              <p style="font-size: 12px; color: var(--text-muted);">${inc.location} • Affected: ${inc.affectedArea}</p>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
                Select Available Emergency Response Unit:
              </label>
              <select id="modal-team-select" style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-medium); color: #fff; padding: 10px; border-radius: 8px; outline: none; font-size: 13px;">
                ${state.teams.map(t => `<option value="${t.id}">${t.name} — [${t.status}] (${t.personnel} Personnel • ETA ${t.eta})</option>`).join('')}
              </select>
            </div>

            <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 12px; color: var(--text-secondary);">
              <strong>Automated Alert Protocol:</strong> Deploying this unit will automatically dispatch geospatial coordinates to the team's field mobile terminals and notify the State Emergency Operations Center.
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
        showToast(`Team deployed to Incident #${inc.id}! Coordinates transmitted.`, 'success');
        audioAlert.playPing();
        closeModal();
      });
    }

    // 3. Alert Details Modal
    if (event === 'open_alert_modal') {
      const alert = payload;
      const riskCls = getRiskClass(alert.severity);

      modalBackdrop.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <div class="modal-title">
              <span>🚨 ALERT BRIEF: ${alert.id}</span>
              <span class="risk-badge ${riskCls}">${alert.severity}</span>
            </div>
            <button class="modal-close-btn" id="modal-close">&times;</button>
          </div>

          <div class="modal-body">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="hazard-icon-circle" style="font-size: 26px;">${getHazardIcon(alert.hazard)}</div>
              <div>
                <h3 style="font-size: 16px; color: #fff;">${alert.title}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">${alert.location} • ${alert.timeAgo}</div>
              </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; font-size: 13px; color: var(--text-secondary);">
              ${alert.description}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
              <div class="report-stat-box">
                <div class="report-stat-num" style="color: #c084fc;">${alert.aiConfidence}%</div>
                <div class="report-stat-label">AI Neural Confidence</div>
              </div>
              <div class="report-stat-box">
                <div class="report-stat-num" style="color: var(--accent-cyan);">${alert.sensorId || 'Mesh'}</div>
                <div class="report-stat-label">Triggering Node ID</div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" id="modal-ack-btn">Acknowledge</button>
            <button class="btn-primary" id="modal-dispatch-alert-btn">Dispatch Emergency Team</button>
          </div>
        </div>
      `;

      modalBackdrop.classList.remove('hidden');
      modalBackdrop.querySelector('#modal-close').addEventListener('click', closeModal);
      modalBackdrop.querySelector('#modal-ack-btn').addEventListener('click', () => {
        showToast(`Alert ${alert.id} acknowledged by Authority.`, 'info');
        closeModal();
      });
      modalBackdrop.querySelector('#modal-dispatch-alert-btn').addEventListener('click', () => {
        closeModal();
        store.setView('incidents');
      });
    }
  });

  // Emergency Broadcast Siren Modal
  window.addEventListener('open_broadcast_modal', () => {
    modalBackdrop.innerHTML = `
      <div class="modal-window">
        <div class="modal-header">
          <div class="modal-title" style="color: var(--risk-crit);">
            <span>🚨 CAP-INDIA EMERGENCY PUBLIC BROADCAST</span>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <div class="modal-body">
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid var(--risk-crit); border-radius: 8px; padding: 14px; font-size: 12px; color: #fff;">
            <strong>⚠️ WARNING:</strong> You are about to initiate a high-priority emergency broadcast across cell towers, acoustic siren networks, and media feeds for the selected district.
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
              Broadcast Message Content (Multi-Lingual):
            </label>
            <textarea style="width: 100%; height: 90px; background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 8px; color: #fff; padding: 10px; font-size: 12px; resize: none; outline: none;">EMERGENCY DISASTER ALERT: Severe Flash Flood Surge detected in District X (Vythiri Gorge). Evacuate low-lying river banks immediately and move to designated Relief Shelters SH-01/SH-02. Follow EOC instructions.</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
              <input type="checkbox" checked style="accent-color: var(--accent-blue);"> Cell Broadcast (SMS)
            </label>
            <label style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
              <input type="checkbox" checked style="accent-color: var(--accent-blue);"> Acoustic Siren Towers
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
