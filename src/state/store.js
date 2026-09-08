// Global Reactive Application Store

import {
  INITIAL_ALERTS,
  INITIAL_SENSORS,
  INITIAL_INCIDENTS,
  RESPONSE_TEAMS,
  RELIEF_SHELTERS,
  AI_PREDICTION_FACTORS,
  REGIONS
} from '../utils/mockData.js';
import { audioAlert } from '../utils/audioAlert.js';

class AppStore {
  constructor() {
    this.state = {
      currentView: 'dashboard', // dashboard, live-map, risk-map, alerts, ai-prediction, sensors, analytics, incidents, reports, settings
      selectedRegionId: 'district-x',
      soundEnabled: true,
      
      // Live Data
      alerts: JSON.parse(JSON.stringify(INITIAL_ALERTS)),
      sensors: JSON.parse(JSON.stringify(INITIAL_SENSORS)),
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      teams: JSON.parse(JSON.stringify(RESPONSE_TEAMS)),
      shelters: JSON.parse(JSON.stringify(RELIEF_SHELTERS)),
      
      // Active Map Layers
      mapLayers: {
        fire: true,
        flood: true,
        air: true,
        heat: true,
        water: true,
        sensors: true,
        teams: true,
        shelters: true
      },

      // AI Risk Intelligence State
      aiPrediction: {
        hazard: 'Flood',
        riskScore: 87,
        riskLevel: 'Critical',
        trend: '↗ Increasing',
        predictionText: 'Risk likely to increase over next 3 hours with upstream runoff peaking at 21:00.',
        factors: JSON.parse(JSON.stringify(AI_PREDICTION_FACTORS))
      },

      // Top Statistics
      kpi: {
        totalSensors: 1284,
        onlineSensors: 1243,
        activeAlerts: 12,
        criticalIncidents: 4,
        uptime: 96.8,
        latencyMs: 142
      },

      // Selected items for modal drilldowns
      selectedSensor: null,
      selectedIncident: null,
      selectedAlert: null,
      activeScenario: 'baseline'
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
    this.listeners.forEach(fn => fn(this.state, event, payload));
  }

  setView(viewName) {
    this.state.currentView = viewName;
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
        step.time = step.done ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Pending';
        
        // Auto-check if all are done
        const allDone = incident.sop.every(s => s.done);
        if (allDone) {
          incident.status = 'RESOLVED';
        } else if (incident.sop[3].done) {
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
      
      // Mark step 4 as done
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
