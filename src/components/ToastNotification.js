// Toast Notification Utility

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item ${type === 'crit' || type === 'critical' ? 'crit' : ''}`;

  let icon = 'ℹ️';
  let title = 'System Notification';

  if (type === 'crit' || type === 'critical') {
    icon = '🚨';
    title = 'CRITICAL DISASTER ALERT';
  } else if (type === 'success') {
    icon = '✅';
    title = 'Action Completed';
  } else if (type === 'warning') {
    icon = '⚠️';
    title = 'Hazard Warning';
  }

  toast.innerHTML = `
    <div style="font-size: 18px;">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}
