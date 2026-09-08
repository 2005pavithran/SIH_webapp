// Environmental Intelligence Authority Portal - Main Application Bootstrap

import { store } from './state/store.js';
import { simulationEngine } from './state/simulation.js';
import { createTopNav } from './components/TopNav.js';
import { createSidebar } from './components/Sidebar.js';
import { initModalManager } from './components/ModalManager.js';

// View Creators
import { createDashboardView } from './components/DashboardView.js';
import { createLiveMapGISView } from './components/LiveMapGISView.js';
import { createRiskMapDynamic } from './components/RiskMapDynamic.js';
import { createAlertCenter } from './components/AlertCenter.js';
import { createAIPredictionView } from './components/AIPrediction.js';
import { createSensorNetworkView } from './components/SensorNetwork.js';
import { createAnalyticsView } from './components/AnalyticsView.js';
import { createIncidentManagerView } from './components/IncidentManager.js';
import { createReportGeneratorView } from './components/ReportGenerator.js';
import { createSystemSettingsView } from './components/SystemSettings.js';

// Expose store globally for inline onclicks in Leaflet popups
window.appStore = store;

class CommandPortalApp {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.currentViewInstance = null;
    this.mainContentEl = null;
  }

  init() {
    if (!this.appRoot) return;

    // 1. Build Shell Structure
    const topNav = createTopNav();
    const appBody = document.createElement('div');
    appBody.className = 'app-body';

    const sidebar = createSidebar();
    this.mainContentEl = document.createElement('main');
    this.mainContentEl.className = 'main-content';

    appBody.appendChild(sidebar);
    appBody.appendChild(this.mainContentEl);

    this.appRoot.appendChild(topNav);
    this.appRoot.appendChild(appBody);

    // 2. Initialize Modal Controller
    initModalManager();

    // 3. Render Default View
    this.renderCurrentView();

    // 4. Listen to View Transitions
    store.subscribe((state, event, payload) => {
      if (event === 'view_change') {
        this.renderCurrentView();
      }
    });

    // 5. Start Telemetry Simulation Engine
    simulationEngine.start();
  }

  renderCurrentView() {
    if (!this.mainContentEl) return;

    // Clean up previous view instance
    if (this.currentViewInstance && this.currentViewInstance.destroy) {
      this.currentViewInstance.destroy();
    }
    this.mainContentEl.innerHTML = '';

    const currentView = store.getState().currentView;

    switch (currentView) {
      case 'dashboard':
        this.currentViewInstance = createDashboardView();
        break;
      case 'live-map':
        this.currentViewInstance = createLiveMapGISView();
        break;
      case 'risk-map':
        this.currentViewInstance = createRiskMapDynamic();
        break;
      case 'alerts':
        this.currentViewInstance = createAlertCenter();
        break;
      case 'ai-prediction':
        this.currentViewInstance = createAIPredictionView();
        break;
      case 'sensors':
        this.currentViewInstance = createSensorNetworkView();
        break;
      case 'analytics':
        this.currentViewInstance = createAnalyticsView();
        break;
      case 'incidents':
      case 'teams':
        this.currentViewInstance = createIncidentManagerView();
        break;
      case 'reports':
        this.currentViewInstance = createReportGeneratorView();
        break;
      case 'settings':
        this.currentViewInstance = createSystemSettingsView();
        break;
      default:
        this.currentViewInstance = createDashboardView();
    }

    if (this.currentViewInstance && this.currentViewInstance.element) {
      this.mainContentEl.appendChild(this.currentViewInstance.element);
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const portal = new CommandPortalApp();
  portal.init();
});
