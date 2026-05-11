// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(5,8,16,0.95)';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  } else {
    navbar.style.background = 'rgba(5,8,16,0.8)';
    navbar.style.boxShadow = 'none';
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  // Auto-close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.problem-card, .feature-card, .tier-card, .solution-item, .model-card, .op-step, .stl-node, .formula-pillar, .formula-result, .bento-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Animated chart bars
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.chart-bar');
      bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
      });
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const chartWrap = document.querySelector('.chart-wrap');
if (chartWrap) {
  // Reset widths first
  document.querySelectorAll('.chart-bar').forEach(bar => {
    bar.dataset.width = bar.style.width;
    bar.style.width = '0';
  });
  chartObserver.observe(chartWrap);
}

// Smooth stagger for grid items
document.querySelectorAll('.problem-grid, .features-grid, .tier-grid, .bento-grid').forEach(grid => {
  const items = grid.children;
  Array.from(items).forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
  });
});

// 6-step timeline stagger
document.querySelectorAll('.op-timeline').forEach(timeline => {
  const steps = timeline.querySelectorAll('.op-step');
  steps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.12}s`;
  });
});

// Settlement flow stagger
document.querySelectorAll('.settlement-flow').forEach(flow => {
  const nodes = flow.querySelectorAll('.stl-node');
  nodes.forEach((node, i) => {
    node.style.transitionDelay = `${i * 0.15}s`;
  });
});

// CTA button ripple effect
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute;width:100%;height:100%;top:0;left:0;
      background:rgba(255,255,255,0.2);border-radius:inherit;
      animation:ripple 0.6s ease-out;pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes ripple{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(style);

// Counter animation for stats
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 2000;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    if (suffix === '%') {
      el.textContent = Math.floor(eased * target) + suffix + '+';
    } else if (target === 0) {
      el.textContent = '₩0';
    } else {
      el.textContent = suffix;
    }
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent;
        if (text.includes('0')) animateCounter(num, 0, '₩0');
        else if (text.includes('80')) animateCounter(num, 80, '%');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

console.log('Aiasent.com landing page loaded ✓');
