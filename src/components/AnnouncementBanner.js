// Dismissible Government Announcement & Notification Banner

export function createAnnouncementBanner(title = 'MONSOON MONITORING PROTOCOL', message = 'Active Multi-Hazard Flood & Inundation surveillance active for Chembra & Vythiri catchment basins.', onAction = null) {
  const banner = document.createElement('div');
  banner.className = 'announcement-banner animated-fade';
  banner.setAttribute('role', 'alert');

  banner.innerHTML = `
    <div class="announcement-content">
      <span class="announcement-tag">${title}</span>
      <span>${message}</span>
    </div>
    <div class="announcement-actions">
      <button class="btn-link-action" id="banner-action-btn">View Details</button>
      <button class="btn-banner-close" id="banner-close-btn" aria-label="Dismiss Announcement">&times;</button>
    </div>
  `;

  banner.querySelector('#banner-close-btn').addEventListener('click', () => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-6px)';
    banner.style.transition = 'all 0.2s ease';
    setTimeout(() => banner.remove(), 200);
  });

  banner.querySelector('#banner-action-btn').addEventListener('click', () => {
    if (onAction) {
      onAction();
    } else {
      window.drawerManager?.openAIDrawer('Flood');
    }
  });

  return banner;
}
