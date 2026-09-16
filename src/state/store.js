// Global Reactive Application Store with State Authority Data Isolation

import {
  STATES_CONFIG,
  ALL_SENSORS,
  ALL_ALERTS,
  ALL_INCIDENTS,
  ALL_TEAMS,
  ALL_SHELTERS,
  STATE_HAZARD_ZONES,
  STATE_AI_PREDICTIONS,
  NATIONAL_OVERVIEW
} from '../utils/mockData.js';
import { audioAlert } from '../utils/audioAlert.js';

class AppStore {
  constructor() {
    // Default unauthenticated landing state
    this.state = {
      authenticated: false,
      loggedInState: 'Tamil Nadu',
      loggedInStateId: 'TN',
      loggedInOfficerRole: 'STATE_AUTHORITY',
      selectedRegionId: 'avinashi',
      uiMode: 'LANDING', // LANDING | OPERATIONAL
      currentView: 'landing', // landing, dashboard, risk-map, dynamic-risk, alerts, ai-prediction, sensors, analytics, incidents, reports, staff-services, settings
      soundEnabled: true,

      // Live Scoped Operational Data
      alerts: JSON.parse(JSON.stringify(ALL_ALERTS.filter(a => a.stateId === 'TN'))),
      sensors: JSON.parse(JSON.stringify(ALL_SENSORS.filter(s => s.stateId === 'TN'))),
      incidents: JSON.parse(JSON.stringify(ALL_INCIDENTS.filter(i => i.stateId === 'TN'))),
      teams: JSON.parse(JSON.stringify(ALL_TEAMS.filter(t => t.stateId === 'TN'))),
      shelters: JSON.parse(JSON.stringify(ALL_SHELTERS.filter(s => s.stateId === 'TN'))),

      // Active Map Layer Toggles
      mapLayers: {
        fire: true,
        flood: true,
        air: true,
        heat: true,
        sensors: true,
        teams: true,
        shelters: true
      },

      // AI Risk Intelligence State
      aiPrediction: JSON.parse(JSON.stringify(STATE_AI_PREDICTIONS.TN)),

      // Top Operational Statistics (State Scoped)
      kpi: {
        totalSensors: ALL_SENSORS.filter(s => s.stateId === 'TN').length,
        onlineSensors: ALL_SENSORS.filter(s => s.stateId === 'TN' && s.status === 'Online').length,
        activeAlerts: ALL_ALERTS.filter(a => a.stateId === 'TN').length,
        criticalIncidents: ALL_INCIDENTS.filter(i => i.stateId === 'TN' && i.status === 'ACTIVE').length,
        uptime: 98.4,
        latencyMs: 142
      },

      // Drilldown Selection State
      selectedSensor: null,
      selectedIncident: null,
      selectedAlert: null,
      activeScenario: 'baseline',

      // Map Ticker Feed
      tickerMessages: [
        'Noyyal River discharge monitoring active for Avinashi & Coimbatore downstream',
        'INSAT-3DR satellite multi-spectral cloud imagery updated 3 mins ago',
        'State EOC Telemetry Mesh latency nominal: 142ms across edge nodes',
        'NDRF Rapid Assessment Unit on standby for high-risk catchment corridors',
        'Soil saturation telemetry synced via LoRaWAN edge transceivers'
      ]
    };

    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.listeners.forEach(fn => {
      try {
        fn(this.state, event, payload);
      } catch (err) {
        console.error(`Error in store subscriber for event "${event}":`, err);
      }
    });
  }

  // ========================================================================
  // STATE AUTHORITY AUTHENTICATION & SESSION MANAGEMENT
  // ========================================================================

  loginStateAuthority(stateId, role = 'STATE_AUTHORITY', credentials = '') {
    const targetState = STATES_CONFIG.find(s => s.id === stateId) || STATES_CONFIG[0];
    
    // Establish authorized session
    this.state.authenticated = true;
    this.state.loggedInState = targetState.name;
    this.state.loggedInStateId = targetState.id;
    this.state.loggedInOfficerRole = role;
    this.state.selectedRegionId = targetState.districts[0]?.id || 'default';
    this.state.uiMode = 'OPERATIONAL';
    this.state.currentView = 'dashboard';

    // Strictly load & filter data for the authenticated jurisdiction
    this.loadStateScopedData(targetState.id);

    this.notify('auth_login', { stateId: targetState.id, stateName: targetState.name, role });
    this.notify('view_change', 'dashboard');
    return true;
  }

  logoutAuthority() {
    this.state.authenticated = false;
    this.state.loggedInState = null;
    this.state.loggedInStateId = null;
    this.state.loggedInOfficerRole = null;
    this.state.uiMode = 'LANDING';
    this.state.currentView = 'landing';
    this.state.activeScenario = 'baseline';

    this.notify('auth_logout', null);
    this.notify('view_change', 'landing');
  }

  loadStateScopedData(stateId) {
    // 1. Scoped Sensors
    this.state.sensors = JSON.parse(JSON.stringify(ALL_SENSORS.filter(s => s.stateId === stateId)));
    if (this.state.sensors.length === 0) {
      // Fallback generator for states without explicit manual nodes
      this.state.sensors = this.generateSyntheticSensorsForState(stateId);
    }

    // 2. Scoped Alerts
    this.state.alerts = JSON.parse(JSON.stringify(ALL_ALERTS.filter(a => a.stateId === stateId)));
    if (this.state.alerts.length === 0) {
      this.state.alerts = this.generateSyntheticAlertsForState(stateId);
    }

    // 3. Scoped Incidents
    this.state.incidents = JSON.parse(JSON.stringify(ALL_INCIDENTS.filter(i => i.stateId === stateId)));
    if (this.state.incidents.length === 0) {
      this.state.incidents = this.generateSyntheticIncidentsForState(stateId);
    }

    // 4. Scoped Teams & Shelters
    this.state.teams = JSON.parse(JSON.stringify(ALL_TEAMS.filter(t => t.stateId === stateId)));
    this.state.shelters = JSON.parse(JSON.stringify(ALL_SHELTERS.filter(s => s.stateId === stateId)));

    // 5. Scoped AI Model
    this.state.aiPrediction = JSON.parse(JSON.stringify(
      STATE_AI_PREDICTIONS[stateId] || STATE_AI_PREDICTIONS.TN
    ));

    // 6. Recompute KPI
    const onlineCount = this.state.sensors.filter(s => s.status === 'Online').length;
    const critIncidents = this.state.incidents.filter(i => i.status === 'ACTIVE').length;
    this.state.kpi = {
      totalSensors: this.state.sensors.length,
      onlineSensors: onlineCount,
      activeAlerts: this.state.alerts.length,
      criticalIncidents: critIncidents,
      uptime: 98.4,
      latencyMs: Math.floor(130 + Math.random() * 25)
    };

    // 7. Update Ticker Messages for the State
    const stateConfig = STATES_CONFIG.find(s => s.id === stateId);
    if (stateConfig) {
      this.state.tickerMessages = [
        `${stateConfig.name} SDMA Emergency Command Center operational — ${stateConfig.activeHazardsCount} active hazards monitored`,
        `Edge telemetry stream active across ${stateConfig.districts.length} monitored district sectors`,
        `Primary threat model: ${stateConfig.primaryThreat}`,
        `INSAT-3DR meteorological satellite imagery synchronized`,
        `CAP-India cell broadcast gateway connected to state telecom towers`
      ];
    }
  }

  // ========================================================================
  // JURISDICTION DATA HELPERS & SELECTORS
  // ========================================================================

  getAuthorizedStateId() {
    return this.state.loggedInStateId || 'TN';
  }

  getAuthorizedStateConfig() {
    const id = this.getAuthorizedStateId();
    return STATES_CONFIG.find(s => s.id === id) || STATES_CONFIG[0];
  }

  getAuthorizedDistricts() {
    return this.getAuthorizedStateConfig().districts || [];
  }

  getAuthorizedHazardZones() {
    const id = this.getAuthorizedStateId();
    return STATE_HAZARD_ZONES[id] || { type: 'FeatureCollection', features: [] };
  }

  // Synthetic generators for scalability to unlisted states
  generateSyntheticSensorsForState(stateId) {
    const st = STATES_CONFIG.find(s => s.id === stateId) || STATES_CONFIG[0];
    const baseLat = st.center[0];
    const baseLng = st.center[1];
    return [
      { id: `${stateId}-CTR-001`, stateId, name: `${st.name} Central Hydro-Tower`, location: `${st.districts[0]?.name || st.name}`, lat: baseLat + 0.02, lng: baseLng + 0.02, status: 'Online', risk: 'Moderate', battery: 88, signal: -62, temp: 26.5, hum: 76, pm25: 45, waterLevel: 2.3, soilMoisture: 65, type: 'water', health: 'Active', lastDataTime: new Date().toISOString() },
      { id: `${stateId}-WRN-002`, stateId, name: `${st.name} River Basin Gauge`, location: `${st.districts[1]?.name || st.name}`, lat: baseLat - 0.03, lng: baseLng + 0.04, status: 'Online', risk: 'Low', battery: 92, signal: -58, temp: 27.1, hum: 72, pm25: 38, waterLevel: 1.6, soilMoisture: 52, type: 'water', health: 'Active', lastDataTime: new Date().toISOString() },
      { id: `${stateId}-AQI-003`, stateId, name: `${st.name} Urban AQI Sentinel`, location: `${st.name} Capital Corridor`, lat: baseLat + 0.05, lng: baseLng - 0.02, status: 'Online', risk: 'Low', battery: 85, signal: -64, temp: 28.4, hum: 68, pm25: 52, waterLevel: 1.1, soilMoisture: 42, type: 'air', health: 'Active', lastDataTime: new Date().toISOString() }
    ];
  }

  generateSyntheticAlertsForState(stateId) {
    const st = STATES_CONFIG.find(s => s.id === stateId) || STATES_CONFIG[0];
    return [
      {
        id: `ALT-${stateId}-001`,
        stateId,
        hazard: 'Flood Watch',
        severity: 'Warning',
        title: `${st.name} River Basin Inundation Watch`,
        location: `${st.districts[0]?.name || st.name}`,
        timeAgo: '10 min ago',
        timestamp: '19:15',
        aiConfidence: 87,
        description: `Monitored precipitation across ${st.name} catchment sectors indicate heightened runoff velocity.`,
        coordinates: st.center,
        sensorId: `${stateId}-CTR-001`
      }
    ];
  }

  generateSyntheticIncidentsForState(stateId) {
    const st = STATES_CONFIG.find(s => s.id === stateId) || STATES_CONFIG[0];
    return [
      {
        id: `${stateId}-INC-001`,
        stateId,
        hazard: 'Catchment Surge',
        severity: 'Warning',
        title: `${st.name} Riverine Pre-Emptive SOG`,
        location: `${st.districts[0]?.name || st.name}`,
        affectedArea: '3.8 km²',
        detectedTime: '18:15',
        status: 'ACTIVE',
        aiRisk: 78,
        assignedTeam: `${st.code} Rapid Rescue Squad`,
        coordinates: st.center,
        sop: [
          { id: 'sop-1', label: 'Threshold breach acknowledged', done: true, time: '18:15' },
          { id: 'sop-2', label: 'District EOC alert dispatched', done: true, time: '18:22' },
          { id: 'sop-3', label: 'Field verification Squad on site', done: true, time: '18:50' },
          { id: 'sop-4', label: 'Downstream sluice control active', done: false, time: 'Pending' }
        ]
      }
    ];
  }

  // ========================================================================
  // ROUTING & VIEW SWITCHING
  // ========================================================================

  setView(viewName) {
    this.state.currentView = viewName;
    if (viewName === 'landing') {
      this.state.uiMode = 'LANDING';
    } else {
      this.state.uiMode = 'OPERATIONAL';
    }
    this.notify('view_change', viewName);
  }

  setRegion(regionId) {
    this.state.selectedRegionId = regionId;
    this.notify('region_change', regionId);
  }

  toggleLayer(layerKey) {
    if (this.state.mapLayers[layerKey] !== undefined) {
      this.state.mapLayers[layerKey] = !this.state.mapLayers[layerKey];
      this.notify('layer_toggle', { key: layerKey, active: this.state.mapLayers[layerKey] });
    }
  }

  toggleSound() {
    const isEnabled = audioAlert.toggleSound();
    this.state.soundEnabled = isEnabled;
    this.notify('sound_toggle', isEnabled);
    return isEnabled;
  }

  openSensorModal(sensorId) {
    const sensor = this.state.sensors.find(s => s.id === sensorId);
    if (sensor) {
      this.state.selectedSensor = sensor;
      this.notify('open_sensor_modal', sensor);
    }
  }

  openIncidentModal(incidentId) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (incident) {
      this.state.selectedIncident = incident;
      this.notify('open_incident_modal', incident);
    }
  }

  openAlertModal(alertId) {
    const alert = this.state.alerts.find(a => a.id === alertId);
    if (alert) {
      this.state.selectedAlert = alert;
      this.notify('open_alert_modal', alert);
    }
  }

  toggleSOPStep(incidentId, stepId) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (incident) {
      const step = incident.sop.find(s => s.id === stepId);
      if (step) {
        step.done = !step.done;
        step.time = step.done
          ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          : 'Pending';

        const allDone = incident.sop.every(s => s.done);
        if (allDone) {
          incident.status = 'RESOLVED';
        } else if (incident.sop[3] && incident.sop[3].done) {
          incident.status = 'IN PROGRESS';
        }

        this.notify('sop_update', { incidentId, stepId, done: step.done });
      }
    }
  }

  assignTeamToIncident(incidentId, teamId) {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    const team = this.state.teams.find(t => t.id === teamId);
    if (incident && team) {
      incident.assignedTeam = `${team.name} (${team.type})`;
      team.status = 'Deployed';

      const step4 = incident.sop.find(s => s.id === 'sop-4');
      if (step4) {
        step4.done = true;
        step4.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      this.notify('team_assigned', { incident, team });
    }
  }

  addAlert(alertData) {
    this.state.alerts.unshift(alertData);
    this.state.kpi.activeAlerts = this.state.alerts.length;
    if (alertData.severity === 'Critical') {
      this.state.kpi.criticalIncidents += 1;
      audioAlert.playCriticalSiren();
    } else {
      audioAlert.playPing();
    }
    this.notify('new_alert', alertData);
  }

  updateSimulation(sensorUpdates, kpiUpdates, aiUpdate) {
    if (sensorUpdates) {
      sensorUpdates.forEach(upd => {
        const s = this.state.sensors.find(item => item.id === upd.id);
        if (s) {
          Object.assign(s, upd);
        }
      });
    }
    if (kpiUpdates) {
      Object.assign(this.state.kpi, kpiUpdates);
    }
    if (aiUpdate) {
      Object.assign(this.state.aiPrediction, aiUpdate);
    }
    this.notify('telemetry_tick', this.state);
  }
}

export const store = new AppStore();
