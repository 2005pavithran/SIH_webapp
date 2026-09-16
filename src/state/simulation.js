// Live Telemetry Simulation Engine & Autonomous Edge-Node Engine

import { store } from './store.js';
import { showToast } from '../components/ToastNotification.js';

class SimulationEngine {
  constructor() {
    this.interval = null;
    this.tickCount = 0;
    this.avitick = 0;
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 3500);
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
    const nowIso = new Date().toISOString();

    // 1. Autonomous micro-fluctuations on active state sensors
    const sensorUpdates = state.sensors
      .filter(s => s.status !== 'Offline' && s.health !== 'Damaged')
      .map(sensor => {
        const tempJitter = (Math.random() * 0.3 - 0.15);
        const waterJitter = sensor.type === 'water' ? (Math.random() * 0.03 - 0.015) : 0;
        const pm25Jitter = Math.floor(Math.random() * 4 - 2);

        const newWater = sensor.waterLevel ? Math.max(0.2, Number((sensor.waterLevel + waterJitter).toFixed(2))) : sensor.waterLevel;
        const newTemp = sensor.temp ? Number((sensor.temp + tempJitter).toFixed(1)) : sensor.temp;
        const newPm25 = sensor.pm25 ? Math.max(10, sensor.pm25 + pm25Jitter) : sensor.pm25;

        return {
          id: sensor.id,
          temp: newTemp,
          waterLevel: newWater,
          pm25: newPm25,
          lastDataTime: nowIso
        };
      });

    // 2. Jitter edge mesh latency
    const latencyMs = Math.floor(132 + Math.sin(this.tickCount / 6) * 14 + Math.random() * 8);

    // 3. If Avinashi scenario is active (for TN)
    if (state.activeScenario === 'avinashi_flood' && state.loggedInStateId === 'TN') {
      this.avitick++;
      const stage = Math.min(5, this.avitick);
      const avinashiUpdates = [
        { id: 'TN-AVS-001', waterLevel: Number((1.9 + stage * 0.45).toFixed(2)), soilMoisture: 70 + stage * 5, risk: ['Low','Moderate','High','Critical','Critical','Critical'][stage] },
        { id: 'TN-AVS-002', waterLevel: Number((1.7 + stage * 0.38).toFixed(2)), soilMoisture: 66 + stage * 5, risk: ['Low','Low','Moderate','High','High','Critical'][stage] },
        { id: 'TN-AVS-003', waterLevel: Number((2.2 + stage * 0.42).toFixed(2)), soilMoisture: 72 + stage * 5, risk: ['Low','Moderate','High','High','Critical','Critical'][stage] },
        { id: 'TN-AVS-006', waterLevel: Number((1.8 + stage * 0.35).toFixed(2)), soilMoisture: 68 + stage * 4, risk: ['Low','Low','Moderate','High','High','High'][stage] },
        { id: 'TN-CBE-002', waterLevel: Number((2.3 + stage * 0.18).toFixed(2)), soilMoisture: 60 + stage * 3, risk: ['Moderate','Moderate','High','High','High','High'][stage] }
      ];

      avinashiUpdates.forEach(au => {
        const existing = sensorUpdates.find(u => u.id === au.id);
        if (existing) Object.assign(existing, au);
        else sensorUpdates.push(au);
      });

      if (this.avitick === 2 || this.avitick === 4) {
        const sev = this.avitick === 2 ? 'Warning' : 'Critical';
        store.addAlert({
          id: 'ALT-TN-AVS-' + this.tickCount,
          stateId: 'TN',
          hazard: 'Flood',
          severity: sev,
          title: this.avitick === 2 ? 'Avinashi Flood Surge Progression' : '🚨 AVS FLOOD EMERGENCY: Evacuate Low-Lying Riverbed',
          location: 'Avinashi • Noyyal River Gorge',
          timeAgo: 'Just now',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          aiConfidence: 93,
          description: this.avitick === 2
            ? 'Noyyal River water level rising 0.20 m/hr above watch threshold at 3.0 m.'
            : 'Danger level (3.8 m) breached at TN-AVS-001 Upstream. Sarkarsamakulam weir overflow imminent.',
          coordinates: [11.1920, 77.2050],
          sensorId: 'TN-AVS-001'
        });
      }
    }

    const kpiUpdates = {
      latencyMs,
      totalSensors: state.sensors.length,
      onlineSensors: state.sensors.filter(s => s.status === 'Online').length
    };

    store.updateSimulation(sensorUpdates, kpiUpdates, null);
  }

  triggerAvinashiFloodScenario() {
    const state = store.getState();
    state.activeScenario = 'avinashi_flood';
    this.avitick = 0;
    this.tickCount = 0;

    const sensorUpdates = [
      { id: 'TN-AVS-001', waterLevel: 2.45, risk: 'High', soilMoisture: 76, temp: 26.0, lastDataTime: new Date().toISOString() },
      { id: 'TN-AVS-002', waterLevel: 2.20, risk: 'Moderate', soilMoisture: 72, lastDataTime: new Date().toISOString() },
      { id: 'TN-AVS-003', waterLevel: 2.80, risk: 'High', soilMoisture: 80, lastDataTime: new Date().toISOString() },
      { id: 'TN-AVS-006', waterLevel: 2.15, risk: 'Moderate', soilMoisture: 74, lastDataTime: new Date().toISOString() },
      { id: 'TN-CBE-002', waterLevel: 2.65, risk: 'High', soilMoisture: 66, lastDataTime: new Date().toISOString() }
    ];

    const aiUpdate = {
      hazard: 'Flood & Inundation',
      riskScore: 86,
      riskLevel: 'Critical',
      trend: '↗ SURGING (+0.42m/hr)',
      predictionText: 'Severe monsoon runoff in Coimbatore foothills accelerating towards Avinashi Noyyal weir. Crest projected in 35 mins.',
      factors: [
        { name: 'Noyyal Gorge Gauge (TN-AVS-001)', weight: 38, value: '2.45m / Warn 2.0m', impact: 'critical' },
        { name: 'Coimbatore Upstream Rainfall', weight: 30, value: '58 mm/hr (Cloudburst)', impact: 'critical' },
        { name: 'Canal Gate Inflow (TN-AVS-003)', weight: 18, value: '240 m³/s', impact: 'high' },
        { name: 'Downstream Basin Saturation', weight: 14, value: '80%', impact: 'high' }
      ]
    };

    store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

    store.addAlert({
      id: 'ALT-TN-DEMO-' + Date.now().toString().slice(-4),
      stateId: 'TN',
      hazard: 'Flood',
      severity: 'Critical',
      title: '🚨 CRITICAL FLASH INUNDATION: Coimbatore → Avinashi Runoff Surge',
      location: 'Avinashi (Tiruppur District)',
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aiConfidence: 94,
      description: 'Noyyal River runoff crested upstream. Sarkarsamakulam weir and low-lying canals at critical risk.',
      coordinates: [11.1920, 77.2050],
      sensorId: 'TN-AVS-001'
    });

    showToast('🌊 DEMO INJECTOR: Coimbatore → Avinashi Flood Scenario Activated!', 'crit');
  }

  triggerFlashFloodScenario() {
    const state = store.getState();
    state.activeScenario = 'flood';

    const targetSensor = state.sensors.find(s => s.type === 'water') || state.sensors[0];
    if (targetSensor) {
      const sensorUpdates = [
        { id: targetSensor.id, waterLevel: 4.15, risk: 'Critical', soilMoisture: 96, temp: 22.5 }
      ];

      const aiUpdate = {
        hazard: 'Flash Flood',
        riskScore: 95,
        riskLevel: 'Critical',
        trend: '↗ SURGING (+0.85m/hr)',
        predictionText: 'URGENT: Peak hydro-surge cresting within 30 minutes. River catchment capacity exceeded.',
        factors: [
          { name: `Hydro Sensor (${targetSensor.id})`, weight: 44, value: '4.15m / Danger 3.2m', impact: 'critical' },
          { name: 'Catchment Rainfall Intensity', weight: 32, value: '92 mm/hr (Extreme)', impact: 'critical' },
          { name: 'Runoff Acceleration Rate', weight: 14, value: '+0.85 m/hr', impact: 'critical' },
          { name: 'Catchment Soil Saturation', weight: 10, value: '96% (Saturated)', impact: 'high' }
        ]
      };

      store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

      store.addAlert({
        id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
        stateId: state.loggedInStateId,
        hazard: 'Flash Flood',
        severity: 'Critical',
        title: `🚨 CRITICAL HYDRO-SURGE BREACH — ${targetSensor.location}`,
        location: `${targetSensor.location}`,
        timeAgo: 'Just now',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        aiConfidence: 96,
        description: `Extreme water level elevation recorded at sensor ${targetSensor.id}. Rapid evacuation protocols active.`,
        coordinates: [targetSensor.lat, targetSensor.lng],
        sensorId: targetSensor.id
      });

      showToast(`🚨 DEMO INJECTOR: Critical Flash Flood Triggered at ${targetSensor.name}!`, 'crit');
    }
  }

  triggerWildfireScenario() {
    const state = store.getState();
    state.activeScenario = 'fire';

    const targetSensor = state.sensors.find(s => s.type === 'heat' || s.type === 'air') || state.sensors[0];
    if (targetSensor) {
      const sensorUpdates = [
        { id: targetSensor.id, temp: 47.8, hum: 15, pm25: 310, risk: 'Critical' }
      ];

      const aiUpdate = {
        hazard: 'Forest Fire',
        riskScore: 92,
        riskLevel: 'Critical',
        trend: '↗ EXPANDING (Wind 32 km/h)',
        predictionText: `High thermal radiance and particulate spike at ${targetSensor.location}. Rapid flame propagation modeled.`,
        factors: [
          { name: `Surface Thermal Node (${targetSensor.id})`, weight: 42, value: '47.8°C (Extreme)', impact: 'critical' },
          { name: 'Relative Humidity Deficit', weight: 28, value: '15% (Severe Drought)', impact: 'critical' },
          { name: 'Wind Velocity Gusts', weight: 18, value: '32 km/h NE', impact: 'high' },
          { name: 'Particulate Inversion PM2.5', weight: 12, value: '310 µg/m³', impact: 'high' }
        ]
      };

      store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

      store.addAlert({
        id: 'ALT-' + Math.floor(1000 + Math.random() * 9000),
        stateId: state.loggedInStateId,
        hazard: 'Forest Fire',
        severity: 'Critical',
        title: `🔥 RAPID WILDFIRE SPREAD — ${targetSensor.location}`,
        location: `${targetSensor.location}`,
        timeAgo: 'Just now',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        aiConfidence: 94,
        description: `Extreme thermal anomaly (+47.8°C). Drone reconnaissance and firebreak squads alerted.`,
        coordinates: [targetSensor.lat, targetSensor.lng],
        sensorId: targetSensor.id
      });

      showToast(`🔥 DEMO INJECTOR: Thermal Anomaly & Fire Spread Triggered at ${targetSensor.name}!`, 'crit');
    }
  }

  resetBaselineScenario() {
    const state = store.getState();
    state.activeScenario = 'baseline';
    this.avitick = 0;

    // Reset sensor state to baseline nominal
    state.sensors.forEach(s => {
      s.risk = 'Low';
      s.status = 'Online';
      if (s.waterLevel) s.waterLevel = 1.8;
      if (s.temp) s.temp = 27.0;
      if (s.pm25) s.pm25 = 40;
    });

    const aiUpdate = {
      hazard: 'Multi-Hazard Baseline',
      riskScore: 52,
      riskLevel: 'Low',
      trend: '→ Stabilized',
      predictionText: 'Environmental metrics operating within safe seasonal tolerance bands across all monitored districts.',
      factors: [
        { name: 'Hydro Inflow Telemetry', weight: 35, value: 'Nominal Basin Discharge', impact: 'low' },
        { name: 'Catchment Rainfall Rate', weight: 25, value: 'Light / Moderate', impact: 'low' },
        { name: 'Thermal Anomaly Model', weight: 20, value: 'Within Standard Deviation', impact: 'low' },
        { name: 'Atmospheric Dispersion', weight: 20, value: 'Good Air Quality', impact: 'low' }
      ]
    };

    store.updateSimulation(state.sensors, { criticalIncidents: 1 }, aiUpdate);
    showToast('✅ SIMULATION: Environmental telemetry restored to nominal baseline.', 'info');
  }
}

export const simulationEngine = new SimulationEngine();
