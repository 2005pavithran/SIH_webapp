// Comprehensive GIS & Environmental Intelligence Mock Data

export const REGIONS = [
  { id: 'avinashi', name: 'Avinashi • Noyyal River Basin', center: [11.1881, 77.2235], zoom: 12 },
  { id: 'coimbatore', name: 'Coimbatore City • Urban Corridor', center: [11.0168, 76.9558], zoom: 11 },
  { id: 'district-x', name: 'District X • Catchment Basin (Vythiri)', center: [11.6854, 76.1320], zoom: 12 },
  { id: 'zone-y', name: 'Zone Y • Forest Foothills (Bandipur)', center: [11.7500, 76.2200], zoom: 12 },
  { id: 'western-ghats', name: 'Western Ghats • High-Risk Corridor', center: [11.6050, 76.0820], zoom: 11 },
  { id: 'chamoli-valley', name: 'Chamoli Catchment • Glacial Basin', center: [30.4000, 79.3300], zoom: 11 },
  { id: 'brahmaputra-delta', name: 'Brahmaputra Flood Plain', center: [26.1800, 91.7500], zoom: 11 }
];

export const PUBLIC_LOCATIONS = [
  {
    id: 'avinashi',
    name: 'Avinashi',
    district: 'Tiruppur District',
    state: 'Tamil Nadu',
    population: '168,720',
    center: [11.1881, 77.2235],
    zoom: 12,
    riskLevel: 'High',
    activeWarning: '🌊 Flood Watch & Inundation Warning — Noyyal River Basin',
    disasterType: 'Flash Flood',
    affectedAreas: 'Noyyal Gorge, Town Weir, Sarkarsamakulam, Lower Canal Basin, Vijayamangalam Rd',
    shortExplanation: 'Heavy upstream cloudburst runoff in Coimbatore is funneling down Noyyal River. Water level at upstream gorge (AVS-001) has risen to 2.4m, approaching danger mark.',
    safetyAction: 'Evacuate low-lying riverbank zones immediately. Move family, livestock, and dry rations to relief shelters or elevated concrete buildings.',
    dos: [
      'Pack emergency kit: clean water, medicines, battery torch, and identity cards',
      'Follow instructions broadcast by Police, Fire Services, and SDMA 1077',
      'Check in on elderly neighbors and assist persons with mobility needs'
    ],
    donts: [
      'DO NOT walk, swim, or drive through flowing floodwaters (even 15cm can knock you down)',
      'DO NOT touch submerged electrical wires, damaged transformers, or metal poles',
      'DO NOT cross town weir bridges or approach the riverbank during surge flow'
    ],
    emergencyHelplines: [
      { name: 'National Emergency', number: '112' },
      { name: 'District Disaster Control Room', number: '1077' },
      { name: 'Ambulance & Medical Emergency', number: '108' },
      { name: 'State EOC Helpline', number: '1070' }
    ],
    nearestShelter: {
      name: 'Government Higher Secondary School Relief Camp (SH-01)',
      distance: '1.4 km from Town Centre',
      capacity: '450 residents (330 beds currently available)',
      contact: 'Camp Officer: +91-94421-50891'
    },
    environmental: {
      waterLevel: '2.40 m',
      waterThreshold: 'Warning 2.0m • Danger 3.2m',
      rainfall: '42.0 mm/hr (Heavy Rain)',
      temp: '26.8°C',
      airQuality: 'Good (AQI 35)'
    }
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    district: 'Coimbatore District',
    state: 'Tamil Nadu',
    population: '1,980,000',
    center: [11.0168, 76.9558],
    zoom: 12,
    riskLevel: 'Moderate',
    activeWarning: '🌧️ Heavy Catchment Rainfall Advisory — Noyyal Headwaters',
    disasterType: 'Heavy Rainfall / Runoff Surge',
    affectedAreas: 'Singanallur, Ukkadam Lake Basin, Gandhipuram, Noyyal Bridge',
    shortExplanation: 'Monsoon cloudburst over western foothills has delivered 58 mm/hr rainfall. Urban storm drains discharging into Noyyal River downstream towards Avinashi.',
    safetyAction: 'Avoid waterlogged road underpasses and lake perimeters. Expect traffic delays on NH-544.',
    dos: [
      'Keep mobile phones fully charged and maintain emergency battery banks',
      'Stay updated on local bus diversions and transit advisories'
    ],
    donts: [
      'DO NOT park vehicles near steep storm channels or unstable retaining walls',
      'DO NOT discard waste into municipal storm drains'
    ],
    emergencyHelplines: [
      { name: 'National Emergency', number: '112' },
      { name: 'Coimbatore District Control', number: '1077' },
      { name: 'Ambulance', number: '108' }
    ],
    nearestShelter: {
      name: 'Corporation Community Center (Gandhipuram)',
      distance: '2.1 km away',
      capacity: '600 residents (Available)',
      contact: 'Tahsildar EOC: +91-94420-11202'
    },
    environmental: {
      waterLevel: '2.10 m',
      waterThreshold: 'Warning 2.5m • Danger 3.5m',
      rainfall: '58.4 mm/hr (Cloudburst)',
      temp: '27.5°C',
      airQuality: 'Moderate (AQI 55)'
    }
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    district: 'Tiruppur District',
    state: 'Tamil Nadu',
    population: '962,000',
    center: [11.1085, 77.3411],
    zoom: 12,
    riskLevel: 'Moderate',
    activeWarning: '⚠️ Downstream Noyyal Discharge Watch',
    disasterType: 'Riverine Discharge Watch',
    affectedAreas: 'Rayapuram, Noyyal River Causeway, New Bus Stand Basin',
    shortExplanation: 'Upstream inflows from Coimbatore and Avinashi expected to reach Tiruppur urban causeways within 2-3 hours. Municipal engineers monitoring river sluice gates.',
    safetyAction: 'Dyeing industrial units advised to suspend effluent intake. Low-ground markets should secure inventory.',
    dos: [
      'Inspect shop basements along river corridor for early seepage',
      'Cooperate with revenue department field survey squads'
    ],
    donts: [
      'DO NOT allow children near riverbank parks or railway culverts',
      'DO NOT dump materials along canal embankments'
    ],
    emergencyHelplines: [
      { name: 'National Emergency', number: '112' },
      { name: 'Tiruppur EOC', number: '1077' }
    ],
    nearestShelter: {
      name: 'Municipal Kalyan Mandapam Shelter Camp',
      distance: '1.9 km away',
      capacity: '500 residents (Ready)',
      contact: 'Revenue Inspector: +91-94422-33410'
    },
    environmental: {
      waterLevel: '1.75 m',
      waterThreshold: 'Warning 2.2m • Danger 3.0m',
      rainfall: '22.0 mm/hr (Moderate Rain)',
      temp: '28.1°C',
      airQuality: 'Moderate (AQI 62)'
    }
  },
  {
    id: 'district-x',
    name: 'Vythiri Catchment (District X)',
    district: 'Wayanad / District X',
    state: 'Kerala / Western Corridor',
    population: '78,400',
    center: [11.662, 76.115],
    zoom: 12,
    riskLevel: 'Critical',
    activeWarning: '🚨 Red Alert: Inundation & Gorge Flash Surge',
    disasterType: 'Flash Flood & Debris Flow',
    affectedAreas: 'Vythiri Gorge Pass, Area C, Kabini River Midstream, Meppadi Slope',
    shortExplanation: 'Hydro-Gauge N-003 at 3.8m exceeding danger threshold (3.2m). Chembra catchment cloudburst creating high-velocity debris runoff down gorge.',
    safetyAction: 'IMMEDIATE EVACUATION required for Zone C-1 and C-2 residents to Community Stadium Camp (SH-02).',
    dos: [
      'Follow NDRF Unit 09 evacuation sirens immediately',
      'Move uphill along designated primary evacuation trails',
      'Keep whistle and reflective clothing accessible'
    ],
    donts: [
      'DO NOT remain in riverbed mud-plaster structures',
      'DO NOT use Thamarassery Ghat road — landslides reported'
    ],
    emergencyHelplines: [
      { name: 'National Emergency', number: '112' },
      { name: 'District Disaster EOC', number: '1077' },
      { name: 'NDRF Control Room', number: '011-24363260' }
    ],
    nearestShelter: {
      name: 'Community Stadium Evacuation Center (SH-02)',
      distance: '3.2 km away',
      capacity: '800 residents (Ready)',
      contact: 'Camp Officer: +91-94431-88902'
    },
    environmental: {
      waterLevel: '3.84 m',
      waterThreshold: 'Danger 3.2m (EXCEEDED)',
      rainfall: '84.0 mm/hr (Extreme Cloudburst)',
      temp: '24.2°C',
      airQuality: 'Good (AQI 32)'
    }
  }
];

const now = new Date();
const minutesAgo = (m) => { const d = new Date(now); d.setMinutes(d.getMinutes() - m); return d.toISOString(); };
const healthStatus = (s, battery, signal) => {
  if (s === 'Offline' || s === 'Inactive') return 'Inactive';
  if (battery < 15 || signal < -95) return 'Damaged';
  if (s === 'Degraded' || battery < 40 || signal < -88) return 'Maintenance Required';
  return 'Active';
};
export const INITIAL_SENSORS = [
  { id: 'CBE-001', name: 'Coimbatore Central AQI Tower', location: 'Coimbatore City (Gandhipuram)', lat: 11.0052, lng: 76.9570, status: 'Online', risk: 'Low', battery: 89, signal: -58, temp: 28.8, hum: 72, pm25: 48, waterLevel: 1.2, soilMoisture: 45, type: 'air', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'CBE-002', name: 'Noyyal River Bridge Sensor', location: 'Coimbatore (Singanallur)', lat: 11.0154, lng: 76.9980, status: 'Online', risk: 'Moderate', battery: 76, signal: -65, temp: 27.5, hum: 78, pm25: 55, waterLevel: 2.1, soilMoisture: 58, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'AVS-001', name: 'Avinashi Upstream Level', location: 'Avinashi (Noyyal Gorge)', lat: 11.1920, lng: 77.2050, status: 'Online', risk: 'Low', battery: 82, signal: -68, temp: 26.8, hum: 75, pm25: 35, waterLevel: 1.8, soilMoisture: 55, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'AVS-002', name: 'Avinashi Town Weir', location: 'Avinashi (Town Centre)', lat: 11.1881, lng: 77.2235, status: 'Online', risk: 'Low', battery: 94, signal: -55, temp: 27.2, hum: 74, pm25: 38, waterLevel: 1.5, soilMoisture: 50, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'AVS-003', name: 'Avinashi Downstream Farm', location: 'Avinashi (Sarkarsamakulam)', lat: 11.1750, lng: 77.2510, status: 'Online', risk: 'Low', battery: 71, signal: -72, temp: 26.4, hum: 80, pm25: 40, waterLevel: 2.0, soilMoisture: 62, type: 'water', health: 'Maintenance Required', lastDataTime: minutesAgo(4) },
  { id: 'AVS-004', name: 'Avinashi Weather Pod', location: 'Avinashi (SITRA Industrial Zone)', lat: 11.2010, lng: 77.2150, status: 'Degraded', risk: 'Moderate', battery: 38, signal: -90, temp: 28.0, hum: 70, pm25: 62, waterLevel: 1.6, soilMoisture: 48, type: 'heat', health: 'Maintenance Required', lastDataTime: minutesAgo(7) },
  { id: 'AVS-005', name: 'Avinashi Canal Gate Node', location: 'Avinashi (Lower Canal)', lat: 11.1680, lng: 77.2700, status: 'Offline', risk: 'Low', battery: 6, signal: -98, temp: 0, hum: 0, pm25: 0, waterLevel: 0, soilMoisture: 0, type: 'water', health: 'Damaged', lastDataTime: minutesAgo(58) },
  { id: 'AVS-006', name: 'Avinashi Satellite Backup', location: 'Avinashi (Vijayamangalam Rd)', lat: 11.1960, lng: 77.2380, status: 'Online', risk: 'Low', battery: 87, signal: -61, temp: 27.0, hum: 76, pm25: 36, waterLevel: 1.7, soilMoisture: 53, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'N-001', name: 'Periyar Hydro-Gauge 01', location: 'Area A (Upstream)', lat: 11.692, lng: 76.128, status: 'Online', risk: 'Low', battery: 92, signal: -64, temp: 24.2, hum: 78, pm25: 32, waterLevel: 1.4, soilMoisture: 42, type: 'water', health: healthStatus('Online',92,-64), lastDataTime: minutesAgo(1) },
  { id: 'N-002', name: 'Kabini River Weir Level', location: 'Area B (Midstream)', lat: 11.678, lng: 76.145, status: 'Online', risk: 'Moderate', battery: 78, signal: -71, temp: 26.5, hum: 82, pm25: 45, waterLevel: 2.3, soilMoisture: 58, type: 'water', health: healthStatus('Online',78,-71), lastDataTime: minutesAgo(2) },
  { id: 'N-003', name: 'Vythiri Flash Gauge Node', location: 'Area C (Gorge Pass)', lat: 11.662, lng: 76.115, status: 'Online', risk: 'Critical', battery: 64, signal: -82, temp: 42.8, hum: 28, pm25: 156, waterLevel: 3.8, soilMoisture: 89, type: 'water', health: healthStatus('Online',64,-82), lastDataTime: minutesAgo(1) },
  { id: 'N-004', name: 'Banasura Ridge Thermal Node', location: 'Area D (Forest Zone)', lat: 11.710, lng: 76.160, status: 'Online', risk: 'High', battery: 81, signal: -68, temp: 39.4, hum: 32, pm25: 142, waterLevel: 0.8, soilMoisture: 22, type: 'fire', health: healthStatus('Online',81,-68), lastDataTime: minutesAgo(2) },
  { id: 'N-005', name: 'Mananthavady AQI Station', location: 'District Center Z', lat: 11.701, lng: 76.102, status: 'Online', risk: 'High', battery: 88, signal: -59, temp: 31.2, hum: 65, pm25: 184, waterLevel: 1.1, soilMoisture: 45, type: 'air', health: healthStatus('Online',88,-59), lastDataTime: minutesAgo(1) },
  { id: 'N-006', name: 'Meppadi Slope Inclinometer', location: 'Hill Sector 4', lat: 11.645, lng: 76.155, status: 'Online', risk: 'Critical', battery: 73, signal: -74, temp: 23.8, hum: 91, pm25: 28, waterLevel: 3.4, soilMoisture: 94, type: 'landslide', health: healthStatus('Online',73,-74), lastDataTime: minutesAgo(2) },
  { id: 'N-007', name: 'Sultan Bathery Weather Pod', location: 'East Corridor', lat: 11.665, lng: 76.255, status: 'Online', risk: 'Moderate', battery: 95, signal: -62, temp: 36.8, hum: 41, pm25: 68, waterLevel: 1.5, soilMoisture: 38, type: 'heat', health: healthStatus('Online',95,-62), lastDataTime: minutesAgo(1) },
  { id: 'N-008', name: 'Kalpetta Urban Thermal Sensor', location: 'Civic Center', lat: 11.608, lng: 76.082, status: 'Online', risk: 'Low', battery: 91, signal: -55, temp: 29.1, hum: 60, pm25: 54, waterLevel: 1.2, soilMoisture: 35, type: 'heat', health: healthStatus('Online',91,-55), lastDataTime: minutesAgo(1) },
  { id: 'N-009', name: 'Chembra Peak Rainfall Array', location: 'High Elevation Zone', lat: 11.552, lng: 76.091, status: 'Online', risk: 'Moderate', battery: 54, signal: -86, temp: 19.5, hum: 96, pm25: 18, waterLevel: 2.1, soilMoisture: 84, type: 'water', health: healthStatus('Online',54,-86), lastDataTime: minutesAgo(3) },
  { id: 'N-010', name: 'Thamarassery Ghat Inundation Sensor', location: 'Pass Checkpoint', lat: 11.515, lng: 75.985, status: 'Degraded', risk: 'High', battery: 41, signal: -91, temp: 27.3, hum: 85, pm25: 72, waterLevel: 3.1, soilMoisture: 88, type: 'water', health: 'Maintenance Required', lastDataTime: minutesAgo(8) },
  { id: 'N-011', name: 'Bandipur Border Flame Sentinel', location: 'Zone Y North', lat: 11.765, lng: 76.245, status: 'Online', risk: 'Critical', battery: 83, signal: -66, temp: 44.5, hum: 19, pm25: 210, waterLevel: 0.4, soilMoisture: 14, type: 'fire', health: healthStatus('Online',83,-66), lastDataTime: minutesAgo(1) },
  { id: 'N-012', name: 'Kuruva Island Level Beacon', location: 'River Island Sanctuary', lat: 11.782, lng: 76.115, status: 'Online', risk: 'Low', battery: 96, signal: -58, temp: 25.8, hum: 76, pm25: 25, waterLevel: 1.8, soilMoisture: 52, type: 'water', health: healthStatus('Online',96,-58), lastDataTime: minutesAgo(1) }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1092',
    hazard: 'Flood',
    severity: 'Critical',
    title: 'Flash flood surge detected in Gorge Pass',
    location: 'District X • Area C (Vythiri Basin)',
    timeAgo: '2 min ago',
    timestamp: '19:28',
    aiConfidence: 94,
    description: 'Rapid water level rise of +0.45m/hr at Gauge N-003. Inundation threshold (3.2m) exceeded.',
    coordinates: [11.662, 76.115],
    sensorId: 'N-003'
  },
  {
    id: 'ALT-1091',
    hazard: 'Forest Fire',
    severity: 'Critical',
    title: 'Rapid thermal propagation detected in timber belt',
    location: 'Zone Y • Bandipur Buffer Sector',
    timeAgo: '7 min ago',
    timestamp: '19:23',
    aiConfidence: 91,
    description: 'Surface temp spiked to 44.5°C with humidity dropping below 20%. Wind spread 28 km/h NE.',
    coordinates: [11.765, 76.245],
    sensorId: 'N-011'
  },
  {
    id: 'ALT-1090',
    hazard: 'Air Pollution',
    severity: 'Warning',
    title: 'PM2.5 concentration severe spike',
    location: 'District Z • Industrial Ring Road',
    timeAgo: '12 min ago',
    timestamp: '19:18',
    aiConfidence: 87,
    description: 'PM2.5 reached 184 µg/m³ with thermal inversion trapping particulate matter in valley trough.',
    coordinates: [11.701, 76.102],
    sensorId: 'N-005'
  },
  {
    id: 'ALT-1089',
    hazard: 'Heat Wave',
    severity: 'Watch',
    title: 'Surface temperature anomaly (+4.8°C above seasonal mean)',
    location: 'East Corridor • Sultan Bathery',
    timeAgo: '24 min ago',
    timestamp: '19:06',
    aiConfidence: 82,
    description: 'Continuous thermal stress threshold surpassed for vulnerable elderly populations.',
    coordinates: [11.665, 76.255],
    sensorId: 'N-007'
  },
  {
    id: 'ALT-1088',
    hazard: 'Landslide',
    severity: 'Warning',
    title: 'High soil pore-water pressure & slope creep',
    location: 'Hill Sector 4 • Meppadi',
    timeAgo: '41 min ago',
    timestamp: '18:49',
    aiConfidence: 89,
    description: 'Soil saturation at 94% with micro-vibrations detected along shear plane.',
    coordinates: [11.645, 76.155],
    sensorId: 'N-006'
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: 'FLD-042',
    hazard: 'Flood',
    severity: 'Critical',
    title: 'Flash Inundation Surge — District X',
    location: 'District X (River Vythiri Gorge)',
    affectedArea: '4.2 km²',
    detectedTime: '18:42',
    status: 'ACTIVE',
    aiRisk: 91,
    assignedTeam: 'NDRF Unit 09 (Team Bravo)',
    coordinates: [11.662, 76.115],
    sop: [
      { id: 'sop-1', label: 'Hazard detected by Hydro-Sensors', done: true, time: '18:42' },
      { id: 'sop-2', label: 'District Authority notified via CAP-India', done: true, time: '18:45' },
      { id: 'sop-3', label: 'Incident room created & SOP escalated', done: true, time: '18:48' },
      { id: 'sop-4', label: 'Response team assigned & en-route', done: true, time: '19:05' },
      { id: 'sop-5', label: 'Evacuation initiated for Zone C-1 & C-2', done: false, time: 'Pending' },
      { id: 'sop-6', label: 'Inundation receding & Incident resolved', done: false, time: 'Pending' }
    ]
  },
  {
    id: 'FIR-019',
    hazard: 'Forest Fire',
    severity: 'Critical',
    title: 'Timber Line Fire Ignition — Zone Y',
    location: 'Zone Y Forest Perimeter',
    affectedArea: '2.8 km²',
    detectedTime: '19:15',
    status: 'ACTIVE',
    aiRisk: 88,
    assignedTeam: 'Forestry Fire Corps & Drone 02',
    coordinates: [11.765, 76.245],
    sop: [
      { id: 'sop-1', label: 'Hazard detected by Sentinel N-011', done: true, time: '19:15' },
      { id: 'sop-2', label: 'Forest Department & State EOC notified', done: true, time: '19:18' },
      { id: 'sop-3', label: 'Fire perimeter mapped by drone feed', done: true, time: '19:22' },
      { id: 'sop-4', label: 'Fire break creation teams deployed', done: false, time: 'Pending' },
      { id: 'sop-5', label: 'Containment perimeter established', done: false, time: 'Pending' },
      { id: 'sop-6', label: 'Mopping up & Incident closed', done: false, time: 'Pending' }
    ]
  },
  {
    id: 'AQI-105',
    hazard: 'Air Pollution',
    severity: 'Warning',
    title: 'Valley Thermal Smog Inversion',
    location: 'District Center Z',
    affectedArea: '8.5 km²',
    detectedTime: '17:30',
    status: 'CONTAINED',
    aiRisk: 72,
    assignedTeam: 'Pollution Control Mobile Unit',
    coordinates: [11.701, 76.102],
    sop: [
      { id: 'sop-1', label: 'AQI threshold breach (>180)', done: true, time: '17:30' },
      { id: 'sop-2', label: 'Advisory dispatched to schools & hospitals', done: true, time: '17:45' },
      { id: 'sop-3', label: 'Heavy vehicle diversion activated', done: true, time: '18:10' },
      { id: 'sop-4', label: 'Anti-smog misting cannon deployed', done: true, time: '18:40' },
      { id: 'sop-5', label: 'AQI stabilizing below 120 µg/m³', done: true, time: '19:10' },
      { id: 'sop-6', label: 'Incident closed', done: true, time: '19:25' }
    ]
  }
];

export const RESPONSE_TEAMS = [
  { id: 'TM-01', name: 'NDRF Battalion 04 • Unit 09', type: 'Rescue & Inundation', location: 'Sector 3 Base', lat: 11.670, lng: 76.120, status: 'Deployed', personnel: 24, eta: '8 mins' },
  { id: 'TM-02', name: 'SDRF Quick Response Alpha', type: 'Evacuation & Medical', location: 'District HQ', lat: 11.615, lng: 76.095, status: 'Available', personnel: 18, eta: 'Standby' },
  { id: 'TM-03', name: 'Forestry Wildfire Tactical Corps', type: 'Fire Suppression', location: 'Zone Y Station', lat: 11.750, lng: 76.210, status: 'Deployed', personnel: 16, eta: '12 mins' },
  { id: 'TM-04', name: 'Aerial LiDAR & Drone Survey 02', type: 'Reconnaissance', location: 'Helipad 01', lat: 11.685, lng: 76.140, status: 'Active Mission', personnel: 4, eta: 'On Station' },
  { id: 'TM-05', name: 'Emergency Mobile Medical Unit 3', type: 'Trauma & Triage', location: 'Civil Hospital', lat: 11.602, lng: 76.088, status: 'Available', personnel: 8, eta: 'Standby' }
];

export const RELIEF_SHELTERS = [
  { id: 'SH-01', name: 'Government Higher Secondary Relief Camp', lat: 11.650, lng: 76.130, capacity: 450, occupied: 120, status: 'Active' },
  { id: 'SH-02', name: 'Community Stadium Evacuation Center', lat: 11.612, lng: 76.075, capacity: 800, occupied: 0, status: 'Ready' },
  { id: 'SH-03', name: 'Forest Sanctuary Safe Haven Point', lat: 11.740, lng: 76.180, capacity: 200, occupied: 45, status: 'Active' }
];

export const AI_PREDICTION_FACTORS = [
  { name: 'Upstream Hydro Level (Sensor N-003)', weight: 38, value: '3.8m / Thr 3.2m', impact: 'critical' },
  { name: 'Catchment Rainfall Intensity', weight: 26, value: '84 mm/hr', impact: 'critical' },
  { name: 'Rate of Water Rise Acceleration', weight: 21, value: '+0.45 m/hr', impact: 'high' },
  { name: 'Historical Monsoon Inundation Model', weight: 15, value: '98.2% Correlation', impact: 'moderate' }
];

export const HAZARD_ZONES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Vythiri High Inundation Zone', hazard: 'Flood', risk: 'Critical', area: '4.2 km²' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.105, 11.655],
          [76.128, 11.670],
          [76.135, 11.662],
          [76.120, 11.648],
          [76.105, 11.655]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Avinashi Noyyal Flood Basin', hazard: 'Flood', risk: 'Warning', area: '5.8 km²' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.195, 11.212],
          [77.218, 11.225],
          [77.240, 11.210],
          [77.260, 11.188],
          [77.248, 11.162],
          [77.215, 11.155],
          [77.195, 11.212]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Bandipur Dry Timber Fire Hazard Sector', hazard: 'Forest Fire', risk: 'Critical', area: '2.8 km²' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.230, 11.755],
          [76.260, 11.775],
          [76.270, 11.758],
          [76.242, 11.745],
          [76.230, 11.755]
        ]]
      }
    }
  ]
};
