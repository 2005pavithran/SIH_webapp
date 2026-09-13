// Formatters, Icon Providers & Utility Helpers

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getRiskClass(level) {
  const l = String(level).toLowerCase();
  if (l.includes('crit') || l.includes('immediate') || Number(level) >= 80) return 'critical';
  if (l.includes('high') || l.includes('warn') || Number(level) >= 60) return 'high';
  if (l.includes('mod') || l.includes('watch') || Number(level) >= 40) return 'moderate';
  return 'low';
}

export function getRiskBadgeHTML(level, text) {
  const cls = getRiskClass(level);
  const label = text || level;
  return `<span class="status-badge ${cls}">${label}</span>`;
}

export function getHazardTagClass(hazard) {
  const h = String(hazard).toLowerCase();
  if (h.includes('flood') || h.includes('water')) return 'flood';
  if (h.includes('fire') || h.includes('flame')) return 'fire';
  if (h.includes('air') || h.includes('pm2') || h.includes('pollution')) return 'air';
  if (h.includes('heat') || h.includes('thermal')) return 'heat';
  if (h.includes('landslide') || h.includes('slope') || h.includes('rock')) return 'landslide';
  return 'flood';
}

export function getHazardIcon(type) {
  const t = String(type).toLowerCase();
  if (t.includes('flood') || t.includes('water')) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
  }
  if (t.includes('fire') || t.includes('flame')) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
  }
  if (t.includes('air') || t.includes('pm2') || t.includes('pollution')) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`;
  }
  if (t.includes('heat') || t.includes('thermal')) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`;
  }
  if (t.includes('landslide') || t.includes('slope') || t.includes('rock')) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>`;
  }
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
}

export function getHazardLabel(hazard) {
  return hazard;
}
