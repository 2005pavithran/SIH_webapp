// AI Predictive Risk Intelligence & Explainable AI (XAI) Component

import { store } from '../state/store.js';
import { getRiskClass, getHazardTagClass } from '../utils/formatters.js';

export function createAIPredictionView() {
  const container = document.createElement('div');
  container.className = 'ai-prediction-view animated-fade';

  let simulatedRainfall = 84;
  let simulatedDamRelease = 320;
  let simulatedSoilSat = 89;

  function calculateDynamicRisk() {
    const base = (simulatedRainfall * 0.42) + (simulatedDamRelease * 0.08) + (simulatedSoilSat * 0.32);
    return Math.min(99, Math.max(15, Math.round(base)));
  }

  function render() {
    const state = store.getState();
    const dynamicScore = calculateDynamicRisk();
    const dynamicLevel = dynamicScore >= 80 ? 'Critical' : dynamicScore >= 60 ? 'High' : dynamicScore >= 40 ? 'Moderate' : 'Low';

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🤖 AI PREDICTIVE RISK INTELLIGENCE</span>
            <span class="status-badge critical">XAI NEURAL ENSEMBLE</span>
          </h1>
          <p class="view-desc-sub">Explainable AI feature attribution (SHAP), multi-horizon risk trajectories, and real-time parameter scenario simulation</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-primary" onclick="window.appStore.setView('incidents')">
            <span>Escalate Pre-Emptive SOP</span>
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Left: Deep AI Risk Prediction & Attribution -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🌊 Target Threat: Flash Flood Inundation Index</span>
            </div>
            <span class="ai-confidence-pill">CONFIDENCE: 94.6%</span>
          </div>

          <div class="gov-card-body">
            <div style="background: var(--color-primary-light); border: 1px solid #BFD9F0; border-radius: var(--radius-md); padding: 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: var(--shadow-sm);">
                  🌊
                </div>
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-secondary); font-weight: 700;">Monitored Catchment</div>
                  <div style="font-size: 18px; font-weight: 800; color: var(--color-primary-dark);">District X • Vythiri Basin</div>
                  <div style="font-size: 12px; color: var(--color-primary); font-weight: 600;">Prediction Horizon: Next 3 to 6 Hours</div>
                </div>
              </div>

              <div style="text-align: right;">
                <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase;">Current AI Risk</div>
                <div style="font-family: var(--font-display); font-size: 34px; font-weight: 800; color: var(--color-critical); line-height: 1;">${state.aiPrediction.riskScore}%</div>
                <span class="status-badge ${getRiskClass(state.aiPrediction.riskLevel)}" style="margin-top: 4px;">
                  ${state.aiPrediction.riskLevel}
                </span>
              </div>
            </div>

            <!-- Summary Box -->
            <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px 16px; font-size: 13px; color: var(--color-text-primary); margin-bottom: 20px;">
              🔮 <strong>AI Forecast Summary:</strong> ${state.aiPrediction.predictionText}
            </div>

            <!-- SHAP Explainability Breakdown -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; font-weight: 700; color: var(--color-text-primary); text-transform: uppercase;">
                  Explainable AI (SHAP) Feature Importance:
                </span>
                <span style="font-size: 11px; color: var(--color-text-muted); font-family: var(--font-mono);">Sum = 100%</span>
              </div>

              ${state.aiPrediction.factors.map(f => `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="font-weight: 600; color: var(--color-text-primary);">${f.name}</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-primary);">${f.value} • <strong>${f.weight}% Weight</strong></span>
                  </div>
                  <div style="height: 6px; background: var(--color-surface-muted); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${f.weight * 2.5}%; height: 100%; background: ${f.impact === 'critical' ? 'var(--color-critical)' : 'var(--color-primary)'}; border-radius: 3px;"></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 20px; padding: 12px; background: var(--color-surface-soft); border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 12px; color: var(--color-text-secondary);">
              <strong>💡 Model Explainability Rationale:</strong> The recurrent LSTM ensemble weights upstream hydro-level (Gauge N-003) as the most critical trigger (+38%), compounded by heavy monsoon precipitation rate (84 mm/hr) exceeding the catchment absorption capacity.
            </div>
          </div>
        </div>

        <!-- Right: Real-time "What-If" Scenario Simulator -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="gov-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>🎛️ "What-If" Scenario Simulator</span>
              </div>
              <span class="status-badge info">INTERACTIVE</span>
            </div>

            <div class="gov-card-body">
              <p style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 16px;">
                Adjust environmental parameters to see live AI neural model risk recalculation in real-time:
              </p>

              <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Slider 1 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌧️ Catchment Rainfall:</span>
                    <strong style="font-family: var(--font-mono); color: var(--color-primary);" id="slider-val-rain">${simulatedRainfall} mm/hr</strong>
                  </div>
                  <input type="range" min="0" max="150" value="${simulatedRainfall}" id="slider-rain" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <!-- Slider 2 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌊 Upstream Dam Release:</span>
                    <strong style="font-family: var(--font-mono); color: var(--color-primary);" id="slider-val-dam">${simulatedDamRelease} m³/s</strong>
                  </div>
                  <input type="range" min="0" max="800" value="${simulatedDamRelease}" id="slider-dam" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <!-- Slider 3 -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌱 Soil Saturation:</span>
                    <strong style="font-family: var(--font-mono); color: var(--color-primary);" id="slider-val-soil">${simulatedSoilSat}%</strong>
                  </div>
                  <input type="range" min="20" max="100" value="${simulatedSoilSat}" id="slider-soil" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <!-- Live Output Box -->
                <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                  <div>
                    <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase;">Simulated AI Flood Risk</div>
                    <div style="font-size: 18px; font-weight: 800; color: var(--color-primary-dark);" id="simulated-risk-output">${dynamicScore}% Risk Score</div>
                  </div>
                  <span class="status-badge ${getRiskClass(dynamicLevel)}" id="simulated-badge-output">
                    ${dynamicLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Multi-Hazard Cross Risk Matrix -->
          <div class="gov-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>🌐 Multi-Hazard Cross Correlation</span>
              </div>
            </div>
            <div class="gov-card-body" style="padding: 14px 18px;">
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🌊 Flood Inundation (District X)</span>
                  <span class="status-badge critical">87% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>⛰️ Slope Creep (Meppadi)</span>
                  <span class="status-badge high">64% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🔥 Forest Fire (Zone Y)</span>
                  <span class="status-badge moderate">34% RISK</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>🌫️ Urban AQI (District Center Z)</span>
                  <span class="status-badge high">58% RISK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Sliders
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
        badgeEl.className = `status-badge ${getRiskClass(level)}`;
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
