// Standalone National Environmental Intelligence Network Landing Page View

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATES_CONFIG, NATIONAL_OVERVIEW, NATIONAL_TRENDS, SAFETY_ADVISORIES, ALL_ALERTS } from '../utils/mockData.js';
import { openStateLoginModal } from './StateLoginModal.js';
import { getRiskClass, getHazardIcon } from '../utils/formatters.js';

export function createLandingView() {
  const container = document.createElement('div');
  container.className = 'landing-page-root animated-fade';

  let nationalMap = null;
  let globeAnimationId = null;
  let globeCanvas = null;

  function render() {
    container.innerHTML = `
      <!-- Phase 1 to 4: Cinematic Boot Animation & 3D Globe Hero -->
      <div class="boot-animation-hero" id="landing-hero">
        <div class="boot-status-hud">
          <div class="hud-pill">
            <span class="hud-dot"></span>
            <span>NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--landing-text-muted); letter-spacing: 1px;">
            SYSTEM INITIALIZATION COMPLETE • LORAWAN MESH SYNCHRONIZED
          </div>
        </div>

        <!-- 3D Earth Globe Canvas (Phase 2 & 3) -->
        <div class="globe-canvas-wrapper">
          <canvas id="earth-globe-canvas" class="globe-canvas-element"></canvas>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>ACCESS STATE COMMAND CENTER</span>
            </button>
            <a href="#gis-risk-map" class="btn-landing-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              <span>Explore National GIS Map</span>
            </a>
          </div>
        </div>
      </div>

      <!-- National Header (Sticky Navigation) -->
      <header class="national-header">
        <div class="national-header-left">
          <div class="gov-emblem-badge" title="National Disaster Intelligence">
            🇮🇳
          </div>
          <div class="national-title-group">
            <span class="national-brand-title">NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
            <span class="national-brand-sub">National Environmental Monitoring & Response System</span>
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
            <span>24×7 Emergency Network:</span>
            <strong>112 / 1070</strong>
          </div>
          <button class="btn-landing-primary" style="padding: 8px 18px; font-size: 13px;" id="btn-nav-login">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>AUTHORITY LOGIN</span>
          </button>
        </div>
      </header>

      <!-- Section 1: National GIS Risk Map -->
      <section class="landing-section" id="gis-risk-map">
        <div class="landing-section-header">
          <span class="landing-section-tag">GEOSPATIAL SITUATIONAL AWARENESS</span>
          <h2 class="landing-section-title">NATIONAL ENVIRONMENTAL RISK MAP</h2>
          <p class="landing-section-sub">Live multi-hazard environmental intelligence across monitored regions — Click any state to authenticate</p>
        </div>

        <div class="gis-map-card-landing">
          <div class="gis-map-header-landing">
            <div class="gis-map-title-text">
              <span>🗺️ ALL-INDIA ENVIRONMENTAL MONITORING NETWORK</span>
              <span class="hud-pill" style="padding: 2px 8px; font-size: 10px;">LIVE GIS OVERVIEW</span>
            </div>
            <div style="font-size: 12px; color: var(--landing-text-muted);">
              Click state node to initiate State Command Center Authentication
            </div>
          </div>

          <div style="position: relative;">
            <div id="national-gis-map"></div>
            <div class="national-map-helper-badge">
              <span>📍 Select state jurisdiction on the map to enter State Command Center</span>
            </div>
          </div>
        </div>

        <!-- Section 2: National Overview 4-KPI Tiles -->
        <div class="national-kpi-grid" id="national-overview" style="margin-top: 36px;">
          <div class="kpi-tile-landing">
            <div class="kpi-tile-top">
              <span>MONITORED STATES</span>
              <span>🇮🇳</span>
            </div>
            <div class="kpi-tile-val">${NATIONAL_OVERVIEW.totalMonitoredStates}</div>
            <div class="kpi-tile-sub">State SDMAs Connected</div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-top">
              <span>ACTIVE EDGE NODES</span>
              <span>📡</span>
            </div>
            <div class="kpi-tile-val">${NATIONAL_OVERVIEW.totalActiveEdgeNodes.toLocaleString()}</div>
            <div class="kpi-tile-sub">LoRaWAN & Hydro Mesh</div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-top">
              <span>ACTIVE ALERTS</span>
              <span>🚨</span>
            </div>
            <div class="kpi-tile-val" style="color: #ef4444;">${NATIONAL_OVERVIEW.activeNationalAlerts}</div>
            <div class="kpi-tile-sub">${NATIONAL_OVERVIEW.criticalIncidentsNationwide} Critical Incidents</div>
          </div>

          <div class="kpi-tile-landing">
            <div class="kpi-tile-top">
              <span>NETWORK UPTIME</span>
              <span>🛡️</span>
            </div>
            <div class="kpi-tile-val" style="color: var(--landing-emerald-light);">${NATIONAL_OVERVIEW.nationalUptime}%</div>
            <div class="kpi-tile-sub">${NATIONAL_OVERVIEW.satelliteSyncStatus}</div>
          </div>
        </div>
      </section>

      <!-- Section 3: Current Trends -->
      <section class="landing-section" id="current-trends">
        <div class="landing-section-header">
          <span class="landing-section-tag">MULTI-TEMPORAL RISK TRAJECTORIES</span>
          <h2 class="landing-section-title">CURRENT ENVIRONMENTAL TRENDS</h2>
          <p class="landing-section-sub">National aggregate patterns across hydrological, meteorological, and thermal indices</p>
        </div>

        <div class="trends-grid-landing">
          ${NATIONAL_TRENDS.map(t => `
            <div class="trend-card-landing">
              <div>
                <div class="trend-card-top">
                  <span class="trend-card-icon">${t.icon}</span>
                  <span class="trend-level-pill" style="background: rgba(16, 185, 129, 0.12); color: ${t.color}; border: 1px solid var(--landing-border);">
                    ${t.level}
                  </span>
                </div>
                <h3 class="trend-hazard-name">${t.hazard}</h3>
              </div>
              <p class="trend-card-summary">${t.summary}</p>
              <div style="border-top: 1px solid var(--landing-border); padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: var(--landing-text-muted);">Weekly Trajectory:</span>
                <span class="trend-delta-text">${t.trend}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Section 4: Safety Advisory -->
      <section class="landing-section" id="safety-advisory">
        <div class="landing-section-header">
          <span class="landing-section-tag">OFFICIAL STANDARD OPERATING GUIDELINES</span>
          <h2 class="landing-section-title">NATIONAL SAFETY ADVISORIES</h2>
          <p class="landing-section-sub">Authoritative civil defense and multi-hazard response guidelines for operational sectors</p>
        </div>

        <div class="advisory-grid-landing">
          ${SAFETY_ADVISORIES.map(adv => `
            <div class="advisory-card-landing">
              <div class="advisory-icon-wrap">${adv.icon}</div>
              <div>
                <h3 class="advisory-title">${adv.type}</h3>
                <span class="advisory-action-tag">ACTION: ${adv.action}</span>
                <p class="advisory-body">${adv.details}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Section 5: Active Demonstration Alerts -->
      <section class="landing-section" id="active-alerts">
        <div class="landing-section-header">
          <span class="landing-section-tag">REAL-TIME EARLY WARNING DISPATCHES</span>
          <h2 class="landing-section-title">ACTIVE ENVIRONMENTAL ALERTS</h2>
          <p class="landing-section-sub">National network telemetry dispatches — <span style="color: var(--landing-emerald-light); font-weight: 700;">DEMONSTRATION DATA</span></p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${ALL_ALERTS.slice(0, 4).map(alert => {
            const riskCls = getRiskClass(alert.severity);
            const stateMatch = STATES_CONFIG.find(s => s.id === alert.stateId);
            return `
              <div class="trend-card-landing" style="flex-direction: row; align-items: center; justify-content: space-between; padding: 18px 24px; cursor: pointer;" onclick="window.openStateLoginModal('${alert.stateId}')">
                <div style="display: flex; align-items: center; gap: 18px;">
                  <div style="font-size: 28px;">${getHazardIcon(alert.hazard)}</div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span class="hud-pill" style="font-size: 10px; padding: 2px 8px; color: ${alert.severity === 'Critical' ? '#ef4444' : '#f59e0b'};">
                        ${alert.severity.toUpperCase()}
                      </span>
                      <span style="font-size: 14px; font-weight: 700; color: #FFFFFF;">${alert.title}</span>
                      <span style="font-size: 11px; color: var(--landing-text-muted); font-family: var(--font-mono);">${stateMatch ? stateMatch.name : alert.stateId}</span>
                    </div>
                    <div style="font-size: 12px; color: var(--landing-text-secondary);">${alert.description}</div>
                  </div>
                </div>

                <div style="text-align: right; white-space: nowrap;">
                  <div style="font-size: 11px; color: var(--landing-text-muted); margin-bottom: 6px;">⏱️ ${alert.timeAgo}</div>
                  <button class="btn-landing-secondary" style="padding: 6px 14px; font-size: 12px;">
                    Enter ${stateMatch ? stateMatch.name : alert.stateId} Command →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 6: State Authority Access -->
      <section class="landing-section" id="authority-access">
        <div class="landing-section-header">
          <span class="landing-section-tag">STATE JURISDICTION GATEWAY</span>
          <h2 class="landing-section-title">STATE COMMAND CENTER ACCESS</h2>
          <p class="landing-section-sub">Select your authorized state jurisdiction to establish an encrypted operational session</p>
        </div>

        <div class="state-cards-grid">
          ${STATES_CONFIG.map(st => `
            <div class="state-access-card" data-state-id="${st.id}">
              <div>
                <div class="state-card-header">
                  <span class="state-name-main">${st.name}</span>
                  <span class="state-code-badge">${st.code}</span>
                </div>
                <div style="font-size: 11px; color: var(--landing-emerald-light); font-weight: 600; margin: 4px 0 12px;">
                  ${st.emblemSubtitle}
                </div>
                <div class="state-card-meta">
                  <div class="state-card-meta-row">
                    <span>Monitored Districts:</span>
                    <strong>${st.districts.length} Sectors</strong>
                  </div>
                  <div class="state-card-meta-row">
                    <span>Active Telemetry Nodes:</span>
                    <strong style="font-family: var(--font-mono);">${st.activeSensorsCount} Nodes</strong>
                  </div>
                  <div class="state-card-meta-row">
                    <span>Primary Threat Model:</span>
                    <span style="font-weight: 600; color: ${st.riskLevel === 'CRITICAL' ? '#ef4444' : st.riskLevel === 'WARNING' ? '#f59e0b' : 'var(--landing-emerald-light)'};">
                      ${st.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <button class="btn-state-login-cta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>AUTHENTICATE JURISDICTION</span>
              </button>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Institutional Footer -->
      <footer class="national-footer">
        <div class="footer-content-wrap">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <div class="gov-emblem-badge" style="width: 32px; height: 32px; font-size: 16px;">🇮🇳</div>
              <span style="font-weight: 800; font-size: 14px; color: #FFFFFF;">NATIONAL ENVIRONMENTAL INTELLIGENCE NETWORK</span>
            </div>
            <p style="font-size: 12px; color: var(--landing-text-secondary); line-height: 1.6; max-width: 440px;">
              Integrated Government of India environmental telemetry, edge sensor aggregation, and multi-hazard early warning network connecting State Disaster Management Authorities nationwide.
            </p>
          </div>

          <div>
            <div class="footer-col-title">Navigation</div>
            <div class="footer-links-list">
              <a href="#gis-risk-map">GIS Risk Map</a>
              <a href="#national-overview">National Overview</a>
              <a href="#current-trends">Current Trends</a>
              <a href="#safety-advisory">Safety Advisories</a>
              <a href="#authority-access">State Access</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Authority Portals</div>
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
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--landing-text-secondary);">
              <div>National Emergency: <strong style="color: #FFFFFF; font-family: var(--font-mono);">112</strong></div>
              <div>State EOC Helpline: <strong style="color: #FFFFFF; font-family: var(--font-mono);">1070</strong></div>
              <div>District Disaster Control: <strong style="color: #FFFFFF; font-family: var(--font-mono);">1077</strong></div>
              <div>NDRF Operations: <strong style="color: #FFFFFF; font-family: var(--font-mono);">011-24363260</strong></div>
            </div>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div>© 2026 National Environmental Intelligence Network • Official Authority Portal • Government of India</div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--landing-emerald-light);">
            EDGE INGESTION: 2.4k pkt/s • CAP-INDIA GATEWAY: ONLINE
          </div>
        </div>
      </footer>
    `;

    // Attach Handlers
    container.querySelector('#btn-hero-authority-login')?.addEventListener('click', () => openStateLoginModal('TN'));
    container.querySelector('#btn-nav-login')?.addEventListener('click', () => openStateLoginModal('TN'));

    container.querySelectorAll('.state-access-card').forEach(card => {
      card.addEventListener('click', () => {
        const stateId = card.getAttribute('data-state-id');
        openStateLoginModal(stateId);
      });
    });

    // Initialize 3D Canvas Globe
    setTimeout(() => {
      init3DGlobeCanvas();
      initNationalGISMap();
    }, 60);
  }

  // ========================================================================
  // 3D EARTH GLOBE CANVAS ANIMATION (Phase 2 & 3)
  // ========================================================================
  function init3DGlobeCanvas() {
    globeCanvas = container.querySelector('#earth-globe-canvas');
    if (!globeCanvas) return;
    const ctx = globeCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 480;
    globeCanvas.width = size * dpr;
    globeCanvas.height = size * dpr;
    globeCanvas.style.width = `${size}px`;
    globeCanvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = 190;
    const centerX = size / 2;
    const centerY = size / 2;
    let rotationAngle = 0;
    let tiltAngle = 0.38; // Radians

    // Generate geographic dot points on sphere (India cluster + global distribution)
    const points = [];
    const numPoints = 650;
    for (let i = 0; i < numPoints; i++) {
      const lat = Math.asin(2 * Math.random() - 1);
      const lon = 2 * Math.PI * Math.random();
      
      // Determine if point is in India region (~lat 8 to 35 N, lon 68 to 97 E)
      const latDeg = (lat * 180) / Math.PI;
      const lonDeg = (lon * 180) / Math.PI;
      const isIndia = latDeg >= 8 && latDeg <= 36 && lonDeg >= 68 && lonDeg <= 96;

      points.push({ lat, lon, isIndia });
    }

    // Explicit state markers on the globe
    const stateNodes = STATES_CONFIG.map(st => ({
      name: st.name,
      lat: (st.center[0] * Math.PI) / 180,
      lon: (st.center[1] * Math.PI) / 180,
      risk: st.riskLevel
    }));

    function animateGlobe() {
      ctx.clearRect(0, 0, size, size);
      rotationAngle += 0.007;

      // 1. Draw Globe Deep Atmosphere Background Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.15);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.04)');
      glowGrad.addColorStop(0.8, 'rgba(16, 185, 129, 0.18)');
      glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Dark Sphere Fill
      const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.35, centerY - radius * 0.35, radius * 0.2, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#0a2316');
      sphereGrad.addColorStop(0.7, '#04120a');
      sphereGrad.addColorStop(1, '#010604');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Globe Edge Ring (Atmospheric Rim)
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Parallels & Meridians (Latitude / Longitude Wireframe)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
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
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 1.5})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 2.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.45})`;
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
          const pulseRadius = 6 + Math.sin(Date.now() * 0.005) * 3;
          ctx.strokeStyle = st.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(52, 211, 153, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid dot
          ctx.fillStyle = st.risk === 'CRITICAL' ? '#ef4444' : '#10b981';
          ctx.beginPath();
          ctx.arc(screenX, screenY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 7. Orbital Arc Trace
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
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
  // NATIONAL LEAFLET GIS MAP (Full India with State Nodes)
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
      const riskColor = st.riskLevel === 'CRITICAL' ? '#ef4444' : st.riskLevel === 'WARNING' ? '#f59e0b' : st.riskLevel === 'SEVERE' ? '#dc2626' : '#10b981';
      
      // Outer zone polygon or circle
      L.circle(st.center, {
        radius: 120000,
        color: riskColor,
        weight: 1.5,
        opacity: 0.8,
        fillColor: riskColor,
        fillOpacity: 0.15,
        className: 'national-state-boundary'
      }).addTo(nationalMap);

      // Custom State Emblem Marker
      const icon = L.divIcon({
        className: 'national-state-node-icon',
        html: `
          <div style="background: rgba(1, 6, 4, 0.95); border: 2px solid ${riskColor}; color: #FFFFFF; padding: 4px 8px; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 6px; font-family: var(--font-sans); white-space: nowrap; cursor: pointer;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${riskColor}; display: inline-block;"></span>
            <strong style="font-size: 11px;">${st.name}</strong>
            <span style="font-size: 9px; padding: 1px 4px; background: ${riskColor}; color: #fff; border-radius: 3px; font-weight: 700;">${st.riskLevel}</span>
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker(st.center, { icon }).addTo(nationalMap);

      // Popup with state telemetry summary and CTA
      marker.bindPopup(`
        <div style="padding: 10px; font-family: var(--font-sans); color: #17212B; min-width: 220px;">
          <div style="font-weight: 800; font-size: 14px; color: #1E4D78; margin-bottom: 2px;">
            ${st.name} (${st.code})
          </div>
          <div style="font-size: 11px; color: #52606D; margin-bottom: 8px;">
            ${st.emblemSubtitle}
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; margin-bottom: 10px; background: #F8FAFC; padding: 6px 8px; border-radius: 4px; border: 1px solid #D9E1E8;">
            <div>Monitored Districts: <strong>${st.districts.length}</strong></div>
            <div>Active Edge Sensors: <strong>${st.activeSensorsCount} Nodes</strong></div>
            <div>Threat Level: <strong style="color: ${riskColor};">${st.riskLevel}</strong></div>
          </div>
          <button onclick="window.openStateLoginModal('${st.id}')" style="width: 100%; background: #1E4D78; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 11px; cursor: pointer;">
            🛡️ Access ${st.name} Command
          </button>
        </div>
      `);

      // Clicking marker or zone opens login modal directly
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
    }
  };
}
