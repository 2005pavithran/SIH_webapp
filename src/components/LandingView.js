// Standalone National Environmental Intelligence Network Landing Page View
// Visual Direction: National Government + Mission Control + Geospatial Intelligence

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATES_CONFIG, NATIONAL_OVERVIEW, NATIONAL_TRENDS, SAFETY_ADVISORIES, ALL_ALERTS } from '../utils/mockData.js';
import { openStateLoginModal } from './StateLoginModal.js';
import { getRiskClass } from '../utils/formatters.js';

// SVG Icon Helpers (No Raw Emojis)
const ICONS = {
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  shieldSmall: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  map: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  globe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  radio: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>`,
  alertTriangle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  satellite: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  activity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  water: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  flame: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  wind: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.7 7.7A2.5 2.5 0 0 1 19 12h-8"/><path d="M12.7 17.7A2.5 2.5 0 0 0 14 20h-8"/><path d="M12.7 4.7A2.5 2.5 0 0 1 14 7H2"/></svg>`,
  mountain: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
};

function getHazardSvg(hazardType) {
  const h = (hazardType || '').toLowerCase();
  if (h.includes('flood') || h.includes('water') || h.includes('hydro')) return ICONS.water;
  if (h.includes('fire') || h.includes('thermal') || h.includes('heat')) return ICONS.flame;
  if (h.includes('air') || h.includes('smog') || h.includes('pm2.5') || h.includes('wind')) return ICONS.wind;
  if (h.includes('landslide') || h.includes('slope') || h.includes('mountain')) return ICONS.mountain;
  return ICONS.activity;
}

function getHazardCategory(hazardType) {
  const h = (hazardType || '').toLowerCase();
  if (h.includes('flood') || h.includes('water')) return 'HYDROLOGICAL INTELLIGENCE';
  if (h.includes('fire') || h.includes('wildfire')) return 'FORESTRY THERMAL INTELLIGENCE';
  if (h.includes('air') || h.includes('smog')) return 'ATMOSPHERIC & AQI TELEMETRY';
  if (h.includes('heat')) return 'THERMAL ANOMALY MONITORING';
  if (h.includes('landslide')) return 'GEOTECHNICAL HAZARD INTELLIGENCE';
  return 'ENVIRONMENTAL MONITORING';
}

function getSeverityColor(sev) {
  const s = (sev || '').toUpperCase();
  if (s === 'CRITICAL') return 'var(--sev-critical)';
  if (s === 'SEVERE') return 'var(--sev-severe)';
  if (s === 'WARNING') return 'var(--sev-warning)';
  if (s === 'WATCH') return 'var(--sev-watch)';
  return 'var(--sev-normal)';
}

export function createLandingView() {
  const container = document.createElement('div');
  container.className = 'landing-page-root animated-fade';

  let nationalMap = null;
  let globeAnimationId = null;
  let globeCanvas = null;
  let scrollHandler = null;
  let sectionObserver = null;

  function render() {
    container.innerHTML = `
      <!-- Hero Section (Cinematic Atmosphere & Technical HUD) -->
      <div class="boot-animation-hero" id="landing-hero">
        <div class="hero-atmosphere-glow"></div>
        <div class="hero-orbital-ring"></div>

        <!-- Technical HUD Header -->
        <div class="hero-hud-container">
          <div class="hud-pill-technical">
            <span class="hud-pulse-dot"></span>
            <span>NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
          </div>
          <div class="hero-hud-status-line">
            <span>EDGE NETWORK: <strong>ONLINE</strong></span>
            <span>•</span>
            <span>GIS SERVICES: <strong>SYNCHRONIZED</strong></span>
            <span>•</span>
            <span>TELEMETRY: <strong>LIVE MESH</strong></span>
          </div>
        </div>

        <!-- 3D Earth Globe Canvas -->
        <div class="globe-canvas-wrapper">
          <canvas id="earth-globe-canvas" class="globe-canvas-element" aria-label="3D Rotating Geospatial Sphere"></canvas>
        </div>

        <!-- Hero Content -->
        <div class="hero-content-group">
          <h1 class="hero-main-title">
            Observe the Nation. <br>
            <span class="emerald-gradient">Understand Environmental Risk.</span>
          </h1>
          <p class="hero-subtitle">
            Autonomous multi-hazard monitoring, edge-computed early warning telemetry, and state-jurisdiction disaster intelligence for authorized command authorities.
          </p>

          <div class="hero-cta-group">
            <button class="btn-landing-primary" id="btn-hero-authority-login">
              ${ICONS.shield}
              <span>ACCESS STATE COMMAND CENTER</span>
            </button>
            <a href="#gis-risk-map" class="btn-landing-secondary">
              ${ICONS.map}
              <span>EXPLORE NATIONAL GIS</span>
            </a>
          </div>

          <!-- Technical Network Telemetry Strip -->
          <div class="hero-network-strip">
            <div class="hero-network-strip-item">
              <span class="hud-pulse-dot"></span>
              <span>NETWORK <strong>ONLINE</strong></span>
            </div>
            <div class="hero-network-strip-item">
              <span>INGESTION: <strong>2.4k PKT/S</strong></span>
            </div>
            <div class="hero-network-strip-item">
              <span>STATES: <strong>7 SDMAs CONNECTED</strong></span>
            </div>
            <div class="hero-network-strip-item">
              <span>STATUS: <strong>24×7 TELEMETRY</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- National Sticky Header (Government Intelligence Style) -->
      <header class="national-header" id="national-sticky-header">
        <div class="national-header-left">
          <div class="gov-emblem-badge" title="National Environmental Intelligence Network">
            ${ICONS.shield}
          </div>
          <div class="national-title-group">
            <span class="national-brand-title">NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
            <span class="national-brand-sub">Authority Telemetry & Disaster Response Portal</span>
          </div>
        </div>

        <nav class="national-header-nav">
          <a href="#gis-risk-map" class="nav-link-landing">GIS Risk Map</a>
          <a href="#national-overview" class="nav-link-landing">National Overview</a>
          <a href="#current-trends" class="nav-link-landing">Current Trends</a>
          <a href="#safety-advisory" class="nav-link-landing">Safety Advisory</a>
          <a href="#active-alerts" class="nav-link-landing">Active Alerts</a>
          <a href="#authority-access" class="nav-link-landing">State Access</a>
        </nav>

        <div class="national-header-right">
          <div class="emergency-pill-landing">
            <span>24×7 Hotline:</span>
            <strong>112 / 1070</strong>
          </div>
          <button class="btn-landing-primary" style="padding: 9px 18px; font-size: 12.5px;" id="btn-nav-login">
            ${ICONS.lock}
            <span>AUTHORITY LOGIN</span>
          </button>
        </div>
      </header>

      <!-- Section 1: National GIS Risk Map -->
      <section class="landing-section" id="gis-risk-map">
        <div class="landing-section-header">
          <span class="landing-section-tag">GEOSPATIAL SITUATIONAL AWARENESS</span>
          <h2 class="landing-section-title">NATIONAL ENVIRONMENTAL RISK MAP</h2>
          <p class="landing-section-sub">Nationwide environmental telemetry and multi-hazard situational awareness — Select a state to authenticate</p>
        </div>

        <div class="gis-map-card-landing">
          <div class="gis-map-header-landing">
            <div class="gis-map-title-text">
              ${ICONS.map}
              <span>NATIONAL GIS NETWORK</span>
              <span class="hud-pill-technical" style="padding: 2px 8px; font-size: 10px;">LIVE GIS OVERVIEW</span>
            </div>
            <div class="gis-map-subtitle-text">
              Click a state jurisdiction node to initiate Authority Authentication
            </div>
          </div>

          <div style="position: relative;">
            <div id="national-gis-map"></div>

            <!-- Top Right Map Legend Overlay -->
            <div class="national-map-legend-bar">
              <span style="font-weight: 700; color: #FFFFFF; font-size: 10.5px; letter-spacing: 0.5px;">RISK LEVEL:</span>
              <div class="legend-item"><span class="legend-dot" style="background: var(--sev-normal);"></span> Normal</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--sev-watch);"></span> Watch</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--sev-warning);"></span> Warning</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--sev-critical);"></span> Critical</div>
              <div class="legend-item"><span class="legend-dot" style="background: var(--sev-severe);"></span> Severe</div>
            </div>

            <!-- Bottom Left Helper Badge -->
            <div class="national-map-helper-badge">
              <strong>SELECT A STATE JURISDICTION</strong>
              <span>State selection opens the authority authentication gateway for dedicated Command Center access.</span>
            </div>
          </div>
        </div>

        <!-- Section 2: National Overview 4-KPI Tiles -->
        <div class="national-kpi-grid" id="national-overview" style="margin-top: 24px;">
          <div class="kpi-tile-landing">
            <div class="kpi-tile-header-row">
              <span class="kpi-tile-label">MONITORED STATES</span>
              <span class="kpi-tile-index-tag">01</span>
            </div>
            <div class="kpi-tile-val">${NATIONAL_OVERVIEW.totalMonitoredStates}</div>
            <div class="kpi-tile-sub">
              ${ICONS.shieldSmall}
              <span>State SDMAs Connected</span>
            </div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-header-row">
              <span class="kpi-tile-label">ACTIVE EDGE NODES</span>
              <span class="kpi-tile-index-tag">02</span>
            </div>
            <div class="kpi-tile-val">${NATIONAL_OVERVIEW.totalActiveEdgeNodes.toLocaleString()}</div>
            <div class="kpi-tile-sub">
              ${ICONS.radio}
              <span>Field Telemetry Nodes</span>
            </div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-header-row">
              <span class="kpi-tile-label">ACTIVE ALERTS</span>
              <span class="kpi-tile-index-tag">03</span>
            </div>
            <div class="kpi-tile-val" style="color: var(--sev-warning);">${NATIONAL_OVERVIEW.activeNationalAlerts}</div>
            <div class="kpi-tile-sub" style="color: var(--sev-warning);">
              ${ICONS.alertTriangle}
              <span>${NATIONAL_OVERVIEW.criticalIncidentsNationwide} Critical Incidents</span>
            </div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-header-row">
              <span class="kpi-tile-label">NETWORK UPTIME</span>
              <span class="kpi-tile-index-tag">04</span>
            </div>
            <div class="kpi-tile-val" style="color: var(--landing-emerald-light);">${NATIONAL_OVERVIEW.nationalUptime}%</div>
            <div class="kpi-tile-sub">
              ${ICONS.satellite}
              <span>${NATIONAL_OVERVIEW.satelliteSyncStatus}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Current Trends (Analytical Modules) -->
      <section class="landing-section" id="current-trends">
        <div class="landing-section-header">
          <span class="landing-section-tag">MULTI-TEMPORAL RISK TRAJECTORIES</span>
          <h2 class="landing-section-title">CURRENT ENVIRONMENTAL TRENDS</h2>
          <p class="landing-section-sub">National aggregate patterns across hydrological, meteorological, and thermal indices</p>
        </div>

        <div class="trends-grid-landing">
          ${NATIONAL_TRENDS.map(t => {
            const sevColor = getSeverityColor(t.level);
            const category = getHazardCategory(t.hazard);
            const iconSvg = getHazardSvg(t.hazard);
            return `
              <div class="trend-card-landing">
                <div>
                  <span class="trend-category-tag">${category}</span>
                  <div class="trend-card-top-row">
                    <h3 class="trend-hazard-name">${t.hazard}</h3>
                    <span class="trend-level-pill" style="background: rgba(255,255,255,0.06); color: ${sevColor}; border: 1px solid ${sevColor};">
                      ${t.level}
                    </span>
                  </div>
                </div>

                <p class="trend-card-summary">${t.summary}</p>

                <div class="trend-card-bottom-row">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: ${sevColor};">${iconSvg}</span>
                    <span style="font-size: 11px; color: var(--landing-text-muted);">Trajectory:</span>
                  </div>
                  <span class="trend-delta-text" style="color: ${sevColor};">${t.trend}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 4: Safety Advisory (Operational Guidance) -->
      <section class="landing-section" id="safety-advisory">
        <div class="landing-section-header">
          <span class="landing-section-tag">OFFICIAL STANDARD OPERATING GUIDELINES</span>
          <h2 class="landing-section-title">NATIONAL SAFETY ADVISORIES</h2>
          <p class="landing-section-sub">Authoritative civil defense and multi-hazard response guidelines for operational sectors</p>
        </div>

        <div class="advisory-grid-landing">
          ${SAFETY_ADVISORIES.map(adv => {
            const iconSvg = getHazardSvg(adv.type);
            return `
              <div class="advisory-card-landing">
                <div>
                  <div class="advisory-header-row">
                    <div class="advisory-icon-box">
                      ${iconSvg}
                    </div>
                    <span class="advisory-action-tag">ACTION: ${adv.action}</span>
                  </div>
                  <h3 class="advisory-title">${adv.type}</h3>
                  <p class="advisory-body" style="margin-top: 8px;">${adv.details}</p>
                </div>
                <div class="advisory-footer-action">
                  <span>Standard Protocol</span>
                  ${ICONS.arrowRight}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 5: Active Demonstration Alerts (Network Dispatch Feed) -->
      <section class="landing-section" id="active-alerts">
        <div class="landing-section-header">
          <span class="landing-section-tag">REAL-TIME EARLY WARNING DISPATCHES</span>
          <h2 class="landing-section-title">ACTIVE ENVIRONMENTAL ALERTS</h2>
          <p class="landing-section-sub">National network telemetry dispatches — <span style="color: var(--landing-emerald-light); font-weight: 700;">DEMONSTRATION DATA</span></p>
        </div>

        <div class="alert-feed-container">
          ${ALL_ALERTS.slice(0, 4).map(alert => {
            const sevColor = getSeverityColor(alert.severity);
            const stateMatch = STATES_CONFIG.find(s => s.id === alert.stateId);
            const stateName = stateMatch ? stateMatch.name : alert.stateId;
            const iconSvg = getHazardSvg(alert.hazard);

            return `
              <div class="alert-row-card" style="--alert-severity-color: ${sevColor};" data-state="${alert.stateId}">
                <div class="alert-left-group">
                  <div class="alert-icon-wrap" style="color: ${sevColor};">
                    ${iconSvg}
                  </div>
                  <div>
                    <div class="alert-meta-top">
                      <span class="alert-severity-badge" style="background: rgba(255,255,255,0.06); color: ${sevColor}; border: 1px solid ${sevColor};">
                        ${alert.severity.toUpperCase()}
                      </span>
                      <span class="alert-title-text">${alert.title}</span>
                      <span class="alert-state-tag">• ${stateName} (${alert.stateId})</span>
                    </div>
                    <div class="alert-desc-text">${alert.description}</div>
                  </div>
                </div>

                <div class="alert-right-action">
                  <div class="alert-time-pill">
                    ${ICONS.clock}
                    <span>${alert.timeAgo}</span>
                  </div>
                  <button class="btn-alert-inspect" data-state="${alert.stateId}">
                    <span>View ${alert.stateId} Command</span>
                    ${ICONS.arrowRight}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 6: State Authority Jurisdiction Gateway -->
      <section class="landing-section" id="authority-access">
        <div class="landing-section-header">
          <span class="landing-section-tag">STATE JURISDICTION GATEWAY</span>
          <h2 class="landing-section-title">AUTHORIZED COMMAND ACCESS</h2>
          <p class="landing-section-sub">Select your state jurisdiction to establish an encrypted operational session</p>
        </div>

        <div class="state-cards-grid">
          ${STATES_CONFIG.map(st => {
            const riskColor = getSeverityColor(st.riskLevel);
            return `
              <div class="state-access-card" data-state-id="${st.id}">
                <div>
                  <div class="state-card-header">
                    <span class="state-name-main">${st.name}</span>
                    <span class="state-code-badge">${st.code}</span>
                  </div>
                  <div class="state-emblem-sub">
                    ${st.emblemSubtitle}
                  </div>

                  <div class="state-card-meta">
                    <div class="state-card-meta-row">
                      <span>Monitored Sectors:</span>
                      <strong>${st.districts.length} Districts</strong>
                    </div>
                    <div class="state-card-meta-row">
                      <span>Telemetry Mesh:</span>
                      <strong style="font-family: var(--font-mono);">${st.activeSensorsCount} Active Nodes</strong>
                    </div>
                    <div class="state-card-meta-row">
                      <span>Primary Risk Status:</span>
                      <span style="font-weight: 700; color: ${riskColor};">
                        ${st.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <button class="btn-state-login-cta">
                  ${ICONS.lock}
                  <span>AUTHENTICATE JURISDICTION</span>
                  ${ICONS.arrowRight}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Institutional Footer & Demonstration Disclaimer -->
      <footer class="national-footer">
        <div class="footer-content-wrap">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div class="gov-emblem-badge" style="width: 32px; height: 32px;">${ICONS.shieldSmall}</div>
              <span class="footer-brand-title">NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
            </div>
            <p class="footer-brand-desc">
              National environmental telemetry, edge sensor aggregation, and multi-hazard early warning network connecting State Disaster Management Authorities.
            </p>
          </div>

          <div>
            <div class="footer-col-title">Navigation</div>
            <div class="footer-links-list">
              <a href="#gis-risk-map">GIS Risk Map</a>
              <a href="#national-overview">National Overview</a>
              <a href="#current-trends">Current Trends</a>
              <a href="#safety-advisory">Safety Advisories</a>
              <a href="#authority-access">State Jurisdictions</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Authority Gateways</div>
            <div class="footer-links-list">
              <a href="javascript:void(0)" onclick="window.openStateLoginModal('TN')">Tamil Nadu SDMA</a>
              <a href="javascript:void(0)" onclick="window.openStateLoginModal('UT')">Uttarakhand SDMA</a>
              <a href="javascript:void(0)" onclick="window.openStateLoginModal('KL')">Kerala SDMA</a>
              <a href="javascript:void(0)" onclick="window.openStateLoginModal('AS')">Assam SDMA</a>
              <a href="javascript:void(0)" onclick="window.openStateLoginModal('MH')">Maharashtra SDMA</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Emergency Helplines</div>
            <div class="footer-links-list">
              <div>National Emergency: <strong style="color: #FFFFFF; font-family: var(--font-mono);">112</strong></div>
              <div>State EOC Helpline: <strong style="color: #FFFFFF; font-family: var(--font-mono);">1070</strong></div>
              <div>District Disaster Control: <strong style="color: #FFFFFF; font-family: var(--font-mono);">1077</strong></div>
              <div>NDRF Operations HQ: <strong style="color: #FFFFFF; font-family: var(--font-mono);">011-24363260</strong></div>
            </div>
          </div>
        </div>

        <!-- Demonstration Disclaimer Notice -->
        <div class="footer-demo-disclaimer">
          ⚠️ <strong>EVALUATION & PROTOTYPE NOTICE:</strong> This portal is a prototype demonstration interface for national environmental intelligence and multi-hazard disaster management. Displayed telemetry may contain simulated sensor metrics for technical evaluation.
        </div>

        <div class="footer-bottom-bar">
          <div>© 2026 National Environmental Intelligence Network • Authority-Only Portal</div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--landing-emerald-light);">
            NETWORK STATUS: ONLINE • EDGE INGESTION: 2.4k pkt/s
          </div>
        </div>
      </footer>
    `;

    // Attach Event Handlers
    container.querySelector('#btn-hero-authority-login')?.addEventListener('click', () => openStateLoginModal('TN'));
    container.querySelector('#btn-nav-login')?.addEventListener('click', () => openStateLoginModal('TN'));

    container.querySelectorAll('.state-access-card').forEach(card => {
      card.addEventListener('click', () => {
        const stateId = card.getAttribute('data-state-id');
        openStateLoginModal(stateId);
      });
    });

    container.querySelectorAll('.alert-row-card').forEach(card => {
      card.addEventListener('click', () => {
        const stateId = card.getAttribute('data-state');
        openStateLoginModal(stateId);
      });
    });

    // Sticky Header Scroll Listener
    const headerEl = container.querySelector('#national-sticky-header');
    scrollHandler = () => {
      if (headerEl) {
        if (window.scrollY > 40) {
          headerEl.classList.add('scrolled');
        } else {
          headerEl.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Section Scroll Reveal Observer
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
        }
      });
    }, { threshold: 0.12 });

    container.querySelectorAll('.landing-section').forEach(sec => {
      sectionObserver.observe(sec);
    });

    // Initialize 3D Canvas Globe & GIS Map
    setTimeout(() => {
      init3DGlobeCanvas();
      initNationalGISMap();
    }, 60);
  }

  // ========================================================================
  // 3D EARTH GLOBE CANVAS ANIMATION
  // ========================================================================
  function init3DGlobeCanvas() {
    globeCanvas = container.querySelector('#earth-globe-canvas');
    if (!globeCanvas) return;
    const ctx = globeCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 460;
    globeCanvas.width = size * dpr;
    globeCanvas.height = size * dpr;
    globeCanvas.style.width = `${size}px`;
    globeCanvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = 185;
    const centerX = size / 2;
    const centerY = size / 2;
    let rotationAngle = 0;
    const tiltAngle = 0.38; // Radians

    // Generate geographic dot points on sphere (India cluster + global distribution)
    const points = [];
    const numPoints = 650;
    for (let i = 0; i < numPoints; i++) {
      const lat = Math.asin(2 * Math.random() - 1);
      const lon = 2 * Math.PI * Math.random();
      
      const latDeg = (lat * 180) / Math.PI;
      const lonDeg = (lon * 180) / Math.PI;
      const isIndia = latDeg >= 8 && latDeg <= 36 && lonDeg >= 68 && lonDeg <= 96;

      points.push({ lat, lon, isIndia });
    }

    // State nodes on the rotating sphere
    const stateNodes = STATES_CONFIG.map(st => ({
      name: st.name,
      lat: (st.center[0] * Math.PI) / 180,
      lon: (st.center[1] * Math.PI) / 180,
      risk: st.riskLevel
    }));

    function animateGlobe() {
      if (document.hidden) {
        globeAnimationId = requestAnimationFrame(animateGlobe);
        return;
      }

      ctx.clearRect(0, 0, size, size);
      rotationAngle += 0.006;

      // 1. Globe Deep Atmosphere Radial Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.15);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.03)');
      glowGrad.addColorStop(0.8, 'rgba(16, 185, 129, 0.16)');
      glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Dark Sphere Fill
      const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.35, centerY - radius * 0.35, radius * 0.2, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#0a2316');
      sphereGrad.addColorStop(0.7, '#04120a');
      sphereGrad.addColorStop(1, '#020704');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Globe Edge Ring (Atmospheric Rim)
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Parallels & Meridians (Wireframe Graticule)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.11)';
      ctx.lineWidth = 1;

      // Longitude lines
      for (let lonOffset = 0; lonOffset < Math.PI * 2; lonOffset += Math.PI / 4) {
        ctx.beginPath();
        let first = true;
        for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.1) {
          const l = lonOffset + rotationAngle;
          const x3d = Math.cos(lat) * Math.sin(l);
          const y3d = Math.sin(lat);
          const z3d = Math.cos(lat) * Math.cos(l);

          const rotY = y3d * Math.cos(tiltAngle) - z3d * Math.sin(tiltAngle);
          const rotZ = y3d * Math.sin(tiltAngle) + z3d * Math.cos(tiltAngle);

          if (rotZ > -0.1) {
            const screenX = centerX + x3d * radius;
            const screenY = centerY - rotY * radius;
            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 5. Draw Surface Points & India Nodes
      points.forEach(p => {
        const currentLon = p.lon + rotationAngle;
        const x3d = Math.cos(p.lat) * Math.sin(currentLon);
        const y3d = Math.sin(p.lat);
        const z3d = Math.cos(p.lat) * Math.cos(currentLon);

        const rotY = y3d * Math.cos(tiltAngle) - z3d * Math.sin(tiltAngle);
        const rotZ = y3d * Math.sin(tiltAngle) + z3d * Math.cos(tiltAngle);

        if (rotZ > 0) {
          const screenX = centerX + x3d * radius;
          const screenY = centerY - rotY * radius;
          const alpha = Math.max(0.1, (rotZ * 0.9));

          if (p.isIndia) {
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 1.4})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 2.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 6. Draw State Nodes with Pulsing Rings on Front Face
      stateNodes.forEach(st => {
        const currentLon = st.lon + rotationAngle;
        const x3d = Math.cos(st.lat) * Math.sin(currentLon);
        const y3d = Math.sin(st.lat);
        const z3d = Math.cos(st.lat) * Math.cos(currentLon);

        const rotY = y3d * Math.cos(tiltAngle) - z3d * Math.sin(tiltAngle);
        const rotZ = y3d * Math.sin(tiltAngle) + z3d * Math.cos(tiltAngle);

        if (rotZ > 0.2) {
          const screenX = centerX + x3d * radius;
          const screenY = centerY - rotY * radius;

          // Pulse ring
          const pulseRadius = 5.5 + Math.sin(Date.now() * 0.005) * 2.8;
          ctx.strokeStyle = st.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(52, 211, 153, 0.9)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid dot
          ctx.fillStyle = st.risk === 'CRITICAL' ? '#ef4444' : '#10b981';
          ctx.beginPath();
          ctx.arc(screenX, screenY, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 7. Orbital Arc Trace
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.22, radius * 0.42, tiltAngle, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      globeAnimationId = requestAnimationFrame(animateGlobe);
    }

    animateGlobe();
  }

  // ========================================================================
  // NATIONAL LEAFLET GIS MAP (Full India with State Nodes & Dark Popups)
  // ========================================================================
  function initNationalGISMap() {
    const mapEl = container.querySelector('#national-gis-map');
    if (!mapEl) return;

    if (nationalMap) {
      nationalMap.remove();
      nationalMap = null;
    }

    // Centered on India
    nationalMap = L.map(mapEl, {
      center: [22.80, 80.00],
      zoom: 4.8,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(nationalMap);

    // Dark high-contrast GIS Basemap for the National View
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(nationalMap);

    // Render Monitored State Hubs & Regional Zones
    STATES_CONFIG.forEach(st => {
      const riskColor = getSeverityColor(st.riskLevel);
      
      // Outer regional coverage zone
      L.circle(st.center, {
        radius: 110000,
        color: riskColor,
        weight: 1.5,
        opacity: 0.8,
        fillColor: riskColor,
        fillOpacity: 0.12,
        className: 'national-state-boundary'
      }).addTo(nationalMap);

      // Clean Technical State Marker
      const icon = L.divIcon({
        className: 'national-state-node-icon',
        html: `
          <div style="background: rgba(3, 8, 5, 0.94); border: 1.5px solid ${riskColor}; color: #FFFFFF; padding: 4px 8px; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 6px; font-family: var(--font-sans); white-space: nowrap; cursor: pointer;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${riskColor}; box-shadow: 0 0 6px ${riskColor}; display: inline-block;"></span>
            <strong style="font-size: 11px; letter-spacing: 0.3px;">${st.name}</strong>
            <span style="font-size: 9px; padding: 1px 4px; background: rgba(255,255,255,0.1); color: ${riskColor}; border-radius: 3px; font-weight: 800; border: 1px solid ${riskColor};">${st.riskLevel}</span>
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker(st.center, { icon }).addTo(nationalMap);

      // Dark Restyled Popup
      marker.bindPopup(`
        <div style="min-width: 210px; font-family: var(--font-sans);">
          <div class="map-popup-state-title">
            <span>${st.name}</span>
            <span style="font-size: 10px; color: var(--landing-emerald-light); font-family: var(--font-mono);">${st.code}</span>
          </div>
          <div class="map-popup-state-sub">
            ${st.emblemSubtitle}
          </div>
          <div class="map-popup-stats-box">
            <div class="map-popup-stats-row">
              <span>Monitored Districts:</span>
              <strong>${st.districts.length}</strong>
            </div>
            <div class="map-popup-stats-row">
              <span>Active Telemetry Nodes:</span>
              <strong style="font-family: var(--font-mono);">${st.activeSensorsCount}</strong>
            </div>
            <div class="map-popup-stats-row">
              <span>Threat Level:</span>
              <strong style="color: ${riskColor};">${st.riskLevel}</strong>
            </div>
          </div>
          <button onclick="window.openStateLoginModal('${st.id}')" class="btn-popup-access">
            ${ICONS.lock}
            <span>ACCESS COMMAND CENTER</span>
          </button>
        </div>
      `);

      // Direct Click on marker executes state modal
      marker.on('click', () => {
        openStateLoginModal(st.id);
      });
    });

    // Invalidate size on load
    setTimeout(() => {
      if (nationalMap) nationalMap.invalidateSize();
    }, 150);
  }

  // Expose global modal opener for inline click attributes
  window.openStateLoginModal = openStateLoginModal;

  render();

  return {
    element: container,
    destroy: () => {
      if (globeAnimationId) {
        cancelAnimationFrame(globeAnimationId);
        globeAnimationId = null;
      }
      if (nationalMap) {
        nationalMap.remove();
        nationalMap = null;
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
      if (sectionObserver) {
        sectionObserver.disconnect();
        sectionObserver = null;
      }
    }
  };
}
