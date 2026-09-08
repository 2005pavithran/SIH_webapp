// Live Telemetry Simulation Engine & Scenario Injector for Demonstrations

import { store } from './store.js';
import { showToast } from '../components/ToastNotification.js';

class SimulationEngine {
  constructor() {
    this.interval = null;
    this.tickCount = 0;
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 3000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  tick() {
    this.tickCount++;
    const state = store.getState();

    // 1. Apply micro-fluctuations to sensors
    const sensorUpdates = state.sensors.map(sensor => {
      const tempJitter = (Math.random() * 0.4 - 0.2);
      const waterJitter = sensor.type === 'water' ? (Math.random() * 0.04 - 0.02) : 0;
      const pm25Jitter = Math.floor(Math.random() * 5 - 2);

      const newWater = sensor.waterLevel ? Math.max(0.2, Number((sensor.waterLevel + waterJitter).toFixed(2))) : sensor.waterLevel;
      const newTemp = Number((sensor.temp + tempJitter).toFixed(1));
      const newPm25 = Math.max(10, sensor.pm25 + pm25Jitter);

      return {
        id: sensor.id,
        temp: newTemp,
        waterLevel: newWater,
        pm25: newPm25
      };
    });

    // 2. Micro-jitter latency and uptime
    const latencyMs = Math.floor(135 + Math.random() * 20);

    store.updateSimulation(sensorUpdates, { latencyMs }, null);
  }

  triggerFlashFloodScenario() {
    const state = store.getState();
    state.activeScenario = 'flood';

    const sensorUpdates = [
      { id: 'N-003', waterLevel: 4.35, risk: 'Critical', soilMoisture: 97, temp: 23.2 },
      { id: 'N-002', waterLevel: 3.10, risk: 'High', soilMoisture: 84 },
      { id: 'N-006', soilMoisture: 98, risk: 'Critical' }
    ];

    const aiUpdate = {
      hazard: 'Flood',
      riskScore: 96,
      riskLevel: 'Critical',
      trend: '↗ SURGING (+1.2m/hr)',
      predictionText: 'URGENT: Hydro-surge peak arriving at Vythiri Gorge in 35 mins. Expected inundation depth +1.4m above red danger level.',
      factors: [
        { name: 'Upstream Hydro Level (Sensor N-003)', weight: 45, value: '4.35m / Danger 3.2m', impact: 'critical' },
        { name: 'Catchment Cloudburst Intensity', weight: 32, value: '118 mm/hr', impact: 'critical' },
        { name: 'Inundation Velocity', weight: 14, value: '+0.88 m/hr', impact: 'critical' },
        { name: 'Catchment Soil Saturation', weight: 9, value: '98% (Saturated)', impact: 'high' }
      ]
    };

    store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

    store.addAlert({
      id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
      hazard: 'Flood',
      severity: 'Critical',
      title: '🚨 CRITICAL FLASH FLOOD SURGE TRIGGERED',
      location: 'District X • Gorge Pass Sector C',
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aiConfidence: 98,
      description: 'Runoff from Chembra catchment cresting. Inundation buffer expanding rapidly.',
      coordinates: [11.662, 76.115],
      sensorId: 'N-003'
    });

    showToast('🚨 SIMULATION: Flash Flood Surge Triggered in District X! Gauge N-003 at 4.35m.', 'crit');
  }

  triggerWildfireScenario() {
    const state = store.getState();
    state.activeScenario = 'fire';

    const sensorUpdates = [
      { id: 'N-011', temp: 48.2, hum: 14, pm25: 340, risk: 'Critical' },
      { id: 'N-004', temp: 43.1, hum: 21, pm25: 220, risk: 'Critical' }
    ];

    const aiUpdate = {
      hazard: 'Forest Fire',
      riskScore: 93,
      riskLevel: 'Critical',
      trend: '↗ EXPANDING (Wind 34 km/h)',
      predictionText: 'High thermal plume detected at Zone Y. Rapid flame front advancing towards eastern wildlife perimeter corridor.',
      factors: [
        { name: 'Surface Thermal Signature (N-011)', weight: 42, value: '48.2°C (Extreme)', impact: 'critical' },
        { name: 'Relative Humidity Deficit', weight: 28, value: '14% (Severe Drought)', impact: 'critical' },
        { name: 'Wind Velocity & Direction', weight: 18, value: '34 km/h NE Gusts', impact: 'high' },
        { name: 'Fuel Moisture Index', weight: 12, value: '8.4% (Highly Combustible)', impact: 'high' }
      ]
    };

    store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

    store.addAlert({
      id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
      hazard: 'Forest Fire',
      severity: 'Critical',
      title: '🔥 RAPID WILDFIRE SPREAD DETECTED',
      location: 'Zone Y • Bandipur Forest Perimeter',
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aiConfidence: 95,
      description: 'Thermal radiance 48.2°C. Drone 02 alerted for airborne flame surveillance.',
      coordinates: [11.765, 76.245],
      sensorId: 'N-011'
    });

    showToast('🔥 SIMULATION: Wildfire Outbreak in Zone Y! Extreme thermal anomaly detected.', 'crit');
  }

  resetBaselineScenario() {
    const state = store.getState();
    state.activeScenario = 'baseline';

    const sensorUpdates = [
      { id: 'N-003', waterLevel: 2.8, risk: 'Moderate', soilMoisture: 72, temp: 28.5 },
      { id: 'N-011', temp: 34.2, hum: 42, pm25: 65, risk: 'Moderate' },
      { id: 'N-002', waterLevel: 2.1, risk: 'Low', soilMoisture: 55 }
    ];

    const aiUpdate = {
      hazard: 'Flood',
      riskScore: 68,
      riskLevel: 'Moderate',
      trend: '→ Stabilized',
      predictionText: 'Environmental metrics returning to normal seasonal threshold bands across all regional sensor networks.',
      factors: [
        { name: 'Upstream Hydro Level', weight: 30, value: '2.8m (Nominal)', impact: 'moderate' },
        { name: 'Catchment Precipitation', weight: 25, value: '18 mm/hr (Light)', impact: 'low' },
        { name: 'Rate of Rise', weight: 20, value: '+0.05 m/hr (Stable)', impact: 'low' },
        { name: 'Historical Model Norm', weight: 25, value: 'Within standard deviation', impact: 'low' }
      ]
    };

    store.updateSimulation(sensorUpdates, { criticalIncidents: 2 }, aiUpdate);
    showToast('✅ SIMULATION: Environmental conditions restored to nominal baseline.', 'info');
  }
}

export const simulationEngine = new SimulationEngine();
