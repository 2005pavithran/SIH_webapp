// System & Command Center Settings Component

import { store } from '../state/store.js';
import { audioAlert } from '../utils/audioAlert.js';
import { simulationEngine } from '../state/simulation.js';
import { showToast } from './ToastNotification.js';

export function createSystemSettingsView() {
  const container = document.createElement('div');
  container.className = 'settings-view animated-fade';

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>⚙️ SYSTEM & TELEMETRY CONFIGURATION</span>
            <span class="live-pulse-badge">ADMIN ACCESS</span>
          </h1>
          <p>Configure edge ingestion parameters, CAP-India emergency sirens, AI threshold triggers, and simulation modes</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Ingestion & Gateway Settings -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>📡 IOT INGESTION & EDGE PROTOCOL</span>
            </div>
          </div>

          <div class="command-card-body" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                Telemetry Ingestion Frequency:
              </label>
              <select class="region-selector" style="width: 100%;" id="setting-ingest-rate">
                <option value="1000">1 Second (High Priority Flash Flood Mode)</option>
                <option value="3000" selected>3 Seconds (Standard Operational Continuous)</option>
                <option value="5000">5 Seconds (Low Bandwidth Satellite Mesh)</option>
                <option value="10000">10 Seconds (Power Conservation Mode)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                CAP-India Integrated Warning Gateway:
              </label>
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 12px;">Automated Citizen Cell-Broadcast</div>
                  <div style="font-size: 11px; color: var(--text-muted);">Trigger sirens when AI confidence exceeds 90%</div>
                </div>
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--accent-blue); cursor: pointer;">
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
                Satellite Earth Observation Sync (INSAT-3DR / Sentinel-2):
              </label>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);">
                <span>Last Geospatial Orbital Pass:</span>
                <span style="font-family: var(--font-mono); color: #fff;">18:15 IST (Synced)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Audio & Siren Diagnostic Center -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🔊 ACOUSTIC WARNING & SIREN DIAGNOSTICS</span>
            </div>
          </div>

          <div class="command-card-body" style="display: flex; flex-direction: column; gap: 16px;">
            <p style="font-size: 12px; color: var(--text-muted);">
              Test the Web Audio API synthesized command center alarms for disaster response teams:
            </p>

            <div style="display: flex; gap: 10px;">
              <button class="btn-danger" id="btn-test-siren" style="flex: 1;">
                🚨 Test Critical Siren
              </button>
              <button class="btn-secondary" id="btn-test-ping" style="flex: 1;">
                🔔 Test Telemetry Ping
              </button>
            </div>

            <div style="margin-top: 10px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px;">
                SIH Evaluator Scenario Injectors:
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="btn-scenario" style="padding: 8px; text-align: left;" id="btn-set-flood">
                  🌊 Inject Sudden Cloudburst (Forces Water Level to 4.35m & Fires Alarm)
                </button>
                <button class="btn-scenario" style="padding: 8px; text-align: left;" id="btn-set-fire">
                  🔥 Inject Rapid Timber Wildfire (Thermal Peak 48.2°C in Zone Y)
                </button>
                <button class="btn-scenario" style="padding: 8px; text-align: left;" id="btn-set-reset">
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
