// System Settings & Ingestion Configuration Component (Bright Government Theme)

import { store } from '../state/store.js';
import { audioAlert } from '../utils/audioAlert.js';
import { simulationEngine } from '../state/simulation.js';
import { showToast } from './ToastNotification.js';

export function createSystemSettingsView() {
  const container = document.createElement('div');
  container.className = 'settings-view animated-fade';

  function render() {
    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>⚙️ SYSTEM & TELEMETRY CONFIGURATION</span>
            <span class="status-badge info">ADMIN ACCESS</span>
          </h1>
          <p class="view-desc-sub">Configure edge mesh ingestion parameters, CAP-India emergency sirens, AI threshold triggers, and simulation modes</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Ingestion & Gateway Settings -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>📡 IoT Ingestion & Edge Protocols</span>
            </div>
          </div>

          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 6px;">
                Telemetry Ingestion Frequency:
              </label>
              <select style="width: 100%; background: #FFFFFF; border: 1px solid var(--color-border); padding: 8px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500;" id="setting-ingest-rate">
                <option value="1000">1 Second (High Priority Flash Flood Mode)</option>
                <option value="3000" selected>3 Seconds (Standard Operational Continuous)</option>
                <option value="5000">5 Seconds (Low Bandwidth Satellite Mesh)</option>
                <option value="10000">10 Seconds (Power Conservation Mode)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 6px;">
                CAP-India Integrated Warning Gateway:
              </label>
              <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-surface-soft); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <div>
                  <div style="font-weight: 600; color: var(--color-text-primary); font-size: 13px;">Automated Citizen Cell-Broadcast</div>
                  <div style="font-size: 11px; color: var(--color-text-muted);">Trigger sirens when AI confidence exceeds 90%</div>
                </div>
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--color-primary); cursor: pointer;">
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 6px;">
                Satellite Earth Observation Sync (INSAT-3DR / Sentinel-2):
              </label>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--color-text-secondary); background: var(--color-surface-soft); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <span>Last Geospatial Orbital Pass:</span>
                <strong style="font-family: var(--font-mono); color: var(--color-primary);">18:15 IST (Synchronized)</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Audio & Siren Diagnostic Center -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🔊 Acoustic Warning & Siren Diagnostics</span>
            </div>
          </div>

          <div class="gov-card-body" style="display: flex; flex-direction: column; gap: 16px;">
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              Test the Web Audio API synthesized command center alarms for disaster response teams:
            </p>

            <div style="display: flex; gap: 10px;">
              <button class="btn-danger" id="btn-test-siren" style="flex: 1; justify-content: center;">
                🚨 Test Critical Siren
              </button>
              <button class="btn-secondary" id="btn-test-ping" style="flex: 1; justify-content: center;">
                🔔 Test Telemetry Ping
              </button>
            </div>

            <div style="margin-top: 10px; border-top: 1px solid var(--color-border-subtle); padding-top: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">
                SIH Evaluator Scenario Injectors:
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="btn-scenario" style="padding: 10px 14px; text-align: left; width: 100%;" id="btn-set-flood">
                  🌊 Inject Sudden Cloudburst (Forces Water Level to 4.35m & Fires Alarm)
                </button>
                <button class="btn-scenario" style="padding: 10px 14px; text-align: left; width: 100%;" id="btn-set-fire">
                  🔥 Inject Rapid Timber Wildfire (Thermal Peak 48.2°C in Zone Y)
                </button>
                <button class="btn-scenario" style="padding: 10px 14px; text-align: left; width: 100%;" id="btn-set-reset">
                  🔄 Restore System to Nominal Baseline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#btn-test-siren').addEventListener('click', () => {
      audioAlert.playCriticalSiren();
      showToast('🔊 Tested Critical Emergency Siren (Web Audio API Synthesizer)', 'crit');
    });

    container.querySelector('#btn-test-ping').addEventListener('click', () => {
      audioAlert.playPing();
      showToast('🔔 Tested Telemetry Ping chime', 'info');
    });

    container.querySelector('#btn-set-flood').addEventListener('click', () => {
      simulationEngine.triggerFlashFloodScenario();
    });

    container.querySelector('#btn-set-fire').addEventListener('click', () => {
      simulationEngine.triggerWildfireScenario();
    });

    container.querySelector('#btn-set-reset').addEventListener('click', () => {
      simulationEngine.resetBaselineScenario();
    });
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
