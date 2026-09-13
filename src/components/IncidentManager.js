// Emergency Incident Management & SOP Component (Bright Government Standard)

import { store } from '../state/store.js';
import { getRiskClass, getHazardTagClass } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createIncidentManagerView() {
  const container = document.createElement('div');
  container.className = 'incident-manager-view animated-fade';

  function render() {
    const state = store.getState();
    const activeMissions = state.incidents.filter(i => i.status === 'ACTIVE').length;

    container.innerHTML = `
      <div class="view-header-row">
        <div>
          <h1 class="view-title-main">
            <span>🚑 EMERGENCY INCIDENT MANAGEMENT & SOP</span>
            <span class="status-badge critical">${activeMissions} ACTIVE DISASTER MISSIONS</span>
          </h1>
          <p class="view-desc-sub">Standard Operating Procedure (SOP) response workflows, inter-agency tactical coordination, and team deployments</p>
        </div>
        <div class="view-actions-group">
          <button class="btn-primary" id="btn-create-new-incident">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Log Emergency Incident</span>
          </button>
        </div>
      </div>

      <!-- Emergency Workflow Reference Banner -->
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px 18px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; overflow-x: auto; gap: 12px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; white-space: nowrap;">SOP Protocol:</div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; white-space: nowrap;">
          <span class="status-badge info">1. Sensor Detection</span>
          <span>→</span>
          <span class="status-badge info">2. AI Alert</span>
          <span>→</span>
          <span class="status-badge info">3. Authority Acknowledges</span>
          <span>→</span>
          <span class="status-badge critical">4. Incident Created</span>
          <span>→</span>
          <span class="status-badge warning">5. Team Dispatch</span>
          <span>→</span>
          <span class="status-badge success">6. Resolution</span>
        </div>
      </div>

      <!-- Incidents List -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${state.incidents.map(inc => {
          const riskCls = getRiskClass(inc.severity);
          const hazardTag = getHazardTagClass(inc.hazard);
          const completedCount = inc.sop.filter(s => s.done).length;
          const totalCount = inc.sop.length;
          const progressPercent = Math.round((completedCount / totalCount) * 100);

          return `
            <div class="gov-card" style="border-left: 5px solid ${inc.severity === 'Critical' ? 'var(--color-critical)' : 'var(--color-warning)'};">
              <div class="gov-card-header" style="padding: 16px 20px;">
                <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="hazard-tag ${hazardTag}">${inc.hazard}</span>
                      <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--color-primary-dark);">INCIDENT #${inc.id}</span>
                      <span class="status-badge ${riskCls}">${inc.severity}</span>
                      <span class="status-badge ${inc.status === 'ACTIVE' ? 'critical' : 'success'}">
                        ${inc.status}
                      </span>
                    </div>
                    <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
                      ${inc.title} • Detected at <strong>${inc.detectedTime}</strong>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn-secondary" style="font-size: 12px;" onclick="window.appStore.openIncidentModal('${inc.id}')">
                    Tactical Dispatch
                  </button>
                  <button class="btn-primary" style="font-size: 12px;" onclick="window.appStore.openIncidentModal('${inc.id}')">
                    Assign Response Team
                  </button>
                </div>
              </div>

              <div class="gov-card-body" style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 24px;">
                  <!-- Incident Metadata Card -->
                  <div style="background: var(--color-surface-soft); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--color-text-secondary);">Target Hazard:</span>
                        <strong style="color: var(--color-primary);">${inc.hazard}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--color-text-secondary);">Geographic Sector:</span>
                        <strong>${inc.location}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--color-text-secondary);">Affected Area:</span>
                        <strong style="font-family: var(--font-mono); color: var(--color-critical);">${inc.affectedArea}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--color-text-secondary);">Assigned Response Unit:</span>
                        <strong style="color: var(--color-teal);">${inc.assignedTeam || 'Pending Deployment'}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
                        <span style="color: var(--color-text-secondary);">SOP Execution:</span>
                        <strong style="font-family: var(--font-mono); color: var(--color-success);">${completedCount} / ${totalCount} (${progressPercent}%)</strong>
                      </div>
                    </div>

                    <div style="margin-top: 14px;">
                      <div style="height: 8px; background: var(--color-surface-muted); border-radius: var(--radius-pill); overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #1E4D78, #287A4B); border-radius: var(--radius-pill); transition: width 0.3s ease;"></div>
                      </div>
                    </div>
                  </div>

                  <!-- SOP Checklist -->
                  <div class="sop-timeline-container">
                    <div style="font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
                      Standard Operating Procedure (SOP) Execution Checklist:
                    </div>
                    ${inc.sop.map(step => `
                      <div class="sop-step-card ${step.done ? 'completed' : ''}" data-inc-id="${inc.id}" data-step-id="${step.id}">
                        <div class="sop-step-left">
                          <div class="sop-checkbox-btn" data-inc-id="${inc.id}" data-step-id="${step.id}" title="Click to toggle step completion">
                            ${step.done ? '✓' : ''}
                          </div>
                          <span class="sop-step-text">
                            ${step.label}
                          </span>
                        </div>
                        <span class="sop-step-time">${step.time}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Interactive Checkboxes
    container.querySelectorAll('.sop-checkbox-btn, .sop-step-card').forEach(el => {
      el.addEventListener('click', (e) => {
        const incId = el.getAttribute('data-inc-id');
        const stepId = el.getAttribute('data-step-id');
        if (incId && stepId) {
          store.toggleSOPStep(incId, stepId);
          showToast(`SOP step updated for Incident #${incId}`, 'success');
        }
      });
    });

    container.querySelector('#btn-create-new-incident').addEventListener('click', () => {
      showToast('Incident logged. Emergency Operations Center notified.', 'info');
    });
  }

  render();

  store.subscribe((state, event) => {
    if (event === 'sop_update' || event === 'team_assigned') {
      render();
    }
  });

  return {
    element: container,
    destroy: () => {}
  };
}
