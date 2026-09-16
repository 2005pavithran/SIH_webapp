// AI Predictive Risk Intelligence & Explainable AI (XAI) Component (State Scoped)

import { store } from '../state/store.js';
import { getRiskClass } from '../utils/formatters.js';

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
    const stateName = state.loggedInState || 'Tamil Nadu';
    const stateConfig = store.getAuthorizedStateConfig();
    const dynamicScore = calculateDynamicRisk();
    const dynamicLevel = dynamicScore >= 80 ? 'Critical' : dynamicScore >= 60 ? 'High' : dynamicScore >= 40 ? 'Moderate' : 'Low';

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🤖 ${stateName.toUpperCase()} AI PREDICTIVE RISK INTELLIGENCE</span>
            <span class="status-badge critical">XAI NEURAL ENSEMBLE</span>
          </h1>
          <p class="view-desc-sub">Explainable AI feature attribution (SHAP), multi-horizon risk trajectories, and decision-support simulation for ${stateName}</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-primary" onclick="window.location.hash = '#incidents'">
            <span>Escalate Pre-Emptive SOP</span>
          </button>
        </div>
      </div>

      <!-- Critical Architecture Notice: Local Deterministic Safety Rule Independent of Cloud AI -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; font-size: 12px;">
        <span style="font-size: 20px;">🛡️</span>
        <div>
          <strong style="color: var(--color-primary-dark);">CRITICAL SAFETY ARCHITECTURE:</strong>
          <span style="color: var(--color-text-secondary); margin-left: 4px;">
            AI models serve exclusively as <strong>decision-support analytics</strong>. Local edge sensor nodes execute deterministic threshold alarms autonomously, ensuring immediate warning sirens trigger without dependence on cloud connectivity or AI availability.
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Left: Deep AI Risk Prediction & Attribution -->
        <div class="gov-card">
          <div class="gov-card-header">
            <div class="gov-card-title">
              <span>🌊 Target Threat: ${state.aiPrediction.hazard}</span>
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
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--color-text-secondary); font-weight: 700;">Monitored Jurisdiction</div>
                  <div style="font-size: 18px; font-weight: 800; color: var(--color-primary-dark);">${stateName} • ${stateConfig.districts[0]?.name || 'Primary Corridor'}</div>
                  <div style="font-size: 12px; color: var(--color-primary); font-weight: 600;">Prediction Horizon: Next 3 to 6 Hours</div>
                </div>
              </div>

              <div style="text-align: right;">
                <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase;">State AI Index</div>
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
              <strong>💡 Model Rationale:</strong> The recurrent LSTM network correlates catchment precipitation rate and edge sensor telemetry against historical 10-year monsoon records in ${stateName}.
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
              <span class="status-badge info">DECISION SUPPORT</span>
            </div>

            <div class="gov-card-body">
              <p style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 16px;">
                Simulate environmental parameter shifts to observe model trajectory recalculation:
              </p>

              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌧️ Catchment Precipitation:</span>
                    <strong style="font-family: var(--font-mono); color: var(--color-primary);" id="slider-val-rain">${simulatedRainfall} mm/hr</strong>
                  </div>
                  <input type="range" min="0" max="150" value="${simulatedRainfall}" id="slider-rain" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌊 Upstream Sluice Discharge:</span>
                    <strong style="font-family: var(--font-mono); color: var(--color-primary);" id="slider-val-dam">${simulatedDamRelease} m³/s</strong>
                  </div>
                  <input type="range" min="0" max="800" value="${simulatedDamRelease}" id="slider-dam" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;">
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                    <span style="color: var(--color-text-secondary);">🌱 Catchment Soil Saturation:</span>
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

          <!-- Multi-District Cross Risk -->
          <div class="gov-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>🌐 Monitored Sector Correlation (${stateName})</span>
              </div>
            </div>
            <div class="gov-card-body" style="padding: 14px 18px;">
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                ${stateConfig.districts.map((d, i) => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>📍 ${d.name}</span>
                    <span class="status-badge ${i === 0 ? 'critical' : i === 1 ? 'high' : 'moderate'}">
                      ${i === 0 ? '84% RISK' : i === 1 ? '68% RISK' : '42% RISK'}
                    </span>
                  </div>
                `).join('')}
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

    rainSlider?.addEventListener('input', updateSimulationDisplay);
    damSlider?.addEventListener('input', updateSimulationDisplay);
    soilSlider?.addEventListener('input', updateSimulationDisplay);
  }

  render();

  return {
    element: container,
    destroy: () => {}
  };
}
