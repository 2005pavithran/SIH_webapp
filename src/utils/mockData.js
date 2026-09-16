// Comprehensive Multi-State Environmental Intelligence & Disaster GIS Data

const now = new Date();
const minutesAgo = (m) => {
  const d = new Date(now);
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
};

const healthStatus = (s, battery, signal) => {
  if (s === 'Offline' || s === 'Inactive') return 'Inactive';
  if (battery < 15 || signal < -95) return 'Damaged';
  if (s === 'Degraded' || battery < 40 || signal < -88) return 'Maintenance Required';
  return 'Active';
};

// ==========================================================================
// MULTI-STATE DEFINITIONS & JURISDICTIONS
// ==========================================================================
export const STATES_CONFIG = [
  {
    id: 'TN',
    name: 'Tamil Nadu',
    code: 'TN-SDMA',
    emblemSubtitle: 'Tamil Nadu State Disaster Management Authority',
    center: [11.1271, 78.6569],
    zoom: 7.5,
    bounds: [[8.0, 76.0], [13.5, 80.5]],
    districts: [
      { id: 'coimbatore', name: 'Coimbatore District • Urban & Foothills', center: [11.0168, 76.9558], zoom: 11 },
      { id: 'avinashi', name: 'Avinashi • Noyyal River Basin', center: [11.1881, 77.2235], zoom: 12 },
      { id: 'tiruppur', name: 'Tiruppur • Industrial & River Corridor', center: [11.1085, 77.3411], zoom: 11.5 },
      { id: 'nilgiris', name: 'Nilgiris • Western Ghats Slope', center: [11.4102, 76.6950], zoom: 11 },
      { id: 'chennai', name: 'Chennai Coastal & Basin Corridor', center: [13.0827, 80.2707], zoom: 11 },
      { id: 'madurai', name: 'Madurai • Vaigai River Catchment', center: [9.9252, 78.1198], zoom: 11 }
    ],
    riskLevel: 'WATCH',
    activeHazardsCount: 3,
    activeSensorsCount: 428,
    primaryThreat: 'Flash Flood & Riverine Discharge (Noyyal Basin)'
  },
  {
    id: 'UT',
    name: 'Uttarakhand',
    code: 'UK-SDMA',
    emblemSubtitle: 'Uttarakhand State Disaster Management Authority',
    center: [30.0668, 79.0193],
    zoom: 7.8,
    bounds: [[28.7, 77.5], [31.5, 81.1]],
    districts: [
      { id: 'chamoli', name: 'Chamoli • Glacial & Alaknanda Basin', center: [30.4000, 79.3300], zoom: 11 },
      { id: 'joshimath', name: 'Joshimath • Slope Subsidence Sector', center: [30.5564, 79.5658], zoom: 12 },
      { id: 'rishikesh', name: 'Rishikesh • Ganga River Sluice', center: [30.0869, 78.2676], zoom: 11.5 },
      { id: 'dehradun', name: 'Dehradun Valley Urban Basin', center: [30.3165, 78.0322], zoom: 11 },
      { id: 'uttarkashi', name: 'Uttarkashi • Bhagirathi Gorge', center: [30.7268, 78.4354], zoom: 11 }
    ],
    riskLevel: 'WARNING',
    activeHazardsCount: 4,
    activeSensorsCount: 312,
    primaryThreat: 'Glacial Outburst & Slope Subsidence (Alaknanda Basin)'
  },
  {
    id: 'KL',
    name: 'Kerala',
    code: 'KSDMA',
    emblemSubtitle: 'Kerala State Disaster Management Authority',
    center: [10.8505, 76.2711],
    zoom: 7.5,
    bounds: [[8.2, 74.8], [12.8, 77.5]],
    districts: [
      { id: 'wayanad', name: 'Wayanad (Vythiri & Meppadi Basin)', center: [11.6854, 76.1320], zoom: 11.5 },
      { id: 'idukki', name: 'Idukki • High Range Hydro Corridor', center: [9.8494, 76.9810], zoom: 11 },
      { id: 'ernakulam', name: 'Ernakulam • Periyar River Estuary', center: [9.9816, 76.2999], zoom: 11 },
      { id: 'pathanamthitta', name: 'Pathanamthitta • Pamba River Basin', center: [9.2648, 76.7870], zoom: 11 }
    ],
    riskLevel: 'CRITICAL',
    activeHazardsCount: 5,
    activeSensorsCount: 386,
    primaryThreat: 'Debris Flow & High-Velocity Flash Inundation (Vythiri Gorge)'
  },
  {
    id: 'AS',
    name: 'Assam',
    code: 'ASDMA',
    emblemSubtitle: 'Assam State Disaster Management Authority',
    center: [26.2006, 92.9376],
    zoom: 7.2,
    bounds: [[24.1, 89.7], [28.0, 96.0]],
    districts: [
      { id: 'guwahati', name: 'Kamrup Metro • Guwahati Corridor', center: [26.1800, 91.7500], zoom: 11 },
      { id: 'kaziranga', name: 'Golaghat • Kaziranga Floodplain', center: [26.5775, 93.1711], zoom: 11 },
      { id: 'dibrugarh', name: 'Dibrugarh • Upper Brahmaputra', center: [27.4728, 94.9120], zoom: 11 },
      { id: 'cachar', name: 'Barak Valley • Silchar Catchment', center: [24.8333, 92.7789], zoom: 11 }
    ],
    riskLevel: 'SEVERE',
    activeHazardsCount: 6,
    activeSensorsCount: 450,
    primaryThreat: 'Brahmaputra Riverine Surge & Embankment Breach'
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH-SDMA',
    emblemSubtitle: 'Maharashtra State Disaster Management Authority',
    center: [19.7515, 75.7139],
    zoom: 6.8,
    bounds: [[15.6, 72.6], [22.0, 80.9]],
    districts: [
      { id: 'mumbai', name: 'Mumbai Metropolitan Coastal Zone', center: [19.0760, 72.8777], zoom: 11 },
      { id: 'pune', name: 'Pune • Mutha River Basin & Ghats', center: [18.5204, 73.8567], zoom: 11 },
      { id: 'satara', name: 'Satara • Koyna Catchment Reservoir', center: [17.6805, 73.9997], zoom: 11 },
      { id: 'nagpur', name: 'Nagpur • Vidarbha Thermal Zone', center: [21.1458, 79.0882], zoom: 11 }
    ],
    riskLevel: 'WATCH',
    activeHazardsCount: 2,
    activeSensorsCount: 520,
    primaryThreat: 'Urban Waterlogging & Western Ghats Slope Saturation'
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    code: 'HPSDMA',
    emblemSubtitle: 'Himachal Pradesh State Disaster Management Authority',
    center: [31.1048, 77.1734],
    zoom: 7.5,
    bounds: [[30.3, 75.5], [33.3, 79.0]],
    districts: [
      { id: 'kullu', name: 'Kullu • Beas River Valley Gorge', center: [31.9579, 77.1095], zoom: 11 },
      { id: 'shimla', name: 'Shimla Ridge & Water Shed', center: [31.1048, 77.1734], zoom: 11 },
      { id: 'mandi', name: 'Mandi • Uhl & Beas Confluence', center: [31.7087, 76.9320], zoom: 11 },
      { id: 'kinnaur', name: 'Kinnaur • Sutlej Hydro Corridor', center: [31.6510, 78.4752], zoom: 10.5 }
    ],
    riskLevel: 'WARNING',
    activeHazardsCount: 3,
    activeSensorsCount: 260,
    primaryThreat: 'Flash Flooding, Cloudburst Runoff & Rockfall'
  },
  {
    id: 'OD',
    name: 'Odisha',
    code: 'OSDMA',
    emblemSubtitle: 'Odisha State Disaster Management Authority',
    center: [20.9517, 85.0985],
    zoom: 7.2,
    bounds: [[17.8, 81.3], [22.6, 87.5]],
    districts: [
      { id: 'puri', name: 'Puri Coastal Storm Surge Zone', center: [19.8135, 85.8312], zoom: 11 },
      { id: 'cuttack', name: 'Cuttack • Mahanadi Delta Head', center: [20.4625, 85.8828], zoom: 11 },
      { id: 'balasore', name: 'Balasore Coastal Estuary', center: [21.4934, 86.9135], zoom: 11 },
      { id: 'kendrapara', name: 'Kendrapara Mangrove Buffer', center: [20.4998, 86.4230], zoom: 11 }
    ],
    riskLevel: 'WATCH',
    activeHazardsCount: 2,
    activeSensorsCount: 410,
    primaryThreat: 'Coastal Tidal Inundation & Riverine Delta Surge'
  }
];

// ==========================================================================
// NATIONAL DEMONSTRATION METRICS & SENSOR CLUSTERS
// ==========================================================================
export const NATIONAL_OVERVIEW = {
  totalMonitoredStates: 28,
  totalActiveEdgeNodes: 3480,
  activeNationalAlerts: 34,
  criticalIncidentsNationwide: 8,
  satelliteRadarsActive: 6,
  satelliteSyncStatus: 'INSAT-3DR & Sentinel-2 Sync: 03m ago',
  nationalUptime: 99.4,
  emergencyHotlines: [
    { label: 'National Disaster Helpline', number: '112 / 1070' },
    { label: 'NDRF HQ Control Room', number: '011-24363260' },
    { label: 'Central Water Commission (CWC)', number: '1800-11-2442' },
    { label: 'IMD Severe Weather Watch', number: '011-24652484' }
  ]
};

// ==========================================================================
// STATE SENSORS DATABASE (Scoped with stateId)
// ==========================================================================
export const ALL_SENSORS = [
  // --- TAMIL NADU SENSORS ---
  { id: 'TN-CBE-001', stateId: 'TN', name: 'Coimbatore Central AQI & Weather Tower', location: 'Coimbatore (Gandhipuram)', lat: 11.0052, lng: 76.9570, status: 'Online', risk: 'Low', battery: 89, signal: -58, temp: 28.8, hum: 72, pm25: 48, waterLevel: 1.2, soilMoisture: 45, type: 'air', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'TN-CBE-002', stateId: 'TN', name: 'Noyyal River Bridge Hydro-Sensor', location: 'Coimbatore (Singanallur)', lat: 11.0154, lng: 76.9980, status: 'Online', risk: 'Moderate', battery: 76, signal: -65, temp: 27.5, hum: 78, pm25: 55, waterLevel: 2.1, soilMoisture: 58, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'TN-AVS-001', stateId: 'TN', name: 'Avinashi Upstream Gorge Gauge', location: 'Avinashi (Noyyal Gorge)', lat: 11.1920, lng: 77.2050, status: 'Online', risk: 'Low', battery: 82, signal: -68, temp: 26.8, hum: 75, pm25: 35, waterLevel: 1.8, soilMoisture: 55, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'TN-AVS-002', stateId: 'TN', name: 'Avinashi Town Weir Level Sentinel', location: 'Avinashi (Town Centre)', lat: 11.1881, lng: 77.2235, status: 'Online', risk: 'Low', battery: 94, signal: -55, temp: 27.2, hum: 74, pm25: 38, waterLevel: 1.5, soilMoisture: 50, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'TN-AVS-003', stateId: 'TN', name: 'Avinashi Downstream Farm Telemetry', location: 'Avinashi (Sarkarsamakulam)', lat: 11.1750, lng: 77.2510, status: 'Online', risk: 'Low', battery: 71, signal: -72, temp: 26.4, hum: 80, pm25: 40, waterLevel: 2.0, soilMoisture: 62, type: 'water', health: 'Maintenance Required', lastDataTime: minutesAgo(4) },
  { id: 'TN-AVS-004', stateId: 'TN', name: 'Avinashi SITRA Industrial Micro-Climate', location: 'Avinashi (SITRA Corridor)', lat: 11.2010, lng: 77.2150, status: 'Degraded', risk: 'Moderate', battery: 38, signal: -90, temp: 28.0, hum: 70, pm25: 62, waterLevel: 1.6, soilMoisture: 48, type: 'heat', health: 'Maintenance Required', lastDataTime: minutesAgo(7) },
  { id: 'TN-AVS-005', stateId: 'TN', name: 'Avinashi Canal Sluice Node', location: 'Avinashi (Lower Canal)', lat: 11.1680, lng: 77.2700, status: 'Offline', risk: 'Low', battery: 6, signal: -98, temp: 0, hum: 0, pm25: 0, waterLevel: 0, soilMoisture: 0, type: 'water', health: 'Damaged', lastDataTime: minutesAgo(58) },
  { id: 'TN-AVS-006', stateId: 'TN', name: 'Avinashi Satellite Backup Station', location: 'Avinashi (Vijayamangalam Rd)', lat: 11.1960, lng: 77.2380, status: 'Online', risk: 'Low', battery: 87, signal: -61, temp: 27.0, hum: 76, pm25: 36, waterLevel: 1.7, soilMoisture: 53, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'TN-NIL-001', stateId: 'TN', name: 'Coonoor Ghat Inclinometer & Rain Gauge', location: 'Nilgiris (Coonoor Slope)', lat: 11.3530, lng: 76.7959, status: 'Online', risk: 'Moderate', battery: 88, signal: -64, temp: 18.2, hum: 92, pm25: 22, waterLevel: 2.2, soilMoisture: 84, type: 'landslide', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'TN-CHN-001', stateId: 'TN', name: 'Adyar River Estuary Hydro-Station', location: 'Chennai (Adyar Basin)', lat: 13.0067, lng: 80.2570, status: 'Online', risk: 'Low', battery: 91, signal: -52, temp: 31.4, hum: 82, pm25: 78, waterLevel: 1.1, soilMoisture: 40, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'TN-MDU-001', stateId: 'TN', name: 'Vaigai Dam Inflow Telemetry Node', location: 'Madurai (Vaigai Causeway)', lat: 9.9320, lng: 78.1350, status: 'Online', risk: 'Low', battery: 95, signal: -59, temp: 32.1, hum: 62, pm25: 44, waterLevel: 1.4, soilMoisture: 38, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) },

  // --- UTTARAKHAND SENSORS ---
  { id: 'UT-CHM-001', stateId: 'UT', name: 'Alaknanda River Hydro-Acoustic Gauge', location: 'Chamoli (Alaknanda Basin)', lat: 30.4120, lng: 79.3450, status: 'Online', risk: 'Critical', battery: 84, signal: -68, temp: 14.5, hum: 88, pm25: 18, waterLevel: 4.1, soilMoisture: 91, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'UT-JSH-001', stateId: 'UT', name: 'Joshimath Sub-surface Inclinometer 04', location: 'Joshimath (Sector B Subsidence)', lat: 30.5580, lng: 79.5680, status: 'Online', risk: 'Critical', battery: 72, signal: -78, temp: 12.8, hum: 82, pm25: 20, waterLevel: 1.2, soilMoisture: 94, type: 'landslide', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'UT-RSH-001', stateId: 'UT', name: 'Pashulok Barrage Discharge Monitor', location: 'Rishikesh (Ganga Channel)', lat: 30.0820, lng: 78.2710, status: 'Online', risk: 'Moderate', battery: 93, signal: -56, temp: 24.2, hum: 74, pm25: 42, waterLevel: 2.8, soilMoisture: 65, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'UT-DDN-001', stateId: 'UT', name: 'Dehradun Valley AQI & Met Sentinel', location: 'Dehradun (Rajpur Rd)', lat: 30.3250, lng: 78.0410, status: 'Online', risk: 'Low', battery: 89, signal: -60, temp: 26.5, hum: 68, pm25: 52, waterLevel: 1.0, soilMoisture: 42, type: 'air', health: 'Active', lastDataTime: minutesAgo(3) },
  { id: 'UT-UTK-001', stateId: 'UT', name: 'Bhagirathi Gorge Seismic & Runoff Pod', location: 'Uttarkashi (Gorge Pass)', lat: 30.7310, lng: 78.4410, status: 'Online', risk: 'High', battery: 68, signal: -82, temp: 16.0, hum: 85, pm25: 15, waterLevel: 3.4, soilMoisture: 88, type: 'water', health: 'Maintenance Required', lastDataTime: minutesAgo(4) },

  // --- KERALA SENSORS ---
  { id: 'KL-WYD-001', stateId: 'KL', name: 'Vythiri Flash Flood Gorge Hydro-Gauge', location: 'Wayanad (Vythiri Gorge)', lat: 11.6620, lng: 76.1150, status: 'Online', risk: 'Critical', battery: 64, signal: -82, temp: 24.2, hum: 92, pm25: 28, waterLevel: 3.84, soilMoisture: 96, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'KL-WYD-002', stateId: 'KL', name: 'Meppadi Hill Slope Pore-Pressure Sensor', location: 'Wayanad (Meppadi Ridge)', lat: 11.6450, lng: 76.1550, status: 'Online', risk: 'Critical', battery: 73, signal: -74, temp: 23.8, hum: 94, pm25: 24, waterLevel: 3.4, soilMoisture: 97, type: 'landslide', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'KL-IDK-001', stateId: 'KL', name: 'Idukki Arch Dam Spillway Level', location: 'Idukki (Cheruthoni Basin)', lat: 9.8510, lng: 76.9780, status: 'Online', risk: 'High', battery: 92, signal: -61, temp: 22.0, hum: 89, pm25: 19, waterLevel: 3.1, soilMoisture: 82, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'KL-EKM-001', stateId: 'KL', name: 'Periyar River Kalady Flood Warning Station', location: 'Ernakulam (Periyar River)', lat: 10.1680, lng: 76.4420, status: 'Online', risk: 'Moderate', battery: 85, signal: -67, temp: 27.8, hum: 84, pm25: 45, waterLevel: 2.3, soilMoisture: 70, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) },

  // --- ASSAM SENSORS ---
  { id: 'AS-GHY-001', stateId: 'AS', name: 'Brahmaputra Saraighat Hydro-Gauge', location: 'Kamrup Metro (Guwahati)', lat: 26.1850, lng: 91.6850, status: 'Online', risk: 'Critical', battery: 78, signal: -70, temp: 29.5, hum: 90, pm25: 38, waterLevel: 4.82, soilMoisture: 95, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'AS-KZR-001', stateId: 'AS', name: 'Kaziranga Southern Buffer Flood Sentinel', location: 'Golaghat (Kaziranga Buffer)', lat: 26.5820, lng: 93.1850, status: 'Online', risk: 'Critical', battery: 82, signal: -75, temp: 28.2, hum: 94, pm25: 22, waterLevel: 4.20, soilMoisture: 98, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) },
  { id: 'AS-DBR-001', stateId: 'AS', name: 'Dibrugarh Town Protection Embankment', location: 'Dibrugarh (Brahmaputra Dykes)', lat: 27.4850, lng: 94.9200, status: 'Online', risk: 'High', battery: 70, signal: -80, temp: 28.9, hum: 88, pm25: 31, waterLevel: 3.65, soilMoisture: 89, type: 'water', health: 'Active', lastDataTime: minutesAgo(3) },

  // --- MAHARASHTRA SENSORS ---
  { id: 'MH-MUM-001', stateId: 'MH', name: 'Mithi River BKC Hydro-Level Sentinel', location: 'Mumbai (Bandra Kurla Complex)', lat: 19.0650, lng: 72.8680, status: 'Online', risk: 'Moderate', battery: 94, signal: -54, temp: 30.5, hum: 86, pm25: 112, waterLevel: 2.2, soilMoisture: 65, type: 'water', health: 'Active', lastDataTime: minutesAgo(1) },
  { id: 'MH-SAT-001', stateId: 'MH', name: 'Koyna Dam Catchment Telemetry Hub', location: 'Satara (Koyna Valley)', lat: 17.3980, lng: 73.7480, status: 'Online', risk: 'Low', battery: 86, signal: -68, temp: 25.4, hum: 78, pm25: 28, waterLevel: 1.8, soilMoisture: 58, type: 'water', health: 'Active', lastDataTime: minutesAgo(2) }
];

// ==========================================================================
// STATE ACTIVE ALERTS DATABASE (Scoped with stateId)
// ==========================================================================
export const ALL_ALERTS = [
  // --- TAMIL NADU ALERTS ---
  {
    id: 'ALT-TN-101',
    stateId: 'TN',
    hazard: 'Flood',
    severity: 'Critical',
    title: 'Flash Flood Watch & Downstream Sluice Alert',
    location: 'Avinashi • Noyyal River Gorge Basin',
    timeAgo: '3 min ago',
    timestamp: '19:28',
    aiConfidence: 94,
    description: 'Upstream cloudburst runoff in Coimbatore funneling down Noyyal River. Water level at upstream gorge (AVS-001) has reached 2.40m with +0.35m/hr surge rate.',
    coordinates: [11.1920, 77.2050],
    sensorId: 'TN-AVS-001'
  },
  {
    id: 'ALT-TN-102',
    stateId: 'TN',
    hazard: 'Heavy Rainfall',
    severity: 'Warning',
    title: 'Intense Monsoon Catchment Precipitation',
    location: 'Coimbatore Foothills • Singanallur',
    timeAgo: '11 min ago',
    timestamp: '19:20',
    aiConfidence: 89,
    description: '58 mm/hr rainfall recorded at Western Ghats foothills station. Discharge channeling towards downstream Avinashi weir.',
    coordinates: [11.0154, 76.9980],
    sensorId: 'TN-CBE-002'
  },
  {
    id: 'ALT-TN-103',
    stateId: 'TN',
    hazard: 'Landslide',
    severity: 'Watch',
    title: 'Ghat Sector Soil Saturation Threshold Notice',
    location: 'Nilgiris • Coonoor Mountain Pass',
    timeAgo: '28 min ago',
    timestamp: '19:03',
    aiConfidence: 81,
    description: 'Pore-water pressure sensor recorded 84% soil moisture. Pre-cautionary traffic advisory on NH-544.',
    coordinates: [11.3530, 76.7959],
    sensorId: 'TN-NIL-001'
  },

  // --- UTTARAKHAND ALERTS ---
  {
    id: 'ALT-UT-201',
    stateId: 'UT',
    hazard: 'Glacial Flood',
    severity: 'Critical',
    title: 'Alaknanda Hydro-Surge Threat Level Red',
    location: 'Chamoli • Alaknanda Basin Upper Gorge',
    timeAgo: '2 min ago',
    timestamp: '19:29',
    aiConfidence: 96,
    description: 'Gauge UT-CHM-001 breached danger mark at 4.10m. Downstream hydro-electric stations alerted for emergency gate control.',
    coordinates: [30.4120, 79.3450],
    sensorId: 'UT-CHM-001'
  },
  {
    id: 'ALT-UT-202',
    stateId: 'UT',
    hazard: 'Landslide',
    severity: 'Critical',
    title: 'Slope Displacement Anomaly in Subsidence Sector',
    location: 'Joshimath • Sector B Slopes',
    timeAgo: '8 min ago',
    timestamp: '19:23',
    aiConfidence: 92,
    description: 'Inclinometer recorded +2.8mm lateral shear displacement in 60 mins. Civil evacuation advisory active for Zone 3.',
    coordinates: [30.5580, 79.5680],
    sensorId: 'UT-JSH-001'
  },

  // --- KERALA ALERTS ---
  {
    id: 'ALT-KL-301',
    stateId: 'KL',
    hazard: 'Flash Flood',
    severity: 'Critical',
    title: 'Vythiri Gorge Flash Inundation Alert',
    location: 'Wayanad • Vythiri River Pass',
    timeAgo: '4 min ago',
    timestamp: '19:27',
    aiConfidence: 95,
    description: 'Water level reached 3.84m against critical threshold 3.20m. Debris flow detected along Chembra mountain slopes.',
    coordinates: [11.6620, 76.1150],
    sensorId: 'KL-WYD-001'
  },
  {
    id: 'ALT-KL-302',
    stateId: 'KL',
    hazard: 'Landslide',
    severity: 'Critical',
    title: 'High Pore-Pressure Creep in Tea Estate Sector',
    location: 'Wayanad • Meppadi Ridge Slope 4',
    timeAgo: '14 min ago',
    timestamp: '19:17',
    aiConfidence: 91,
    description: 'Soil moisture saturation reached 97%. NDRF Unit 09 initiating preemptive transit of vulnerable families.',
    coordinates: [11.6450, 76.1550],
    sensorId: 'KL-WYD-002'
  },

  // --- ASSAM ALERTS ---
  {
    id: 'ALT-AS-401',
    stateId: 'AS',
    hazard: 'Riverine Flood',
    severity: 'Critical',
    title: 'Brahmaputra Flow Exceeding Extreme Danger Mark',
    location: 'Kamrup Metro • Saraighat Bridge Station',
    timeAgo: '6 min ago',
    timestamp: '19:25',
    aiConfidence: 98,
    description: 'River discharge peaked at 4.82m. Embankment patrol teams deployed with geo-bag reinforcements.',
    coordinates: [26.1850, 91.6850],
    sensorId: 'AS-GHY-001'
  }
];

// ==========================================================================
// STATE EMERGENCY INCIDENTS (Scoped with stateId)
// ==========================================================================
export const ALL_INCIDENTS = [
  // --- TAMIL NADU INCIDENTS ---
  {
    id: 'TN-FLD-042',
    stateId: 'TN',
    hazard: 'Flood',
    severity: 'Critical',
    title: 'Noyyal River Basin Runoff Surge Management',
    location: 'Avinashi Taluk (Sarkarsamakulam Weir)',
    affectedArea: '5.8 km²',
    detectedTime: '18:42',
    status: 'ACTIVE',
    aiRisk: 88,
    assignedTeam: 'TN-SDRF Unit 04 (Coimbatore Division)',
    coordinates: [11.1881, 77.2235],
    sop: [
      { id: 'sop-1', label: 'Hydro threshold breach detected at Gauge AVS-001', done: true, time: '18:42' },
      { id: 'sop-2', label: 'District Disaster EOC notified via CAP-India Protocol', done: true, time: '18:45' },
      { id: 'sop-3', label: 'Incident room created & SOG Escalation triggered', done: true, time: '18:48' },
      { id: 'sop-4', label: 'TN-SDRF Quick Response Squad dispatched to weir', done: true, time: '19:05' },
      { id: 'sop-5', label: 'Evacuation of low-lying riverbed dwellings (Zone 1 & 2)', done: false, time: 'Pending' },
      { id: 'sop-6', label: 'Water level recession verified & incident debrief', done: false, time: 'Pending' }
    ]
  },
  {
    id: 'TN-LND-018',
    stateId: 'TN',
    hazard: 'Landslide',
    severity: 'Warning',
    title: 'Coonoor Ghat Embankment Micro-Creep',
    location: 'Nilgiris (KM 14 Mountain Highway)',
    affectedArea: '1.2 km²',
    detectedTime: '17:30',
    status: 'ACTIVE',
    aiRisk: 74,
    assignedTeam: 'Highways Emergency Soil Corps',
    coordinates: [11.3530, 76.7959],
    sop: [
      { id: 'sop-1', label: 'Inclinometer shear alarm triggered', done: true, time: '17:30' },
      { id: 'sop-2', label: 'Collectorate issued heavy vehicle diversion', done: true, time: '17:40' },
      { id: 'sop-3', label: 'Barrier placement & drone slope inspection', done: true, time: '18:15' },
      { id: 'sop-4', label: 'Stabilization anchors deployed', done: false, time: 'Pending' }
    ]
  },

  // --- UTTARAKHAND INCIDENTS ---
  {
    id: 'UT-GLC-009',
    stateId: 'UT',
    hazard: 'Glacial Flood',
    severity: 'Critical',
    title: 'Alaknanda Catchment Flash Inundation SOP',
    location: 'Chamoli District (Alaknanda Gorge Pass)',
    affectedArea: '8.4 km²',
    detectedTime: '18:10',
    status: 'ACTIVE',
    aiRisk: 96,
    assignedTeam: 'NDRF 8th Battalion & UK-SDRF Alpha',
    coordinates: [30.4120, 79.3450],
    sop: [
      { id: 'sop-1', label: 'Hydro-radar surge alert verified (>4.0m)', done: true, time: '18:10' },
      { id: 'sop-2', label: 'Dam gates opened downstream at Pashulok', done: true, time: '18:18' },
      { id: 'sop-3', label: 'Sirens activated in 12 riverside villages', done: true, time: '18:25' },
      { id: 'sop-4', label: 'NDRF deployed to vulnerable riverbank zones', done: true, time: '18:50' },
      { id: 'sop-5', label: 'Flood wave safe passage confirmed', done: false, time: 'Pending' }
    ]
  },

  // --- KERALA INCIDENTS ---
  {
    id: 'KL-FLD-031',
    stateId: 'KL',
    hazard: 'Flash Flood',
    severity: 'Critical',
    title: 'Vythiri Gorge Debris Surge Response',
    location: 'Wayanad District (Vythiri Basin)',
    affectedArea: '4.2 km²',
    detectedTime: '18:42',
    status: 'ACTIVE',
    aiRisk: 94,
    assignedTeam: 'NDRF Battalion 04 • Unit 09',
    coordinates: [11.6620, 76.1150],
    sop: [
      { id: 'sop-1', label: 'Hydro-Gauge N-003 threshold breach (>3.2m)', done: true, time: '18:42' },
      { id: 'sop-2', label: 'District EOC broadcast emergency SMS', done: true, time: '18:46' },
      { id: 'sop-3', label: 'Community stadium relief camp (SH-02) activated', done: true, time: '18:55' },
      { id: 'sop-4', label: 'Evacuation teams en-route to Sector C', done: true, time: '19:10' },
      { id: 'sop-5', label: 'Search and rescue across inundation corridor', done: false, time: 'Pending' }
    ]
  }
];

// ==========================================================================
// STATE RESPONSE TEAMS (Scoped with stateId)
// ==========================================================================
export const ALL_TEAMS = [
  // --- TAMIL NADU TEAMS ---
  { id: 'TN-TM-01', stateId: 'TN', name: 'TN-SDRF Quick Response Battalion 04', type: 'Rescue & Inundation', location: 'Coimbatore District Base', lat: 11.012, lng: 76.960, status: 'Deployed', personnel: 28, eta: '7 mins' },
  { id: 'TN-TM-02', stateId: 'TN', name: 'Tiruppur Fire & Disaster Rescue Unit', type: 'Evacuation & Pumping', location: 'Avinashi Fire Station', lat: 11.185, lng: 77.220, status: 'Available', personnel: 16, eta: 'Standby' },
  { id: 'TN-TM-03', stateId: 'TN', name: 'Nilgiris Mountain Terrain Rescue Squad', type: 'Landslide & Clearing', location: 'Coonoor Outpost', lat: 11.350, lng: 76.800, status: 'Deployed', personnel: 14, eta: '12 mins' },
  { id: 'TN-TM-04', stateId: 'TN', name: 'Aerial Drone Survey Unit 03 (TN-SDMA)', type: 'LiDAR Reconnaissance', location: 'Coimbatore Air Base', lat: 11.030, lng: 77.040, status: 'Active Mission', personnel: 4, eta: 'On Station' },

  // --- UTTARAKHAND TEAMS ---
  { id: 'UT-TM-01', stateId: 'UT', name: 'NDRF 8th Battalion Chamoli Detachment', type: 'High-Altitude Glacier & Swift Water', location: 'Joshimath Base Camp', lat: 30.550, lng: 79.560, status: 'Deployed', personnel: 32, eta: '5 mins' },
  { id: 'UT-TM-02', stateId: 'UT', name: 'UK-SDRF Rapid Mountain Rescue 02', type: 'Rope & Subsidence Evacuation', location: 'Chamoli Head', lat: 30.405, lng: 79.332, status: 'Available', personnel: 20, eta: 'Standby' },

  // --- KERALA TEAMS ---
  { id: 'KL-TM-01', stateId: 'KL', name: 'NDRF Battalion 04 • Unit 09', type: 'Flash Flood & Inundation', location: 'Wayanad Sector 3 Base', lat: 11.670, lng: 76.120, status: 'Deployed', personnel: 24, eta: '8 mins' },
  { id: 'KL-TM-02', stateId: 'KL', name: 'Kerala Fire & Rescue Special Task Force', type: 'Debris & Tree Clearance', location: 'Kalpetta Station', lat: 11.615, lng: 76.095, status: 'Available', personnel: 18, eta: 'Standby' }
];

// ==========================================================================
// STATE RELIEF SHELTERS (Scoped with stateId)
// ==========================================================================
export const ALL_SHELTERS = [
  // --- TAMIL NADU SHELTERS ---
  { id: 'TN-SH-01', stateId: 'TN', name: 'Government Higher Secondary School Relief Camp', location: 'Avinashi Town Centre', lat: 11.190, lng: 77.228, capacity: 550, occupied: 140, status: 'Active' },
  { id: 'TN-SH-02', stateId: 'TN', name: 'Municipal Community Kalyan Mandapam', location: 'Tiruppur North Corridor', lat: 11.115, lng: 77.345, capacity: 700, occupied: 0, status: 'Ready' },
  { id: 'TN-SH-03', stateId: 'TN', name: 'Corporation Community Hall (Singanallur)', location: 'Coimbatore East', lat: 11.018, lng: 77.002, capacity: 450, occupied: 60, status: 'Active' },

  // --- UTTARAKHAND SHELTERS ---
  { id: 'UT-SH-01', stateId: 'UT', name: 'Joshimath Safe Geological Transit Complex', location: 'Upper Helipad Sector', lat: 30.562, lng: 79.572, capacity: 600, occupied: 210, status: 'Active' },
  { id: 'UT-SH-02', stateId: 'UT', name: 'Chamoli Sports Stadium Evacuation Enclosure', location: 'Gopeshwar Road', lat: 30.415, lng: 79.340, capacity: 850, occupied: 90, status: 'Active' },

  // --- KERALA SHELTERS ---
  { id: 'KL-SH-01', stateId: 'KL', name: 'Vythiri Community Stadium Relief Camp', location: 'Vythiri Town', lat: 11.650, lng: 76.130, capacity: 800, occupied: 320, status: 'Active' }
];

// ==========================================================================
// STATE HAZARD ZONES GEOJSON (Polygons for LiveMap & Dynamic Risk)
// ==========================================================================
export const STATE_HAZARD_ZONES = {
  TN: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Avinashi Noyyal Flood Inundation Corridor', hazard: 'Flood', risk: 'Critical', area: '5.8 km²', stateId: 'TN' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [77.195, 11.212],
            [77.218, 77.225].map(x => x > 50 ? 11.225 : x), // safety
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
        properties: { name: 'Singanallur Urban Overflow Hazard Basin', hazard: 'Flood', risk: 'Warning', area: '3.4 km²', stateId: 'TN' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [76.980, 11.005],
            [77.010, 11.025],
            [77.025, 11.010],
            [77.000, 10.995],
            [76.980, 11.005]
          ]]
        }
      }
    ]
  },
  UT: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Alaknanda Gorge Glacial Surge Perimeter', hazard: 'Flood', risk: 'Critical', area: '8.4 km²', stateId: 'UT' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [79.320, 30.395],
            [79.355, 30.425],
            [79.370, 30.410],
            [79.335, 30.385],
            [79.320, 30.395]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Joshimath Active Subsidence Sector B', hazard: 'Landslide', risk: 'Critical', area: '2.6 km²', stateId: 'UT' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [79.555, 30.550],
            [79.575, 30.565],
            [79.580, 30.555],
            [79.560, 30.542],
            [79.555, 30.550]
          ]]
        }
      }
    ]
  },
  KL: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Vythiri High Inundation Zone', hazard: 'Flood', risk: 'Critical', area: '4.2 km²', stateId: 'KL' },
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
      }
    ]
  },
  AS: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Brahmaputra Low-Lying Delta Inundation Sector', hazard: 'Flood', risk: 'Critical', area: '14.6 km²', stateId: 'AS' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [91.650, 26.160],
            [91.720, 26.210],
            [91.760, 26.190],
            [91.680, 26.140],
            [91.650, 26.160]
          ]]
        }
      }
    ]
  }
};

// ==========================================================================
// STATE AI PREDICTION PROFILES
// ==========================================================================
export const STATE_AI_PREDICTIONS = {
  TN: {
    hazard: 'Flood & Inundation',
    riskScore: 84,
    riskLevel: 'Critical',
    trend: '↗ Increasing (+0.35m/hr)',
    predictionText: 'Upstream cloudburst in Coimbatore foothills funnels runoff into Avinashi Noyyal basin. Crest expected at AVS-001 in 45 minutes.',
    factors: [
      { name: 'Noyyal Upstream Hydro Level (AVS-001)', weight: 36, value: '2.40m / Thr 2.0m', impact: 'critical' },
      { name: 'Catchment Rainfall Rate (CBE-002)', weight: 30, value: '58 mm/hr (Cloudburst)', impact: 'critical' },
      { name: 'Canal Sluice Discharge Acceleration', weight: 18, value: '+0.35 m/hr', impact: 'high' },
      { name: 'Downstream Soil Saturation Model', weight: 16, value: '78% Saturation', impact: 'high' }
    ]
  },
  UT: {
    hazard: 'Glacial Surge & Landslide',
    riskScore: 92,
    riskLevel: 'Critical',
    trend: '↗ SURGING (+0.82m/hr)',
    predictionText: 'Alaknanda upper catchment discharge accelerating rapidly following glacial moraine breach. Extreme precaution advised for downstream hydro-structures.',
    factors: [
      { name: 'Alaknanda Hydro Level (UT-CHM-001)', weight: 42, value: '4.10m / Thr 3.5m', impact: 'critical' },
      { name: 'Glacial Lake Outburst Factor', weight: 28, value: 'High Moraine Volume', impact: 'critical' },
      { name: 'Sub-surface Slope Strain (Joshimath)', weight: 18, value: '+2.8 mm/hr', impact: 'critical' },
      { name: 'Monsoon Precipitation Correlation', weight: 12, value: '94.2% Match', impact: 'high' }
    ]
  },
  KL: {
    hazard: 'Flash Flood & Debris Flow',
    riskScore: 94,
    riskLevel: 'Critical',
    trend: '↗ SURGING (+0.95m/hr)',
    predictionText: 'Hydro-Gauge N-003 at 3.84m exceeding red danger threshold (3.2m). Extreme debris flow risk down Chembra catchment pass.',
    factors: [
      { name: 'Upstream Hydro Level (Gauge N-003)', weight: 44, value: '3.84m / Thr 3.2m', impact: 'critical' },
      { name: 'Catchment Rainfall Intensity', weight: 28, value: '84 mm/hr', impact: 'critical' },
      { name: 'Slope Pore-Pressure Saturation', weight: 18, value: '96% Saturated', impact: 'critical' },
      { name: 'Historical Monsoon Inundation Model', weight: 10, value: '98.2% Correlation', impact: 'moderate' }
    ]
  },
  AS: {
    hazard: 'Riverine Flood',
    riskScore: 96,
    riskLevel: 'Critical',
    trend: '↗ PEAKING (+1.10m/hr)',
    predictionText: 'Brahmaputra flow across Saraighat sector surpassing danger mark by 1.32m. Embankment overtopping modeled within 3 hours.',
    factors: [
      { name: 'Saraighat Hydro Gauge (AS-GHY-001)', weight: 46, value: '4.82m / Thr 3.5m', impact: 'critical' },
      { name: 'Upper Catchment Inflow', weight: 26, value: '14,200 m³/s', impact: 'critical' },
      { name: 'Embankment Stress Index', weight: 18, value: '92% Capacity', impact: 'critical' },
      { name: 'Braided Channel Sedimentation', weight: 10, value: 'High Bed Elevation', impact: 'high' }
    ]
  },
  MH: {
    hazard: 'Urban Waterlogging & Monsoon Runoff',
    riskScore: 68,
    riskLevel: 'High',
    trend: '→ Steady High',
    predictionText: 'Mithi River basin water levels elevated during high-tide synchronization. Pumping stations operating at full load.',
    factors: [
      { name: 'Mithi River Gauge (MH-MUM-001)', weight: 38, value: '2.2m / Warn 2.0m', impact: 'high' },
      { name: 'High-Tide Surge Coefficient', weight: 32, value: '4.15m Tidal Peak', impact: 'high' },
      { name: 'Urban Runoff Discharge Rate', weight: 18, value: '42 mm/hr', impact: 'moderate' },
      { name: 'Stormwater Sluice Capacity', weight: 12, value: '84% Inflow', impact: 'moderate' }
    ]
  },
  HP: {
    hazard: 'Cloudburst & Riverine Flash Inundation',
    riskScore: 78,
    riskLevel: 'High',
    trend: '↗ Increasing',
    predictionText: 'Beas River tributaries experiencing rapid volume rise following cloudburst activity in upper valley sectors.',
    factors: [
      { name: 'Beas River Hydro Inflow', weight: 40, value: '3.6m / Thr 3.0m', impact: 'high' },
      { name: 'Cloudburst Precipitation Spike', weight: 30, value: '62 mm/hr', impact: 'critical' },
      { name: 'Steep Slope Runoff Velocity', weight: 18, value: '+0.55 m/hr', impact: 'high' },
      { name: 'Rockfall Vibration Sensors', weight: 12, value: 'Moderate Micro-Seismic', impact: 'moderate' }
    ]
  },
  OD: {
    hazard: 'Coastal Surge & Delta Discharge',
    riskScore: 62,
    riskLevel: 'Moderate',
    trend: '→ Stable Watch',
    predictionText: 'Mahanadi river discharge into coastal delta being regulated via Naraj barrage. Coastal storm watch active.',
    factors: [
      { name: 'Mahanadi Delta Discharge', weight: 36, value: '2.1m / Thr 2.5m', impact: 'moderate' },
      { name: 'Bay of Bengal Depression Surge', weight: 32, value: 'Wind 45 km/h', impact: 'moderate' },
      { name: 'Coastal Embankment Sluices', weight: 20, value: 'Gates Open', impact: 'low' },
      { name: 'Mangrove Buffer Dissipation', weight: 12, value: 'High Shielding', impact: 'low' }
    ]
  }
};

// ==========================================================================
// NATIONAL TREND DATASETS & ADVISORIES (For Landing Page)
// ==========================================================================
export const NATIONAL_TRENDS = [
  {
    hazard: 'Monsoon Flood Inundation',
    level: 'CRITICAL (3 Basins)',
    trend: '↗ +14% Week-on-Week',
    summary: 'Active hydrological surges monitored in Noyyal Basin (TN), Alaknanda (UT), and Brahmaputra Delta (AS).',
    icon: '🌊',
    color: 'var(--color-critical)'
  },
  {
    hazard: 'Forest Wildfire Surveillance',
    level: 'WATCH (2 Sectors)',
    trend: '↘ -8% Dampened by Rain',
    summary: 'Low-density thermal radiance detected along dry timber buffer sectors; drone patrols active.',
    icon: '🔥',
    color: 'var(--hazard-fire)'
  },
  {
    hazard: 'Urban Air Quality Index',
    level: 'MODERATE (National Avg 68)',
    trend: '→ Stable Dispersion',
    summary: 'Seasonal atmospheric circulation maintaining particulate levels within standard parameters across major corridors.',
    icon: '🌫️',
    color: 'var(--hazard-air)'
  },
  {
    hazard: 'Extreme Temperature & Heat Wave',
    level: 'NORMAL / SEASONAL',
    trend: '↘ Post-Monsoon Cooling',
    summary: 'Surface temperatures nationwide averaging 28.2°C; thermal stress models within nominal tolerance.',
    icon: '🌡️',
    color: 'var(--hazard-heat)'
  }
];

export const SAFETY_ADVISORIES = [
  {
    type: 'Flash Flood Preparedness',
    icon: '🌊',
    action: 'Immediate Evacuation Protocol',
    details: 'If river gauges exceed warning thresholds (0.3m/hr rise), move promptly to designated multi-story concrete shelters. Avoid low causeways and submersible bridges.'
  },
  {
    type: 'Slope Subsidence & Landslide Safety',
    icon: '⛰️',
    action: 'Ghat Route Safety Measures',
    details: 'During intense precipitation (>40 mm/hr), avoid steep mountain highways. Heed digital variable messaging signboards deployed along hill passes.'
  },
  {
    type: 'Forest Fire Buffer Regulations',
    icon: '🔥',
    action: 'Wildfire Containment Rules',
    details: 'Maintain 50m clear perimeter fuel-breaks around forest dwellings. Report thermal plumes to State EOC (1070) within 5 minutes of sighting.'
  },
  {
    type: 'Severe Atmospheric Disturbances',
    icon: '⛈️',
    action: 'Lightning & High Wind Guidance',
    details: 'Stay indoors away from metallic power towers and ungrounded structures during convective thunderstorm cells tracked on Doppler radar.'
  }
];

// Fallback for legacy imports if needed
export const REGIONS = STATES_CONFIG[0].districts;
export const PUBLIC_LOCATIONS = [];
export const INITIAL_SENSORS = ALL_SENSORS.filter(s => s.stateId === 'TN');
export const INITIAL_ALERTS = ALL_ALERTS.filter(a => a.stateId === 'TN');
export const INITIAL_INCIDENTS = ALL_INCIDENTS.filter(i => i.stateId === 'TN');
export const RESPONSE_TEAMS = ALL_TEAMS.filter(t => t.stateId === 'TN');
export const RELIEF_SHELTERS = ALL_SHELTERS.filter(s => s.stateId === 'TN');
export const AI_PREDICTION_FACTORS = STATE_AI_PREDICTIONS.TN.factors;
export const HAZARD_ZONES_GEOJSON = STATE_HAZARD_ZONES.TN;
