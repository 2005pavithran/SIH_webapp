// Executive Report Generator Component (Re-exports unified Analytics & Reports with reports tab active)

import { createAnalyticsView } from './AnalyticsView.js';

export function createReportGeneratorView() {
  return createAnalyticsView('reports');
}
