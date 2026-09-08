// Formatters & Utility Helpers

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
  if (l.includes('crit') || l.includes('immediate') || l >= 80) return 'critical';
  if (l.includes('high') || l.includes('warn') || l >= 60) return 'high';
  if (l.includes('mod') || l.includes('watch') || l >= 40) return 'moderate';
  return 'low';
}

export function getRiskBadgeHTML(level, text) {
  const cls = getRiskClass(level);
  const label = text || level;
  return `<span class="risk-badge ${cls}">${getRiskEmoji(cls)} ${label}</span>`;
}

export function getRiskEmoji(cls) {
  switch (cls) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'moderate': return '🟡';
    default: return '🟢';
  }
}

export function getHazardIcon(type) {
  const t = String(type).toLowerCase();
  if (t.includes('flood') || t.includes('water')) return '🌊';
  if (t.includes('fire') || t.includes('flame')) return '🔥';
  if (t.includes('air') || t.includes('pm2') || t.includes('pollution')) return '🌫';
  if (t.includes('heat') || t.includes('thermal')) return '🌡';
  if (t.includes('landslide') || t.includes('rock')) return '⛰';
  return '⚠️';
}
