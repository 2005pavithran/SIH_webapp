// Public / Citizen Disaster Advisory & Safety Portal Component
// Follows Government Digital Service (GDS) Standards: Simple, Essential, Actionable

import { store } from '../state/store.js';
import { createGISMap } from './LiveMapGIS.js';
import { simulationEngine } from '../state/simulation.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';
import { showToast } from './ToastNotification.js';

export function createPublicPortalView() {
  const container = document.createElement('div');
  container.className = 'public-portal-view animated-fade';

  let gisInstance = null;

  function render() {
    const state = store.getState();
    const loc = state.selectedPublicLocation || state.publicLocations[0];
    const riskCls = getRiskClass(loc.riskLevel);

    // Urgent disaster alerts for right-side notification panel
    const urgentAlerts = state.alerts;

    container.innerHTML = `
      <!-- SIH Demonstration Scenario Control Bar -->
      <div class="scenario-bar" style="border-left-color: var(--color-primary); margin-bottom: 18px;">
        <div class="scenario-info-text">
          <span class="scenario-tag">CITIZEN SAFETY PORTAL</span>
          <span>Official Public Early Warning & Civil Protection Gateway • Government of Tamil Nadu</span>
        </div>
        <div class="scenario-btn-group">
          <button class="btn-scenario ${state.activeScenario === 'avinashi_flood' ? 'active' : ''}" id="public-demo-avinashi-btn" title="Simulate Coimbatore upstream cloudburst causing flood in Avinashi">
            🌊 Coimbatore → Avinashi Flood Demo
          </button>
          <button class="btn-scenario ${state.activeScenario === 'baseline' ? 'active' : ''}" id="public-demo-reset-btn" title="Restore nominal baseline conditions">
            🔄 Reset Baseline
          </button>
        </div>
      </div>

      <!-- Public Two-Column Layout -->
      <div class="public-portal-grid">
        <!-- LEFT COLUMN: Situational Awareness & Citizen Guidance (Simple + Essential + Actionable) -->
        <div class="public-main-column">
          <!-- 1. Location Situation Summary Card -->
          <div class="gov-card public-situation-card ${riskCls}">
            <div class="public-situation-top">
              <div>
                <div class="public-loc-badge-row">
                  <span class="public-loc-name">📍 ${loc.name}</span>
                  <span class="public-district-badge">${loc.district || 'Tiruppur District'} • Pop. ${loc.population || '168,720'}</span>
                </div>
                <div class="public-warning-title">${loc.activeWarning}</div>
              </div>
              <div class="public-risk-badge-wrap">
                <span class="public-risk-badge ${riskCls}">${loc.riskLevel.toUpperCase()} RISK</span>
                <span class="public-risk-sub">Hazard: ${loc.disasterType}</span>
              </div>
            </div>

            <!-- Affected Areas & Situation Brief -->
            <div class="public-situation-body">
              <div class="public-info-row">
                <span class="public-info-label">AFFECTED / NEARBY AREAS:</span>
                <span class="public-info-val highlight">${loc.affectedAreas}</span>
              </div>
              <p class="public-explanation-text">
                ${loc.shortExplanation}
              </p>
              <div class="public-action-callout ${riskCls}">
                <div class="public-action-callout-icon">🚨</div>
                <div>
                  <strong>ESSENTIAL IMMEDIATE ACTION:</strong>
                  <div>${loc.safetyAction}</div>
                </div>
              </div>
            </div>

            <!-- Essential Environmental Telemetry (Citizen Relevant) -->
            <div class="public-env-grid">
              <div class="public-env-item">
                <span class="env-label">💧 River / Water Level</span>
                <span class="env-value ${loc.riskLevel === 'Critical' ? 'critical' : ''}">${loc.environmental?.waterLevel || '2.40 m'}</span>
                <span class="env-sub">${loc.environmental?.waterThreshold || 'Warning 2.0m'}</span>
              </div>
              <div class="public-env-item">
                <span class="env-label">🌧️ Upstream Rainfall</span>
                <span class="env-value">${loc.environmental?.rainfall || '42 mm/hr'}</span>
                <span class="env-sub">Coimbatore Catchment</span>
              </div>
              <div class="public-env-item">
                <span class="env-label">🌡️ Current Temperature</span>
                <span class="env-value">${loc.environmental?.temp || '26.8°C'}</span>
                <span class="env-sub">Relative Humidity: 78%</span>
              </div>
              <div class="public-env-item">
                <span class="env-label">🌫 Air Quality</span>
                <span class="env-value">${loc.environmental?.airQuality || 'Good (AQI 35)'}</span>
                <span class="env-sub">Low Particulate</span>
              </div>
            </div>
          </div>

          <!-- 2. Simple Citizen Risk Map -->
          <div class="gov-card public-map-card">
            <div class="gov-card-header">
              <div class="gov-card-title">
                <span>🗺️ Local Risk Map & Safe Corridors: ${loc.name}</span>
                <span class="status-badge ${riskCls}" style="font-size: 11px;">LIVE GIS</span>
              </div>
              <div style="font-size: 11px; color: var(--color-text-muted);">
                Pulsing ring indicates your selected locality • Shaded polygon shows flood basin
              </div>
            </div>

            <div class="public-map-wrapper" style="height: 380px; position: relative;">
              <!-- Leaflet Map Container -->
              <div id="public-gis-map" class="gis-map-element" style="height: 100%; min-height: 380px;"></div>

              <!-- Map Simple Legend -->
              <div class="map-legend-overlay" style="bottom: 42px; left: 12px; padding: 6px 12px;">
                <div class="legend-items" style="gap: 8px;">
                  <div class="legend-item"><div class="legend-dot crit"></div> Critical Risk</div>
                  <div class="legend-item"><div class="legend-dot high"></div> High Risk</div>
                  <div class="legend-item"><div class="legend-dot mod"></div> Moderate</div>
                  <div class="legend-item"><div class="legend-dot low"></div> Safe / Low</div>
                  <div class="legend-item">⛺ Relief Camp</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Actionable Safety Instructions (Dos & Don'ts) -->
          <div class="gov-card" style="padding: 16px 20px;">
            <div class="gov-card-title" style="margin-bottom: 12px;">
              <span>🛡️ Citizen Safety Guidelines & Civil Protection Measures</span>
            </div>
            <div class="dos-donts-grid">
              <div class="safety-box dos">
                <div class="safety-box-header">
                  <span class="safety-icon-check">✓</span>
                  <span>WHAT YOU MUST DO (RECOMMENDED)</span>
                </div>
                <ul class="safety-list">
                  ${(loc.dos || [
                    'Pack emergency kit: potable water, dry food, prescriptions, torch, and power bank',
                    'Move family, elderly dependents, and livestock to designated relief shelters',
                    'Listen to local police loudspeakers and official government SMS advisories'
                  ]).map(d => `<li>${d}</li>`).join('')}
                </ul>
              </div>

              <div class="safety-box donts">
                <div class="safety-box-header">
                  <span class="safety-icon-cross">✗</span>
                  <span>WHAT YOU MUST AVOID (DANGER)</span>
                </div>
                <ul class="safety-list">
                  ${(loc.donts || [
                    'DO NOT attempt to drive, cycle, or walk across flooded bridges or causeways',
                    'DO NOT touch submerged electrical transformers, exposed wires, or metal lampposts',
                    'DO NOT spread unverified panic messages or forwarded social media rumors'
                  ]).map(d => `<li>${d}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- 4. Emergency Helplines & Nearest Shelter Directory -->
          <div class="gov-card" style="padding: 16px 20px;">
            <div class="gov-card-title" style="margin-bottom: 12px;">
              <span>📞 Emergency Helplines & Nearest Evacuation Shelter</span>
            </div>
            <div class="helpline-shelter-grid">
              <!-- Helplines List -->
              <div class="helpline-cards-group">
                ${(loc.emergencyHelplines || [
                  { name: 'National Emergency', number: '112' },
                  { name: 'District Disaster EOC', number: '1077' },
                  { name: 'Medical Ambulance', number: '108' },
                  { name: 'State Disaster Operations', number: '1070' }
                ]).map(h => `
                  <a href="tel:${h.number}" class="helpline-card" title="Tap to call ${h.name}">
                    <div class="helpline-number">${h.number}</div>
                    <div class="helpline-name">${h.name}</div>
                  </a>
                `).join('')}
              </div>

              <!-- Nearest Shelter Info -->
              <div class="nearest-shelter-card">
                <div class="shelter-badge">⛺ NEAREST DESIGNATED RELIEF CAMP</div>
                <div class="shelter-title">${loc.nearestShelter?.name || 'Government Higher Secondary Relief Camp (SH-01)'}</div>
                <div class="shelter-meta">
                  <span>📍 <strong>${loc.nearestShelter?.distance || '1.4 km from Town Centre'}</strong></span>
                  <span>•</span>
                  <span>🛏️ ${loc.nearestShelter?.capacity || '450 capacity (330 beds free)'}</span>
                </div>
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 6px;">
                  ${loc.nearestShelter?.contact || 'Camp Duty Officer: +91-94421-50891'} • Drinking water, medical first aid, and community food kitchen active.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Location Search (ABOVE) -> Live Disaster Notifications (BELOW) -->
        <div class="public-sidebar-column">
          <!-- 1. Location Search Component (STRICTLY ABOVE NOTIFICATION PANEL) -->
          <div class="gov-card public-search-card">
            <div class="public-search-header">
              <span class="public-search-title">🔍 Find Your Location</span>
              <span class="status-badge success" style="font-size: 10px;">INSTANT</span>
            </div>
            <p style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 10px;">
              Search your town or taluk to check current disaster risks and local safety orders:
            </p>
            <div class="public-search-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="public-location-search-input" placeholder="Type location (e.g. Avinashi, Coimbatore)..." value="${loc.name}">
              <button id="public-search-clear-btn" class="search-clear-btn" title="Clear search">&times;</button>
            </div>
            <div id="public-search-suggestions" class="search-suggestions-dropdown hidden"></div>

            <!-- Quick Location Selection Pills -->
            <div class="quick-locations-section">
              <span class="quick-loc-label">Quick Select Monitored Areas:</span>
              <div class="quick-loc-pills">
                ${state.publicLocations.map(pl => {
                  const isSelected = pl.id === loc.id;
                  const pillRisk = getRiskClass(pl.riskLevel);
                  return `
                    <button class="quick-loc-btn ${isSelected ? 'active' : ''} ${pillRisk}" data-loc-id="${pl.id}">
                      <span>${pl.name}</span>
                      <span class="mini-risk-dot ${pillRisk}"></span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- 2. Live Disaster Notifications Panel (STRICTLY BELOW LOCATION SEARCH) -->
          <div class="gov-card public-notifications-panel">
            <div class="gov-card-header" style="padding-bottom: 10px;">
              <div class="gov-card-title">
                <span class="live-blink-dot"></span>
                <span>🚨 Live Disaster Alerts</span>
              </div>
              <span class="status-badge critical" style="font-size: 10px;">${urgentAlerts.length} ACTIVE</span>
            </div>
            <div class="notification-panel-desc">
              Urgent civil protection warnings broadcast in real-time across Tamil Nadu & Western Ghats:
            </div>

            <!-- Scrollable Alerts Feed -->
            <div class="public-alerts-scroller" id="public-alerts-feed">
              ${urgentAlerts.map((alert, idx) => {
                const aRiskCls = getRiskClass(alert.severity);
                const isRelevantToLoc = alert.location.toLowerCase().includes(loc.name.toLowerCase()) || 
                                       loc.name.toLowerCase().includes('avinashi') && alert.location.toLowerCase().includes('avinashi') ||
                                       loc.name.toLowerCase().includes('coimbatore') && alert.location.toLowerCase().includes('coimbatore');

                return `
                  <div class="public-alert-item ${aRiskCls} ${isRelevantToLoc ? 'highlighted-for-loc' : ''} ${idx === 0 ? 'pulse-latest' : ''}" data-alert-id="${alert.id}">
                    <div class="public-alert-top">
                      <div class="alert-type-group">
                        <span class="alert-type-icon">${getHazardIcon(alert.hazard)}</span>
                        <span class="alert-type-name">${alert.hazard.toUpperCase()}</span>
                      </div>
                      <span class="status-badge ${aRiskCls}">${alert.severity.toUpperCase()}</span>
                    </div>

                    <div class="public-alert-title">${alert.title}</div>
                    
                    <div class="public-alert-location">
                      📍 <strong>${alert.location}</strong>
                    </div>

                    <p class="public-alert-msg">${alert.description}</p>

                    <div class="public-alert-footer">
                      <span class="alert-time-tag">⏱️ ${alert.timeAgo || 'Just now'}</span>
                      <span class="alert-auth-tag">CAP-INDIA OFFICIAL</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Civil Support Footer Note -->
            <div class="notification-panel-footer">
              <span>ℹ️ Need non-emergency assistance? Contact District Collectorate Public Grievance: <strong>0421-2971100</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Handlers
    attachEventListeners();

    // Initialize Simple GIS Map
    setTimeout(() => {
      const mapEl = container.querySelector('#public-gis-map');
      if (mapEl) {
        gisInstance = createGISMap('public-gis-map', { 
          isCompact: true, 
          showTicker: true, 
          enableSelection: true 
        });
        gisInstance.init(mapEl);

        // Highlight selected public location
        if (loc.center) {
          gisInstance.setSelectedLocation(loc.center, `${loc.name} (${loc.riskLevel} Risk)`);
          gisInstance.flyTo(loc.center, loc.zoom || 12);
        }
      }
    }, 60);
  }

  function attachEventListeners() {
    // Demonstration Scenario Buttons
    const demoAvinashiBtn = container.querySelector('#public-demo-avinashi-btn');
    if (demoAvinashiBtn) {
      demoAvinashiBtn.addEventListener('click', () => {
        simulationEngine.triggerAvinashiFloodScenario();
      });
    }

    const demoResetBtn = container.querySelector('#public-demo-reset-btn');
    if (demoResetBtn) {
      demoResetBtn.addEventListener('click', () => {
        simulationEngine.resetBaselineScenario();
      });
    }

    // Quick Location Buttons
    container.querySelectorAll('.quick-loc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const locId = btn.getAttribute('data-loc-id');
        selectLocationById(locId);
      });
    });

    // Location Search Input with Autocomplete
    const searchInp = container.querySelector('#public-location-search-input');
    const suggestionsEl = container.querySelector('#public-search-suggestions');
    const clearBtn = container.querySelector('#public-search-clear-btn');

    if (searchInp && suggestionsEl) {
      searchInp.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          suggestionsEl.classList.add('hidden');
          suggestionsEl.innerHTML = '';
          return;
        }

        const state = store.getState();
        const matches = state.publicLocations.filter(pl => 
          pl.name.toLowerCase().includes(query) || 
          pl.district.toLowerCase().includes(query) ||
          pl.affectedAreas.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
          suggestionsEl.innerHTML = matches.map(m => `
            <div class="search-suggestion-item" data-loc-id="${m.id}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>📍 ${m.name}</strong>
                <span class="status-badge ${getRiskClass(m.riskLevel)}">${m.riskLevel}</span>
              </div>
              <div style="font-size: 11px; color: var(--color-text-muted);">${m.district} • ${m.disasterType}</div>
            </div>
          `).join('');
          suggestionsEl.classList.remove('hidden');

          suggestionsEl.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
              const locId = item.getAttribute('data-loc-id');
              selectLocationById(locId);
              suggestionsEl.classList.add('hidden');
            });
          });
        } else {
          suggestionsEl.innerHTML = `
            <div style="padding: 10px; font-size: 12px; color: var(--color-text-muted); text-align: center;">
              No designated monitored taluk found for "${query}". Try "Avinashi", "Coimbatore", or "Tiruppur".
            </div>
          `;
          suggestionsEl.classList.remove('hidden');
        }
      });

      // Clear button
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInp.value = '';
          searchInp.focus();
          suggestionsEl.classList.add('hidden');
        });
      }

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!searchInp.contains(e.target) && !suggestionsEl.contains(e.target)) {
          suggestionsEl.classList.add('hidden');
        }
      });
    }
  }

  function selectLocationById(locId) {
    const state = store.getState();
    const targetLoc = state.publicLocations.find(l => l.id.toLowerCase() === locId.toLowerCase());
    if (!targetLoc) return;

    store.setPublicLocation(targetLoc);
    showToast(`📍 Focused on: ${targetLoc.name} (${targetLoc.riskLevel} Risk)`, 'info');

    // If Avinashi is selected, heighten or ensure the developing flood scenario demo is demonstrated
    if (locId === 'avinashi' && state.activeScenario !== 'avinashi_flood') {
      simulationEngine.triggerAvinashiFloodScenario();
    } else {
      // Re-render view to reflect the new location
      render();
    }
  }

  render();

  // Reactive updates from store
  const unsubscribe = store.subscribe((state, event, payload) => {
    if (event === 'public_location_change' || event === 'region_change') {
      render();
    } else if (event === 'telemetry_tick' || event === 'new_alert') {
      // Update alerts feed without tearing down map
      const alertsFeed = container.querySelector('#public-alerts-feed');
      if (alertsFeed) {
        const loc = state.selectedPublicLocation || state.publicLocations[0];
        alertsFeed.innerHTML = state.alerts.map((alert, idx) => {
          const aRiskCls = getRiskClass(alert.severity);
          const isRelevantToLoc = alert.location.toLowerCase().includes(loc.name.toLowerCase()) || 
                                 loc.name.toLowerCase().includes('avinashi') && alert.location.toLowerCase().includes('avinashi') ||
                                 loc.name.toLowerCase().includes('coimbatore') && alert.location.toLowerCase().includes('coimbatore');

          return `
            <div class="public-alert-item ${aRiskCls} ${isRelevantToLoc ? 'highlighted-for-loc' : ''} ${idx === 0 ? 'pulse-latest' : ''}" data-alert-id="${alert.id}">
              <div class="public-alert-top">
                <div class="alert-type-group">
                  <span class="alert-type-icon">${getHazardIcon(alert.hazard)}</span>
                  <span class="alert-type-name">${alert.hazard.toUpperCase()}</span>
                </div>
                <span class="status-badge ${aRiskCls}">${alert.severity.toUpperCase()}</span>
              </div>

              <div class="public-alert-title">${alert.title}</div>
              
              <div class="public-alert-location">
                📍 <strong>${alert.location}</strong>
              </div>

              <p class="public-alert-msg">${alert.description}</p>

              <div class="public-alert-footer">
                <span class="alert-time-tag">⏱️ ${alert.timeAgo || 'Just now'}</span>
                <span class="alert-auth-tag">CAP-INDIA OFFICIAL</span>
              </div>
            </div>
          `;
        }).join('');
      }

      if (gisInstance) {
        gisInstance.refresh();
      }
    }
  });

  return {
    element: container,
    destroy: () => {
      if (gisInstance) gisInstance.destroy();
      unsubscribe();
    }
  };
}
