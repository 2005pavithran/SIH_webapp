// Centralized Progressive Disclosure Slide-over Drawer Manager

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon, getHazardTagClass } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';
import { audioAlert } from '../utils/audioAlert.js';

class DrawerManager {
  constructor() {
    this.drawerContainer = null;
    this.currentDrawerType = null;
    this.activeTab = 'overview';
  }

  init() {
    this.drawerContainer = document.getElementById('drawer-container');
    if (!this.drawerContainer) return;

    this.drawerContainer.addEventListener('click', (e) => {
      if (e.target === this.drawerContainer) {
        this.closeDrawer();
      }
    });

    // Listen to store events for opening drawers
    store.subscribe((state, event, payload) => {
      if (event === 'open_alert_drawer') {
        this.renderAlertDrawer(payload);
      } else if (event === 'open_sensor_drawer') {
        this.renderSensorDrawer(payload);
      } else if (event === 'open_ai_drawer') {
        this.renderAIDrawer(payload);
      } else if (event === 'open_staff_drawer') {
        this.renderStaffDrawer();
      }
    });
  }

  closeDrawer() {
    if (!this.drawerContainer) return;
    this.drawerContainer.classList.add('hidden');
    this.drawerContainer.setAttribute('aria-hidden', 'true');
    this.drawerContainer.innerHTML = '';
    this.currentDrawerType = null;
  }

  openAlertDrawer(alertId) {
    const alert = store.getState().alerts.find(a => a.id === alertId);
    if (alert) {
      store.notify('open_alert_drawer', alert);
    }
  }

  openSensorDrawer(sensorId) {
    const sensor = store.getState().sensors.find(s => s.id === sensorId);
    if (sensor) {
      store.notify('open_sensor_drawer', sensor);
    }
  }

  openAIDrawer(hazard = 'Flood') {
    store.notify('open_ai_drawer', hazard);
  }

  openStaffDrawer() {
    store.notify('open_staff_drawer', null);
  }

  // 1. Alert Details Drawer with Tabs
  renderAlertDrawer(alert) {
    if (!this.drawerContainer) return;
    const state = store.getState();
    const riskCls = getRiskClass(alert.severity);
    const hazardTag = getHazardTagClass(alert.hazard);
    const triggerSensor = state.sensors.find(s => s.id === alert.sensorId) || state.sensors[0];

    this.activeTab = 'overview';

    const buildContent = () => {
      let tabHTML = '';
      if (this.activeTab === 'overview') {
        tabHTML = `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 6px;">
                Official Situation Summary
              </div>
              <p style="font-size: 13px; color: var(--color-text-primary); line-height: 1.5;">
                ${alert.description}
              </p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="kpi-card" style="padding: 12px;">
                <div class="kpi-label">AI Neural Confidence</div>
                <div class="kpi-numeric-val" style="color: var(--color-primary);">${alert.aiConfidence}%</div>
                <div class="kpi-subtext">Deep LSTM Model</div>
              </div>

              <div class="kpi-card" style="padding: 12px;">
                <div class="kpi-label">Triggering Node</div>
                <div class="kpi-numeric-val" style="font-size: 20px; color: var(--color-text-primary);">${alert.sensorId || 'Mesh Aggregate'}</div>
                <div class="kpi-subtext">${triggerSensor ? triggerSensor.location : 'District Telemetry'}</div>
              </div>
            </div>

            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; font-size: 12px;">
              <div style="font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">Recommended Operational Action:</div>
              <ul style="padding-left: 18px; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 4px;">
                <li>Mobilize NDRF / SDRF rapid assessment unit to ${alert.location}.</li>
                <li>Issue localized CAP-India cell broadcast to low-lying zones.</li>
                <li>Activate Emergency Relief Shelter SH-01 and SH-02 standby protocols.</li>
              </ul>
            </div>
          </div>
        `;
      } else if (this.activeTab === 'ai') {
        tabHTML = `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-primary-light); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid #BFD9F0;">
              <div>
                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-primary);">Predictive Hazard Index</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--color-primary-dark);">${state.aiPrediction.riskScore} / 100</div>
              </div>
              <span class="status-badge ${getRiskClass(state.aiPrediction.riskLevel)}">${state.aiPrediction.riskLevel}</span>
            </div>

            <div style="font-size: 12px; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">
              SHAP Explainable AI Feature Attribution:
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${state.aiPrediction.factors.map(f => `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="font-weight: 600; color: var(--color-text-primary);">${f.name}</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-primary);">${f.value} (${f.weight}%)</span>
                  </div>
                  <div style="height: 6px; background: var(--color-surface-muted); border-radius: var(--radius-pill); overflow: hidden;">
                    <div style="width: ${f.weight * 2.5}%; height: 100%; background: ${f.impact === 'critical' ? 'var(--color-critical)' : 'var(--color-primary)'}; border-radius: var(--radius-pill);"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (this.activeTab === 'evidence') {
        tabHTML = `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="kpi-card" style="padding: 14px;">
              <div style="font-weight: 700; font-size: 13px; color: var(--color-text-primary); margin-bottom: 6px;">
                📡 Telemetry Node: ${triggerSensor.id} (${triggerSensor.name})
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><span style="color: var(--color-text-muted);">Water Level:</span> <strong>${triggerSensor.waterLevel ? triggerSensor.waterLevel + ' m' : 'N/A'}</strong></div>
                <div><span style="color: var(--color-text-muted);">Temperature:</span> <strong>${triggerSensor.temp}°C</strong></div>
                <div><span style="color: var(--color-text-muted);">PM2.5:</span> <strong>${triggerSensor.pm25} µg/m³</strong></div>
                <div><span style="color: var(--color-text-muted);">Battery:</span> <strong>${triggerSensor.battery}%</strong></div>
              </div>
            </div>
            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; font-size: 12px; color: var(--color-text-secondary);">
              <strong>Mesh Status:</strong> Sensor node pinged 34s ago via LoRaWAN Gateway. Packet loss: 0.0%, Signal: ${triggerSensor.signal} dBm.
            </div>
          </div>
        `;
      }

      return `
        <div class="drawer-panel">
          <div class="drawer-header">
            <div class="drawer-title-group">
              <span class="hazard-tag ${hazardTag}">${alert.hazard}</span>
              <div class="drawer-title">${alert.title}</div>
            </div>
            <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Drawer">&times;</button>
          </div>

          <div class="drawer-tabs">
            <button class="drawer-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
            <button class="drawer-tab-btn ${this.activeTab === 'ai' ? 'active' : ''}" data-tab="ai">AI Explanation</button>
            <button class="drawer-tab-btn ${this.activeTab === 'evidence' ? 'active' : ''}" data-tab="evidence">Sensor Evidence</button>
          </div>

          <div class="drawer-body">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 10px;">
              <div style="font-size: 12px; color: var(--color-text-muted);">
                📍 Location: <strong>${alert.location}</strong> • ⏱️ ${alert.timeAgo}
              </div>
              <span class="status-badge ${riskCls}">${alert.severity}</span>
            </div>

            ${tabHTML}
          </div>

          <div class="drawer-footer">
            <button class="btn-secondary" id="drawer-btn-view-map">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              <span>View On Risk Map</span>
            </button>
            <button class="btn-primary" id="drawer-btn-dispatch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17h4V5H10zM14 17h6V9h-6zM4 17h6V13H4z"></path></svg>
              <span>Dispatch Emergency Unit</span>
            </button>
          </div>
        </div>
      `;
    };

    const render = () => {
      this.drawerContainer.innerHTML = buildContent();
      this.drawerContainer.classList.remove('hidden');
      this.drawerContainer.setAttribute('aria-hidden', 'false');

      // Attach handlers
      this.drawerContainer.querySelector('#drawer-close-btn').addEventListener('click', () => this.closeDrawer());

      this.drawerContainer.querySelectorAll('.drawer-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.activeTab = btn.getAttribute('data-tab');
          render();
        });
      });

      this.drawerContainer.querySelector('#drawer-btn-view-map').addEventListener('click', () => {
        this.closeDrawer();
        store.setView('risk-map');
      });

      this.drawerContainer.querySelector('#drawer-btn-dispatch').addEventListener('click', () => {
        this.closeDrawer();
        store.setView('incidents');
      });
    };

    render();
  }

  // 2. Sensor Diagnostics Drawer
  renderSensorDrawer(sensor) {
    if (!this.drawerContainer) return;
    const riskCls = getRiskClass(sensor.risk);
    const hazardTag = getHazardTagClass(sensor.type);

    this.drawerContainer.innerHTML = `
      <div class="drawer-panel">
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="hazard-tag ${hazardTag}">${sensor.type}</span>
            <div class="drawer-title">Sensor Node: ${sensor.id}</div>
          </div>
          <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Drawer">&times;</button>
        </div>

        <div class="drawer-body">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 12px;">
            <div>
              <h3 style="font-size: 15px; font-weight: 700; color: var(--color-text-primary);">${sensor.name}</h3>
              <div style="font-size: 12px; color: var(--color-text-muted);">Location: ${sensor.location} • Lat ${sensor.lat}, Lng ${sensor.lng}</div>
            </div>
            <span class="status-badge ${riskCls}">${sensor.risk} Risk</span>
          </div>

          <!-- 4-Stat Telemetry Box -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="report-stat-box">
              <div class="report-stat-num" style="color: ${sensor.waterLevel > 3.2 ? 'var(--color-critical)' : 'var(--color-primary-dark)'};">
                ${sensor.waterLevel ? sensor.waterLevel + ' m' : 'N/A'}
              </div>
              <div class="report-stat-label">Water Gauge Level</div>
            </div>

            <div class="report-stat-box">
              <div class="report-stat-num">${sensor.temp}°C</div>
              <div class="report-stat-label">Ambient Temperature</div>
            </div>

            <div class="report-stat-box">
              <div class="report-stat-num" style="color: ${sensor.pm25 > 150 ? 'var(--hazard-fire)' : 'var(--color-text-primary)'};">${sensor.pm25} µg/m³</div>
              <div class="report-stat-label">Particulate PM2.5</div>
            </div>

            <div class="report-stat-box">
              <div class="report-stat-num" style="color: var(--color-success);">${sensor.battery}%</div>
              <div class="report-stat-label">Battery Health</div>
            </div>
          </div>

          <!-- Live Oscillograph Canvas -->
          <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 8px;">
              Live Oscillograph Telemetry Stream (Past 60s):
            </div>
            <div style="height: 120px; position: relative;">
              <canvas id="drawer-sensor-oscillograph" style="width: 100%; height: 100%;"></canvas>
            </div>
          </div>

          <!-- Diagnostics Metadata -->
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; background: var(--color-surface-soft); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-secondary);">Firmware Architecture:</span>
              <strong style="font-family: var(--font-mono);">v4.8.2-edge-lorawan</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-secondary);">Mesh Gateway Connection:</span>
              <strong style="color: var(--color-success);">ONLINE (${sensor.signal} dBm)</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-secondary);">Ingestion Cycle:</span>
              <span>Every 3,000 ms (Continuous)</span>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="btn-secondary" id="drawer-sensor-focus-btn">
            <span>Focus on Risk Map</span>
          </button>
          <button class="btn-primary" id="drawer-sensor-done-btn">
            <span>Close Diagnostics</span>
          </button>
        </div>
      </div>
    `;

    this.drawerContainer.classList.remove('hidden');
    this.drawerContainer.setAttribute('aria-hidden', 'false');

    this.drawerContainer.querySelector('#drawer-close-btn').addEventListener('click', () => this.closeDrawer());
    this.drawerContainer.querySelector('#drawer-sensor-done-btn').addEventListener('click', () => this.closeDrawer());
    this.drawerContainer.querySelector('#drawer-sensor-focus-btn').addEventListener('click', () => {
      this.closeDrawer();
      store.setView('risk-map');
    });

    setTimeout(() => {
      const canvas = this.drawerContainer.querySelector('#drawer-sensor-oscillograph');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.parentElement.clientWidth;
        const h = 120;
        canvas.width = w;
        canvas.height = h;

        ctx.strokeStyle = '#1E4D78';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (let x = 0; x < w; x += 8) {
          const y = (h / 2) + Math.sin(x * 0.08) * 22 + (Math.random() * 8 - 4);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }, 50);
  }

  // 3. AI Predictive Intelligence & Scenario Simulation Drawer
  renderAIDrawer(hazard = 'Flood') {
    if (!this.drawerContainer) return;
    const state = store.getState();

    let simulatedRain = 84;
    let simulatedDam = 320;
    let simulatedSoil = 89;

    const calculateRisk = () => {
      const base = (simulatedRain * 0.42) + (simulatedDam * 0.08) + (simulatedSoil * 0.32);
      return Math.min(99, Math.max(15, Math.round(base)));
    };

    const render = () => {
      const dynamicScore = calculateRisk();
      const dynamicLevel = dynamicScore >= 80 ? 'Critical' : dynamicScore >= 60 ? 'High' : dynamicScore >= 40 ? 'Moderate' : 'Low';

      this.drawerContainer.innerHTML = `
        <div class="drawer-panel">
          <div class="drawer-header">
            <div class="drawer-title-group">
              <span class="hazard-tag flood">${hazard}</span>
              <div class="drawer-title">AI Predictive Intelligence & Simulation</div>
            </div>
            <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Drawer">&times;</button>
          </div>

          <div class="drawer-body">
            <div style="background: var(--color-primary-light); border: 1px solid #BFD9F0; border-radius: var(--radius-md); padding: 14px; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">AI Confidence Score</div>
                <div style="font-size: 22px; font-weight: 800; color: var(--color-primary-dark);">${state.aiPrediction.riskScore}% Probability</div>
              </div>
              <span class="status-badge ${getRiskClass(state.aiPrediction.riskLevel)}">${state.aiPrediction.riskLevel}</span>
            </div>

            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; font-size: 13px; color: var(--color-text-primary);">
              🔮 <strong>AI Forecast:</strong> ${state.aiPrediction.predictionText}
            </div>

            <!-- Interactive What-If Simulator -->
            <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; background: #FFFFFF;">
              <div style="font-size: 12px; font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase; margin-bottom: 12px;">
                🎛️ "What-If" Scenario Simulator (Live Neural Recalculation):
              </div>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                    <span style="color: var(--color-text-secondary);">Precipitation Intensity:</span>
                    <strong id="sim-val-rain">${simulatedRain} mm/hr</strong>
                  </div>
                  <input type="range" min="0" max="150" value="${simulatedRain}" id="sim-slider-rain" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                    <span style="color: var(--color-text-secondary);">Upstream Dam Release:</span>
                    <strong id="sim-val-dam">${simulatedDam} m³/s</strong>
                  </div>
                  <input type="range" min="0" max="800" value="${simulatedDam}" id="sim-slider-dam" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                    <span style="color: var(--color-text-secondary);">Soil Saturation Level:</span>
                    <strong id="sim-val-soil">${simulatedSoil}%</strong>
                  </div>
                  <input type="range" min="20" max="100" value="${simulatedSoil}" id="sim-slider-soil" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 12px; display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                  <div>
                    <div style="font-size: 10px; color: var(--color-text-muted); text-transform: uppercase;">Recalculated AI Risk</div>
                    <div style="font-size: 16px; font-weight: 800; color: var(--color-primary-dark);">${dynamicScore}% Risk Score</div>
                  </div>
                  <span class="status-badge ${getRiskClass(dynamicLevel)}">${dynamicLevel}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-footer">
            <button class="btn-primary" id="drawer-ai-close-btn">
              <span>Apply & Close</span>
            </button>
          </div>
        </div>
      `;

      this.drawerContainer.classList.remove('hidden');
      this.drawerContainer.setAttribute('aria-hidden', 'false');

      this.drawerContainer.querySelector('#drawer-close-btn').addEventListener('click', () => this.closeDrawer());
      this.drawerContainer.querySelector('#drawer-ai-close-btn').addEventListener('click', () => this.closeDrawer());

      const rainSlider = this.drawerContainer.querySelector('#sim-slider-rain');
      const damSlider = this.drawerContainer.querySelector('#sim-slider-dam');
      const soilSlider = this.drawerContainer.querySelector('#sim-slider-soil');

      const updateSliders = () => {
        simulatedRain = Number(rainSlider.value);
        simulatedDam = Number(damSlider.value);
        simulatedSoil = Number(soilSlider.value);
        render();
      };

      rainSlider.addEventListener('input', updateSliders);
      damSlider.addEventListener('input', updateSliders);
      soilSlider.addEventListener('input', updateSliders);
    };

    render();
  }

  // 4. Staff Services & Operational Toolkit Drawer
  renderStaffDrawer() {
    if (!this.drawerContainer) return;

    this.drawerContainer.innerHTML = `
      <div class="drawer-panel">
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="status-badge info">OPERATIONAL PORTAL</span>
            <div class="drawer-title">Staff Services & Emergency Directory</div>
          </div>
          <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Drawer">&times;</button>
        </div>

        <div class="drawer-body">
          <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">
              📻 Tactical Radio Frequencies (VHF/UHF):
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
              <div><span>EOC Primary:</span> <strong>154.600 MHz</strong></div>
              <div><span>NDRF Tactical:</span> <strong>148.250 MHz</strong></div>
              <div><span>SDRF Channel 2:</span> <strong>162.400 MHz</strong></div>
              <div><span>Aviation Rescue:</span> <strong>121.500 MHz</strong></div>
            </div>
          </div>

          <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 8px;">
              📋 Standard Operating Guidelines (SOG):
            </div>
            <ul style="padding-left: 18px; font-size: 12px; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 6px;">
              <li>Flash Flood Protocol (Rev 4.2): Trigger cell broadcast when gauge rise exceeds +0.3m/hr.</li>
              <li>Wildfire Perimeter Defense: Establish 50m fuel-break buffer in dry timber sectors.</li>
              <li>Air Quality Inversion: Issue advisory to schools & hospitals upon PM2.5 > 150 µg/m³.</li>
            </ul>
          </div>

          <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 6px;">
              🏆 Response Team Recognition (Mock Demo):
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary);">
              NDRF Unit 09 commended for rapid flood barrier deployment in Vythiri Gorge within 18 minutes of trigger.
            </p>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="btn-primary" id="drawer-staff-done-btn">
            <span>Done</span>
          </button>
        </div>
      </div>
    `;

    this.drawerContainer.classList.remove('hidden');
    this.drawerContainer.setAttribute('aria-hidden', 'false');

    this.drawerContainer.querySelector('#drawer-close-btn').addEventListener('click', () => this.closeDrawer());
    this.drawerContainer.querySelector('#drawer-staff-done-btn').addEventListener('click', () => this.closeDrawer());
  }
}

export const drawerManager = new DrawerManager();
window.drawerManager = drawerManager;
