// ==========================================================================
// Aiasent.com v3 — Interactive Engine
// Prime Intellect nav pills + Scroll animations + Service flow demos
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavPills();
  initCounters();
  initMCPDemo();
  initRoutingSimulator();
  initModal();
  initMobileMenu();
  initScrollAnimations();
});

// ──────────────────────────────────
// 1. Numbered Nav Pills (01/02/03)
// ──────────────────────────────────
function initNavPills() {
  const pills = document.querySelectorAll('.nav-pill');
  const sections = ['step-mcp', 'step-routing', 'step-settlement'];

  // Click → smooth scroll
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll → active pill
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pills.forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-target') === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ──────────────────────────────────
// 2. Counter Animations
// ──────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let fired = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        counters.forEach(c => {
          const target = parseInt(c.getAttribute('data-target'), 10);
          animateNum(c, 0, target, 1400);
        });
      }
    });
  }, { threshold: 0.3 });

  const stats = document.querySelector('.hero-stats');
  if (stats) observer.observe(stats);
}

function animateNum(el, start, end, duration) {
  let t0 = null;
  const step = (ts) => {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * (end - start) + start);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ──────────────────────────────────
// 3. MCP Knowledge Demo (FIG.1)
// ──────────────────────────────────
function initMCPDemo() {
  const connectors = document.querySelectorAll('#mcpConnectors .mcp-conn');
  const orbits = document.querySelectorAll('.orbit-item');
  const btnSim = document.getElementById('btnSimSync');

  // Scroll trigger: animate connectors connecting one by one
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        connectors.forEach((conn, i) => {
          const delay = parseInt(conn.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            conn.classList.add('connected');
          }, 300 + delay);
        });
        // Show orbit items with stagger
        orbits.forEach((item, i) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, 800 + i * 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const mcpSection = document.getElementById('step-mcp');
  if (mcpSection) observer.observe(mcpSection);

  // Simulate sync button
  if (btnSim) {
    btnSim.addEventListener('click', () => {
      btnSim.textContent = '벡터화 처리 중...';
      btnSim.disabled = true;

      setTimeout(() => {
        btnSim.textContent = '✓ 18개 청크 벡터 인덱싱 완료 (SQLite-VSS)';
        btnSim.classList.add('done');

        setTimeout(() => {
          btnSim.textContent = '+ 새 문서 드롭 및 실시간 벡터화 시뮬레이션';
          btnSim.classList.remove('done');
          btnSim.disabled = false;
        }, 3000);
      }, 1200);
    });
  }
}

// ──────────────────────────────────
// 4. Routing Simulator (FIG.2)
// ──────────────────────────────────
function initRoutingSimulator() {
  const btns = document.querySelectorAll('.btn-sample');
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeState = document.getElementById('gaugeState');
  const chatConv = document.getElementById('chatConv');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const score = parseInt(btn.getAttribute('data-score'), 10);
      const qText = btn.textContent.trim().split('—')[0].replace(/^Q\d\.\s*"?/, '').replace(/"?\s*$/, '');

      // Gauge
      if (gaugeFill) gaugeFill.style.width = score + '%';

      if (type === 'local') {
        if (gaugeState) {
          gaugeState.className = 'gauge-state text-emerald';
          gaugeState.textContent = `로컬 SLM 처리 (${score}%) — ₩0`;
        }
        renderChat(qText, 'local',
          '⚡ On-Device SLM 즉시 응답 (₩0 · 82ms)',
          '회의록(2025_08_budget.md)에서 로컬 RAG 검색 완료.<br/>' +
          '• AI 서버 인프라 예산: <strong>₩14,200,000</strong><br/>' +
          '• 외부 LLM API 절감 예상: 연 약 ₩18,000,000'
        );
      } else {
        if (gaugeState) {
          gaugeState.className = 'gauge-state text-gold';
          gaugeState.textContent = `클라우드 LLM 분기 (${score}%) — 제휴 상쇄`;
        }
        renderChat(qText, 'cloud',
          '☁️ Cloud LLM (GPT-4o) 분기 — 제휴 리베이트 ₩1,850 대납',
          '분산 아키텍처 알고리즘 검증을 클라우드 모델로 완료.<br/>' +
          '• 분산 합의 및 레이턴시 분석 생성 완료<br/>' +
          '• <strong>비용:</strong> 토큰비 ₩18은 제휴 캐시백에서 즉시 자동 상쇄'
        );
      }
    });
  });

  function renderChat(q, type, tag, answer) {
    if (!chatConv) return;
    const tagClass = type === 'local' ? 'local' : 'cloud';
    chatConv.innerHTML = `
      <div class="chat-bubble user">${q}</div>
      <div class="chat-bubble ai">
        <div class="routing-tag ${tagClass}">${tag}</div>
        <div>${answer}</div>
      </div>
    `;
  }
}

// ──────────────────────────────────
// 5. 4-Tab Modal
// ──────────────────────────────────
function initModal() {
  const modal = document.getElementById('summaryModal');
  if (!modal) return;

  const openers = [
    document.getElementById('openModal'),
    document.getElementById('openModalCTA')
  ];
  const closers = [
    document.getElementById('closeModal'),
    document.getElementById('closeModalBottom')
  ];

  const show = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const hide = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };

  openers.forEach(btn => { if (btn) btn.addEventListener('click', show); });
  closers.forEach(btn => { if (btn) btn.addEventListener('click', hide); });
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });

  // Tab switching
  const tabs = document.querySelectorAll('#modalTabs .modal-tab');
  const panels = document.querySelectorAll('.modal-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-panel');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
}

// ──────────────────────────────────
// 6. Mobile Menu
// ──────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const pills = document.querySelector('.nav-pills');
  if (toggle && pills) {
    toggle.addEventListener('click', () => {
      pills.style.display = pills.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}

// ──────────────────────────────────
// 7. Scroll Animations (stagger)
// ──────────────────────────────────
function initScrollAnimations() {
  const targets = document.querySelectorAll('.anim-target, .step-grid, .timeline, .settle-equation');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — let it stay visible
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.classList.add('anim-target');
    observer.observe(el);
  });
}
