// Incident Response & SOP Management Component

import { store } from '../state/store.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createIncidentManagerView() {
  const container = document.createElement('div');
  container.className = 'incident-manager-view animated-fade';

  function render() {
    const state = store.getState();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <span>🚑 EMERGENCY INCIDENT MANAGEMENT</span>
            <span class="risk-badge critical">${state.incidents.filter(i => i.status === 'ACTIVE').length} ACTIVE MISSIONS</span>
          </h1>
          <p>Standard Operating Procedure (SOP) response workflows, tactical team deployments, and inter-agency coordination</p>
        </div>
        <div class="view-actions">
          <button class="btn-primary" id="btn-create-new-incident">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Log Emergency Incident</span>
          </button>
        </div>
      </div>

      <!-- Incidents Grid -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
        ${state.incidents.map(inc => {
          const riskCls = getRiskClass(inc.severity);
          const completedCount = inc.sop.filter(s => s.done).length;
          const totalCount = inc.sop.length;
          const progressPercent = Math.round((completedCount / totalCount) * 100);

          return `
            <div class="command-card" style="border-left: 6px solid var(--risk-${riskCls === 'critical' ? 'crit' : riskCls === 'high' ? 'high' : 'mod'});">
              <div class="command-card-header" style="padding: 16px 20px;">
                <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                  <span style="font-size: 20px;">${getHazardIcon(inc.hazard)}</span>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: #fff;">INCIDENT #${inc.id}</span>
                      <span class="risk-badge ${riskCls}">${inc.severity}</span>
                      <span class="risk-badge" style="background: ${inc.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}; color: ${inc.status === 'ACTIVE' ? 'var(--risk-crit)' : 'var(--risk-low)'};">
                        ${inc.status}
                      </span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                      ${inc.title} • Detected at ${inc.detectedTime}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <button class="btn-secondary" style="font-size: 12px;" onclick="window.appStore.openIncidentModal('${inc.id}')">
                    Tactical Dispatch
                  </button>
                  <button class="btn-primary" style="font-size: 12px;" onclick="window.appStore.openIncidentModal('${inc.id}')">
                    ASSIGN RESPONSE TEAM
                  </button>
                </div>
              </div>

              <div class="command-card-body" style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 24px;">
                  <!-- Incident Metadata Card -->
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--text-muted);">Hazard Classification:</span>
                        <span style="font-weight: 700; color: #fff;">${getHazardIcon(inc.hazard)} ${inc.hazard}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--text-muted);">Location & Zone:</span>
                        <span style="font-weight: 600; color: #fff;">${inc.location}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--text-muted);">Affected Inundation Area:</span>
                        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--risk-crit);">${inc.affectedArea}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
                        <span style="color: var(--text-muted);">Assigned Response Unit:</span>
                        <span style="color: var(--accent-cyan); font-weight: 700;">${inc.assignedTeam || 'Pending Deployment'}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding-bottom: 4px;">
                        <span style="color: var(--text-muted);">SOP Progress:</span>
                        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--risk-low);">${completedCount} / ${totalCount} (${progressPercent}%)</span>
                      </div>
                    </div>

                    <div style="margin-top: 14px;">
                      <div class="factor-bar-bg" style="height: 8px;">
                        <div class="factor-bar-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, #3b82f6, #10b981);"></div>
                      </div>
                    </div>
                  </div>

                  <!-- SOP Checklist -->
                  <div class="incident-sop-container">
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                      Emergency Response Standard Operating Procedure (SOP):
                    </div>
                    ${inc.sop.map(step => `
                      <div class="sop-step-item ${step.done ? 'completed' : ''}" data-inc-id="${inc.id}" data-step-id="${step.id}">
                        <div class="sop-step-left">
                          <div class="sop-checkbox" data-inc-id="${inc.id}" data-step-id="${step.id}">
                            ${step.done ? '✓' : ''}
                          </div>
                          <span class="sop-step-title" style="${step.done ? 'color: #fff;' : 'color: var(--text-secondary);'}">
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

    // SOP Checkbox toggling
    container.querySelectorAll('.sop-checkbox, .sop-step-item').forEach(el => {
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
      showToast('Incident creation wizard initialized.', 'info');
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
