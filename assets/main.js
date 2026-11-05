/* 渐进增强：根据滚动位置高亮导航；关闭 JavaScript 仍可阅读和跳转。 */
(() => {
  const header = document.querySelector('.site-header');
  const items = [...document.querySelectorAll('.nav-links a[href^="#"]')]
    .map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.target);
  if (!header || !items.length) return;

  let pending = false;
  let headerHeight = header.offsetHeight;

  function updateNavigation() {
    pending = false;
    let active = items[0];
    for (const item of items) {
      if (item.target.getBoundingClientRect().top <= headerHeight + 40) active = item;
    }
    for (const item of items) {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(updateNavigation);
  }

  function updateHeader() {
    headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--anchor-offset', `${headerHeight + 24}px`);
    scheduleUpdate();
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', updateHeader);
  window.addEventListener('pageshow', updateHeader);
  if ('ResizeObserver' in window) new ResizeObserver(updateHeader).observe(header);
  updateHeader();
})();
