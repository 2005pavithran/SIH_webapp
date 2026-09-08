// AI Risk Intelligence & Explainable AI (XAI) Component

import { store } from '../state/store.js';
import { getRiskClass } from '../utils/formatters.js';

export function createAIPredictionView() {
  const container = document.createElement('div');
  container.className = 'ai-prediction-view animated-fade';

  let simulatedRainfall = 84;
  let simulatedDamRelease = 320;
  let simulatedSoilSat = 89;

  function calculateDynamicRisk() {
    // Multi-variate heuristic simulating neural network inference
    const base = (simulatedRainfall * 0.42) + (simulatedDamRelease * 0.08) + (simulatedSoilSat * 0.32);
    return Math.min(99, Math.max(15, Math.round(base)));
  }

  function render() {
    const state = store.getState();
    const dynamicScore = calculateDynamicRisk();
    const dynamicLevel = dynamicScore >= 80 ? 'Critical' : dynamicScore >= 60 ? 'High' : dynamicScore >= 40 ? 'Moderate' : 'Low';

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>🤖 AI PREDICTIVE RISK INTELLIGENCE</span>
            <span class="risk-badge critical">XAI NEURAL ENSEMBLE</span>
          </h1>
          <p>Explainable AI feature attribution, multi-horizon risk trajectories, and real-time scenario simulation</p>
        </div>
        <div class="view-actions">
          <button class="btn-primary" onclick="window.appStore.setView('incidents')">
            <span>Escalate Pre-Emptive SOP</span>
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Left: Deep AI Risk Prediction & Attribution -->
        <div class="command-card">
          <div class="command-card-header">
            <div class="command-card-title">
              <span>🌊 PRIMARY TARGET: FLASH FLOOD RISK INTELLIGENCE</span>
            </div>
            <span class="ai-confidence-pill">CONFIDENCE: 94.6%</span>
          </div>

          <div class="command-card-body">
            <div class="ai-hero-box" style="margin-bottom: 20px;">
              <div class="ai-hero-hazard">
                <div class="hazard-icon-circle" style="width: 56px; height: 56px; font-size: 28px;">🌊</div>
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Target Catchment</div>
                  <div style="font-size: 18px; font-weight: 800; color: #fff;">District X • Vythiri Basin</div>
                  <div style="font-size: 12px; color: var(--accent-cyan); font-weight: 600;">Prediction Horizon: Next 3 to 6 Hours</div>
                </div>
              </div>

              <div class="ai-risk-score-display">
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Current AI Risk</div>
                <div class="ai-risk-percent" style="font-size: 38px;">${state.aiPrediction.riskScore}%</div>
                <span class="risk-badge ${getRiskClass(state.aiPrediction.riskLevel)}" style="font-size: 12px; padding: 3px 8px;">
                  ${state.aiPrediction.riskLevel.toUpperCase()} 🔴
                </span>
              </div>
            </div>

            <!-- Prediction Summary Box -->
            <div class="ai-prediction-summary" style="margin-bottom: 20px; font-size: 13px;">
              <span style="font-size: 20px;">⚡</span>
              <div>
                <strong>AI Forecast Summary:</strong> ${state.aiPrediction.predictionText}
              </div>
            </div>

            <!-- SHAP Explainability Breakdown -->
            <div class="attribution-factors">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
                  Explainable AI (SHAP) Feature Importance:
                </span>
                <span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">Sum = 100%</span>
              </div>

              ${state.aiPrediction.factors.map(f => `
                <div class="factor-item">
                  <div class="factor-meta">
                    <span class="factor-name" style="font-size: 12px;">${f.name}</span>
                    <span class="factor-val" style="font-size: 12px;">${f.value} • <strong>${f.weight}% Weight</strong></span>
                  </div>
                  <div class="factor-bar-bg" style="height: 8px;">
                    <div class="factor-bar-fill ${f.impact === 'critical' ? 'crit' : ''}" style="width: ${f.weight * 2.5}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 12px; color: var(--text-secondary);">
              <strong>💡 Model Explainability Rationale:</strong> The recurrent LSTM ensemble weights upstream hydro-level (Gauge N-003) as the most critical trigger (+38%), compounded by heavy monsoon precipitation rate (84 mm/hr) exceeding the catchment absorption capacity.
            </div>
          </div>
        </div>

        <!-- Right: Real-time "What-If" Scenario Simulator -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="command-card">
            <div class="command-card-header">
              <div class="command-card-title">
                <span>🎛️ "WHAT-IF" SCENARIO SIMULATOR</span>
              </div>
              <span class="risk-badge" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border-color: var(--accent-cyan);">
                INTERACTIVE
              </span>
            </div>

            <div class="command-card-body">
              <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
                Adjust environmental parameters to see live AI neural model risk recalculation in real-time:
              </p>

              <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Slider 1 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--text-secondary);">🌧️ Catchment Rainfall Intensity:</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;" id="slider-val-rain">${simulatedRainfall} mm/hr</span>
                  </div>
                  <input type="range" min="0" max="150" value="${simulatedRainfall}" id="slider-rain" style="width: 100%; accent-color: var(--accent-blue); cursor: pointer;">
                </div>

                <!-- Slider 2 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--text-secondary);">🌊 Upstream Dam Outflow:</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;" id="slider-val-dam">${simulatedDamRelease} m³/s</span>
                  </div>
                  <input type="range" min="0" max="800" value="${simulatedDamRelease}" id="slider-dam" style="width: 100%; accent-color: var(--accent-blue); cursor: pointer;">
                </div>

                <!-- Slider 3 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--text-secondary);">🌱 Soil Pore Saturation:</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;" id="slider-val-soil">${simulatedSoilSat}%</span>
                  </div>
                  <input type="range" min="20" max="100" value="${simulatedSoilSat}" id="slider-soil" style="width: 100%; accent-color: var(--accent-blue); cursor: pointer;">
                </div>

                <!-- Live Recalculated Output Box -->
                <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: 8px; padding: 14px; display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                  <div>
                    <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Simulated AI Flood Risk</div>
                    <div style="font-size: 18px; font-weight: 800; color: #fff;" id="simulated-risk-output">${dynamicScore}% Risk Score</div>
                  </div>
                  <span class="risk-badge ${getRiskClass(dynamicLevel)}" id="simulated-badge-output">
                    ${dynamicLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Multi-Hazard Cross Correlation -->
          <div class="command-card">
            <div class="command-card-header">
              <div class="command-card-title">
                <span>🌐 MULTI-HAZARD CROSS-RISK MATRIX</span>
              </div>
            </div>
            <div class="command-card-body" style="padding: 12px 18px;">
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🌊 Flood Inundation (District X)</span>
                  <span class="risk-badge critical">87% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>⛰️ Slope Creep / Landslide (Meppadi)</span>
                  <span class="risk-badge high">64% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🔥 Forest Fire (Zone Y)</span>
                  <span class="risk-badge moderate">34% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🌫️ Urban AQI Inversion (District Center)</span>
                  <span class="risk-badge high">58% RISK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Interactive Slider Listeners
    const rainSlider = container.querySelector('#slider-rain');
    const damSlider = container.querySelector('#slider-dam');
    const soilSlider = container.querySelector('#slider-soil');

    function updateSimulationDisplay() {
      simulatedRainfall = Number(rainSlider.value);
      simulatedDamRelease = Number(damSlider.value);
      simulatedSoilSat = Number(soilSlider.value);

      container.querySelector('#slider-val-rain').textContent = `${simulatedRainfall} mm/hr`;
      container.querySelector('#slider-val-dam').textContent = `${simulatedDamRelease} m³/s`;
      container.querySelector('#slider-val-soil').textContent = `${simulatedSoilSat}%`;

      const score = calculateDynamicRisk();
      const level = score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Moderate' : 'Low';

      const outEl = container.querySelector('#simulated-risk-output');
      const badgeEl = container.querySelector('#simulated-badge-output');

      if (outEl) outEl.textContent = `${score}% Risk Score`;
      if (badgeEl) {
        badgeEl.className = `risk-badge ${getRiskClass(level)}`;
        badgeEl.textContent = level.toUpperCase();
      }
    }

    rainSlider.addEventListener('input', updateSimulationDisplay);
    damSlider.addEventListener('input', updateSimulationDisplay);
    soilSlider.addEventListener('input', updateSimulationDisplay);
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
