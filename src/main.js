// Environmental Intelligence Authority Portal - Main Application Bootstrap

import { store } from './state/store.js';
import { simulationEngine } from './state/simulation.js';
import { createTopNav } from './components/TopNav.js';
import { createSidebar } from './components/Sidebar.js';
import { initModalManager } from './components/ModalManager.js';
import { drawerManager } from './components/DrawerManager.js';

// View Creators
import { createDashboardView } from './components/DashboardView.js';
import { createLiveMapGISView } from './components/LiveMapGISView.js';
import { createRiskMapDynamic } from './components/RiskMapDynamic.js';
import { createAlertCenter } from './components/AlertCenter.js';
import { createAIPredictionView } from './components/AIPrediction.js';
import { createSensorNetworkView } from './components/SensorNetwork.js';
import { createAnalyticsView } from './components/AnalyticsView.js';
import { createIncidentManagerView } from './components/IncidentManager.js';
import { createStaffServicesView } from './components/StaffServicesView.js';
import { createSystemSettingsView } from './components/SystemSettings.js';
import { createPublicPortalView } from './components/PublicPortalView.js';

// Expose store and drawer globally for inline onclicks & Leaflet popups
window.appStore = store;
window.drawerManager = drawerManager;

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

    // 2. Initialize Modal & Drawer Controllers
    initModalManager();
    drawerManager.init();

    // 3. Render Default View
    this.renderCurrentView();

    // 4. Listen to View Transitions
    store.subscribe((state, event, payload) => {
      if (event === 'view_change' || event === 'ui_mode_change') {
        const bodyEl = document.querySelector('.app-body');
        if (bodyEl) {
          bodyEl.classList.toggle('mode-public', state.uiMode === 'PUBLIC');
        }
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
      case 'public':
        this.currentViewInstance = createPublicPortalView();
        break;
      case 'dashboard':
        this.currentViewInstance = createDashboardView();
        break;
      case 'risk-map':
      case 'live-map':
        this.currentViewInstance = createLiveMapGISView();
        break;
      case 'dynamic-risk':
        this.currentViewInstance = createRiskMapDynamic();
        break;
      case 'alerts':
        this.currentViewInstance = createAlertCenter();
        break;
      case 'sensors':
        this.currentViewInstance = createSensorNetworkView();
        break;
      case 'incidents':
      case 'teams':
        this.currentViewInstance = createIncidentManagerView();
        break;
      case 'analytics':
        this.currentViewInstance = createAnalyticsView('analytics');
        break;
      case 'reports':
        this.currentViewInstance = createAnalyticsView('reports');
        break;
      case 'staff-services':
        this.currentViewInstance = createStaffServicesView();
        break;
      case 'ai-prediction':
        this.currentViewInstance = createAIPredictionView();
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
