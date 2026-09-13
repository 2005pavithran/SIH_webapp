// Live Telemetry Simulation Engine & Scenario Injector for Demonstrations

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
    this.interval = setInterval(() => this.tick(), 4000);
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

    // 1. Apply micro-fluctuations to Active sensors only
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

    // 2. Every 6th tick, flip a Maintenance sensor to Active occasionally
    if (this.tickCount % 6 === 0) {
      const maintenanceSensor = state.sensors.find(s => s.health === 'Maintenance Required' && Math.random() > 0.6);
      if (maintenanceSensor) {
        sensorUpdates.push({
          id: maintenanceSensor.id,
          status: 'Online',
          health: 'Active',
          battery: Math.min(100, maintenanceSensor.battery + 30),
          signal: Math.max(-72, maintenanceSensor.signal + 22),
          lastDataTime: nowIso
        });
      }
      // Occasionally flip active to degraded (not every tick)
      const actives = state.sensors.filter(s => s.health === 'Active' && s.battery < 55);
      if (actives.length && Math.random() > 0.7) {
        const picked = actives[Math.floor(Math.random() * actives.length)];
        sensorUpdates.push({
          id: picked.id,
          status: 'Degraded',
          health: 'Maintenance Required',
          lastDataTime: nowIso
        });
      }
    }

    // 3. Micro-jitter latency and uptime (small variations, not jumpy)
    const latencyMs = Math.floor(135 + Math.sin(this.tickCount / 7) * 12 + Math.random() * 6);

    // 4. If Avinashi scenario is active, progressively escalate AVS sensors
    const st = state;
    if (st.activeScenario === 'avinashi_flood') {
      this.avitick++;
      const stage = Math.min(5, this.avitick);
      const avinashiUpdates = [
        { id: 'AVS-001', waterLevel: Number((1.9 + stage * 0.45).toFixed(2)), soilMoisture: 70 + stage * 5, risk: ['Low','Moderate','High','Critical','Critical','Critical'][stage] },
        { id: 'AVS-002', waterLevel: Number((1.7 + stage * 0.38).toFixed(2)), soilMoisture: 66 + stage * 5, risk: ['Low','Low','Moderate','High','High','Critical'][stage] },
        { id: 'AVS-003', waterLevel: Number((2.2 + stage * 0.42).toFixed(2)), soilMoisture: 72 + stage * 5, risk: ['Low','Moderate','High','High','Critical','Critical'][stage] },
        { id: 'AVS-006', waterLevel: Number((1.8 + stage * 0.35).toFixed(2)), soilMoisture: 68 + stage * 4, risk: ['Low','Low','Moderate','High','High','High'][stage] },
        { id: 'CBE-002', waterLevel: Number((2.3 + stage * 0.18).toFixed(2)), soilMoisture: 60 + stage * 3, risk: ['Moderate','Moderate','High','High','High','High'][stage] }
      ];
      // Merge into sensorUpdates
      avinashiUpdates.forEach(au => {
        const existing = sensorUpdates.find(u => u.id === au.id);
        if (existing) Object.assign(existing, au);
        else sensorUpdates.push(au);
      });
      // Fire one new progression alert at stage 2+
      if (this.avitick === 2 || this.avitick === 4) {
        const sev = this.avitick === 2 ? 'Warning' : 'Critical';
        store.addAlert({
          id: 'ALT-AVS-' + this.tickCount,
          hazard: 'Flood',
          severity: sev,
          title: this.avitick === 2 ? 'Avinashi Flood Watch — Water Level Rising' : '🚨 AVS FLOOD EMERGENCY: Evacuate Low-Lying Zones',
          location: 'Avinashi • Noyyal River Basin',
          timeAgo: 'Just now',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          aiConfidence: 91,
          description: this.avitick === 2
            ? 'Noyyal River water level rising 0.15 m/hr above flood watch threshold at 3.4 m.'
            : 'Danger level (4.0 m) breached at AVS-001 Upstream. Sarkarsamakulam downstream inundation imminent.',
          coordinates: [11.1920, 77.2050],
          sensorId: 'AVS-001'
        });
        const aiUpdate = {
          hazard: 'Flood',
          riskScore: Math.min(99, 72 + stage * 6),
          riskLevel: stage < 3 ? 'High' : 'Critical',
          trend: '↗ Increasing (' + (stage * 0.25).toFixed(2) + 'm/hr)',
          predictionText: `Avinashi Noyyal River basin flood progression stage ${stage}. Forecast crest in 45-60 mins at AVS-003.`,
          factors: [
            { name: 'Noyyal Gorge Gauge (AVS-001)', weight: 36, value: (1.9 + stage * 0.45).toFixed(2) + 'm', impact: stage < 3 ? 'high' : 'critical' },
            { name: 'Coimbatore Upstream Rainfall', weight: 28, value: (28 + stage * 12) + ' mm/hr', impact: stage < 3 ? 'high' : 'critical' },
            { name: 'Canal Gate Discharge', weight: 20, value: (180 + stage * 40) + ' m³/s', impact: 'high' },
            { name: 'Soil Saturation (AVS-003)', weight: 16, value: (72 + stage * 5) + '%', impact: stage < 3 ? 'moderate' : 'high' }
          ]
        };
        store.updateSimulation(null, null, aiUpdate);
      }
    }

    // 5. Recompute KPI (totals based on expanded 20 sensor set)
    const kpiUpdates = { latencyMs };

    store.updateSimulation(sensorUpdates, kpiUpdates, null);
  }

  triggerAvinashiFloodScenario() {
    const state = store.getState();
    state.activeScenario = 'avinashi_flood';
    this.avitick = 0;
    this.tickCount = 0;

    // Switch focus to Avinashi for both modes and populate full situation data
    store.setPublicLocation('avinashi');
    if (state.selectedPublicLocation) {
      state.selectedPublicLocation.riskLevel = 'High';
      state.selectedPublicLocation.activeWarning = '🌊 Flood Warning — Coimbatore Upstream Surge Inflowing to Avinashi';
      state.selectedPublicLocation.shortExplanation = 'Severe monsoon cloudburst over Coimbatore foothills has produced rapid runoff. Noyyal River water level at upstream gorge gauge AVS-001 has risen to 2.40m and is accelerating.';
      if (state.selectedPublicLocation.environmental) {
        state.selectedPublicLocation.environmental.waterLevel = '2.40 m';
        state.selectedPublicLocation.environmental.rainfall = '42 mm/hr (Heavy Rain)';
      }
    }

    // Baseline stage 1 updates
    const sensorUpdates = [
      { id: 'AVS-001', waterLevel: 2.4, risk: 'High', soilMoisture: 76, temp: 26.0, lastDataTime: new Date().toISOString() },
      { id: 'AVS-002', waterLevel: 2.2, risk: 'Moderate', soilMoisture: 72, lastDataTime: new Date().toISOString() },
      { id: 'AVS-003', waterLevel: 2.8, risk: 'High', soilMoisture: 80, lastDataTime: new Date().toISOString() },
      { id: 'AVS-006', waterLevel: 2.2, risk: 'Moderate', soilMoisture: 74, lastDataTime: new Date().toISOString() },
      { id: 'CBE-002', waterLevel: 2.6, risk: 'High', soilMoisture: 66, lastDataTime: new Date().toISOString() }
    ];

    const aiUpdate = {
      hazard: 'Flood',
      riskScore: 82,
      riskLevel: 'High',
      trend: '↗ Increasing',
      predictionText: 'Noyyal River levels rising after Coimbatore upstream cloudburst. Forecast crest 0.6m above danger level.',
      factors: [
        { name: 'Noyyal Gorge Gauge (AVS-001)', weight: 38, value: '2.4m / Warn 2.0m', impact: 'high' },
        { name: 'Coimbatore Upstream Rainfall', weight: 30, value: '42 mm/hr (Heavy)', impact: 'high' },
        { name: 'Dam Release Gates (CBE-002)', weight: 18, value: '220 m³/s', impact: 'moderate' },
        { name: 'Downstream Soil Saturation', weight: 14, value: '80%', impact: 'high' }
      ]
    };

    store.updateSimulation(sensorUpdates, { criticalIncidents: state.kpi.criticalIncidents + 1 }, aiUpdate);

    store.addAlert({
      id: 'ALT-AVS-KICKOFF',
      hazard: 'Flood',
      severity: 'Warning',
      title: 'Avinashi • Flood Initiated — Coimbatore Upstream Surge',
      location: 'Avinashi (Tiruppur District)',
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aiConfidence: 90,
      description: 'Upstream Noyyal River runoff has increased above watch levels. Sarkarsamakulam and lower canal at risk.',
      coordinates: [11.1881, 77.2235],
      sensorId: 'AVS-001'
    });

    showToast('🌊 SIMULATION: Coimbatore → Avinashi Flood Scenario Activated!', 'crit');
    store.notify('public_location_change', state.selectedPublicLocation);
    store.notify('ui_mode_change', state.uiMode);
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
    this.avitick = 0;

    const sensorUpdates = [
      { id: 'N-003', waterLevel: 2.8, risk: 'Moderate', soilMoisture: 72, temp: 28.5, lastDataTime: new Date().toISOString() },
      { id: 'N-011', temp: 34.2, hum: 42, pm25: 65, risk: 'Moderate', lastDataTime: new Date().toISOString() },
      { id: 'N-002', waterLevel: 2.1, risk: 'Low', soilMoisture: 55, lastDataTime: new Date().toISOString() },
      { id: 'AVS-001', waterLevel: 1.9, risk: 'Low', soilMoisture: 60, lastDataTime: new Date().toISOString() },
      { id: 'AVS-002', waterLevel: 1.6, risk: 'Low', soilMoisture: 58, lastDataTime: new Date().toISOString() },
      { id: 'AVS-003', waterLevel: 2.2, risk: 'Low', soilMoisture: 62, lastDataTime: new Date().toISOString() },
      { id: 'AVS-006', waterLevel: 1.8, risk: 'Low', soilMoisture: 56, lastDataTime: new Date().toISOString() },
      { id: 'CBE-002', waterLevel: 2.2, risk: 'Moderate', soilMoisture: 52, lastDataTime: new Date().toISOString() }
    ];

    const aiUpdate = {
      hazard: 'Flood',
      riskScore: 58,
      riskLevel: 'Low',
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
