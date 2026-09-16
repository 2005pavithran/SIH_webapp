// National Environmental Intelligence Network — Main Application Bootstrap

import { store } from './state/store.js';
import { simulationEngine } from './state/simulation.js';
import { createTopNav } from './components/TopNav.js';
import { createSidebar } from './components/Sidebar.js';
import { initModalManager } from './components/ModalManager.js';
import { drawerManager } from './components/DrawerManager.js';
import { openStateLoginModal } from './components/StateLoginModal.js';

// View Creators
import { createLandingView } from './components/LandingView.js';
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

// Expose global handles for inline onclicks, Leaflet popups & modal management
window.appStore = store;
window.drawerManager = drawerManager;
window.openStateLoginModal = openStateLoginModal;

const VIEW_FACTORY_MAP = {
  'landing': createLandingView,
  '': createLandingView,
  'dashboard': createDashboardView,
  'risk-map': createLiveMapGISView,
  'live-map': createLiveMapGISView,
  'dynamic-risk': createRiskMapDynamic,
  'sensors': createSensorNetworkView,
  'alerts': createAlertCenter,
  'incidents': createIncidentManagerView,
  'teams': createIncidentManagerView,
  'ai-prediction': createAIPredictionView,
  'analytics': () => createAnalyticsView('analytics'),
  'reports': () => createAnalyticsView('reports'),
  'staff-services': createStaffServicesView,
  'settings': createSystemSettingsView
};

class CommandPortalApp {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.currentViewInstance = null;
    this.mainContentEl = null;
    this.topNavInstance = null;
    this.sidebarInstance = null;
  }

  init() {
    if (!this.appRoot) return;

    // 1. Build Shell Structure
    this.topNavInstance = createTopNav();
    const appBody = document.createElement('div');
    appBody.className = 'app-body';

    this.sidebarInstance = createSidebar();
    this.mainContentEl = document.createElement('main');
    this.mainContentEl.className = 'main-content';

    appBody.appendChild(this.sidebarInstance);
    appBody.appendChild(this.mainContentEl);

    this.appRoot.appendChild(this.topNavInstance);
    this.appRoot.appendChild(appBody);

    // 2. Initialize Modal & Drawer Controllers
    initModalManager();
    drawerManager.init();

    // 3. Setup Hash Routing & Listeners
    window.addEventListener('hashchange', () => this.handleHashRoute());

    // 4. Listen to Store State Events
    store.subscribe((state, event, payload) => {
      if (event === 'auth_login') {
        // Upon authority login, transition to dashboard
        if (window.location.hash === '#landing' || !window.location.hash || window.location.hash === '#') {
          window.location.hash = '#dashboard';
        } else {
          this.handleHashRoute();
        }
      } else if (event === 'auth_logout') {
        window.location.hash = '#landing';
        this.handleHashRoute();
      } else if (event === 'view_change') {
        const route = state.currentView;
        const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
        if (currentHash !== route && route !== 'landing') {
          window.location.hash = '#' + route;
        } else {
          this.renderRoute(route);
        }
      }
    });

    // 5. Initial Route Resolution
    this.handleHashRoute();

    // 6. Start Autonomous Telemetry Simulation Engine
    simulationEngine.start();
  }

  handleHashRoute() {
    let route = window.location.hash.replace(/^#\/?/, '').trim();
    if (!route || route === '') {
      route = 'landing';
    }

    const state = store.getState();

    // Guard: Protect operational routes if not authenticated
    if (route !== 'landing' && !state.authenticated) {
      window.location.hash = '#landing';
      openStateLoginModal();
      return;
    }

    // Synchronize store view
    if (state.currentView !== route) {
      store.setView(route);
    } else {
      this.renderRoute(route);
    }
  }

  renderRoute(route) {
    if (!this.mainContentEl) return;

    // Apply layout mode classes
    if (route === 'landing' || route === '') {
      this.appRoot.className = 'layout-mode-standalone';
    } else {
      this.appRoot.className = 'layout-mode-operational';
    }

    // Clean up previous view instance
    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === 'function') {
      this.currentViewInstance.destroy();
    }
    this.mainContentEl.innerHTML = '';

    // Create and attach new view
    const factory = VIEW_FACTORY_MAP[route] || VIEW_FACTORY_MAP['dashboard'];
    this.currentViewInstance = factory();

    if (this.currentViewInstance && this.currentViewInstance.element) {
      this.mainContentEl.appendChild(this.currentViewInstance.element);
    }

    // Scroll main content to top on view transition
    this.mainContentEl.scrollTop = 0;
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const portal = new CommandPortalApp();
  portal.init();
});
