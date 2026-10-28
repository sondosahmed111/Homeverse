document.addEventListener('DOMContentLoaded', function () {
  const save = d => localStorage.setItem('hv_user', JSON.stringify(d));
  const load = () => { try { return JSON.parse(localStorage.getItem('hv_user')); } catch(e){ return null; } };
  const loggedIn = () => !!load();
  const logout = () => { localStorage.removeItem('hv_user'); location.href = 'index.html'; };

  const page = {
    isIndex:   !!document.querySelector('.hero'),
    isLogin:   !!document.querySelector('.auth-forms'),
    isProps:   !!document.querySelector('.allprop-grid'),
    isDetails: !!document.getElementById('mainImage'),
    isProfile: !!document.getElementById('profileFullName'),
  };

  // Header scroll
  const hdr = document.querySelector('.header,.allprop-header,.login-header,.pd-header');
  if (hdr) {
    const tick = () => hdr.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // INDEX PAGE
  if (page.isIndex) {
    const btn = document.getElementById('navLoginBtn');
    if (btn) {
      const u = load();
      if (u) { btn.innerHTML = '<i class="fas fa-user-circle"></i> ' + u.firstName; btn.href = 'profile.html'; }
      else btn.href = 'login-style.html';
    }

    // Hamburger
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    if (ham && menu) {
      const closeMenu = () => {
        ham.classList.remove('active');
        menu.classList.remove('active');
        ham.setAttribute('aria-expanded', 'false');
      };
      ham.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        ham.classList.toggle('active', isOpen);
        ham.setAttribute('aria-expanded', String(isOpen));
      });
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });
    }

    // Search tabs
    document.querySelectorAll('.stab').forEach(btn => {
      btn.addEventListener('click', () => { document.querySelectorAll('.stab').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
    });

    // Featured filter
    const pfBtns = document.querySelectorAll('.pf-btn');
    const pcards = document.querySelectorAll('#featuredGrid .property-card');
    pfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        pcards.forEach((c,i) => {
          const show = f === 'all' || c.dataset.cat === f;
          c.style.opacity = '0'; c.style.transform = 'translateY(20px)';
          c.style.display = show ? '' : 'none';
          if (show) setTimeout(() => { c.style.transition = 'opacity .4s ease,transform .4s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 60);
        });
      });
    });

    // Save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        btn.classList.toggle('saved');
        btn.innerHTML = btn.classList.contains('saved') ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
      });
    });

    // Counter animation
    const nums = document.querySelectorAll('.num-val');
    if (nums.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const el = en.target; const target = +el.dataset.target; let cur = 0;
            const step = target / 60;
            const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = Math.floor(cur); if (cur >= target) clearInterval(t); }, 25);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      nums.forEach(n => obs.observe(n));
    }

    // Contact form
    const cf = document.getElementById('contactFormMain');
    if (cf) {
      cf.addEventListener('submit', e => {
        e.preventDefault();
        const b = cf.querySelector('.btn-primary'); const o = b.innerHTML;
        b.innerHTML = '<i class="fas fa-check"></i> Sent!'; b.style.background = 'var(--em-d)';
        setTimeout(() => { b.innerHTML = o; b.style.background = ''; cf.reset(); }, 2500);
      });
    }

    // Scroll reveal
    const rev = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'translateY(0)'; rev.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.property-card,.svc-card,.testi-card,.why-item,.loc-card,.af-item').forEach(el => {
      el.style.cssText += 'opacity:0;transform:translateY(26px);transition:opacity .55s ease,transform .55s ease';
      rev.observe(el);
    });
  }

  // ALL PROPERTIES
  if (page.isProps) {
    const grid = document.querySelector('.allprop-grid');
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.allprop-card');
    if (filters.length) {
      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          filters.forEach(b => b.classList.remove('active')); btn.classList.add('active');
          const type = btn.dataset.type;
          cards.forEach(c => { const show = type === 'all' || c.dataset.type === type; c.style.display = show ? '' : 'none'; if (show) { c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; } });
          requestAnimationFrame(() => { let i = 0; cards.forEach(c => { if (c.style.display !== 'none') { setTimeout(() => { c.style.transition = 'opacity .4s ease,transform .4s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i++ * 75); } }); });
        });
      });
    }
    document.querySelectorAll('.action-btn.share').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); navigator.clipboard && navigator.clipboard.writeText(location.href).then(() => { btn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-share"></i>'; }, 1500); }); });
    });
    if (grid) setTimeout(() => grid.classList.add('active'), 80);
  }

  // LOGIN PAGE
  if (page.isLogin) {
    if (loggedIn()) { location.href = 'profile.html'; return; }
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
      });
    });
    const lf = document.getElementById('loginFormInner');
    if (lf) {
      const sub = lf.querySelector('.submit-btn');
      const con = document.getElementById('loginForm');
      lf.addEventListener('submit', e => {
        e.preventDefault();
        const ph = document.getElementById('loginPhone').value.trim();
        const pw = document.getElementById('loginPassword').value.trim();
        if (!ph || !pw) return err(con, 'Please fill in all fields.');
        const stored = localStorage.getItem('hv_reg_' + ph);
        if (!stored) return err(con, 'Phone not registered. Create an account first.');
        if (JSON.parse(stored).password !== pw) return err(con, 'Incorrect password.');
        sub.classList.add('loading');
        setTimeout(() => { sub.classList.remove('loading'); sub.querySelector('span').textContent = '✓ Logged In!'; save(JSON.parse(stored)); setTimeout(() => location.href = 'profile.html', 700); }, 1100);
      });
    }
    const rf = document.getElementById('registerFormInner');
    if (rf) {
      const sub = rf.querySelector('.submit-btn');
      const con = document.getElementById('registerForm');
      rf.addEventListener('submit', e => {
        e.preventDefault();
        const fn = document.getElementById('firstName').value.trim();
        const ln = document.getElementById('lastName').value.trim();
        const ph = document.getElementById('registerPhone').value.trim();
        const em = document.getElementById('email').value.trim();
        const pw = document.getElementById('registerPassword').value.trim();
        const cpw = document.getElementById('confirmPassword').value.trim();
        if (!fn||!ln||!ph||!pw) return err(con, 'Please fill in all required fields.');
        if (pw !== cpw) return err(con, 'Passwords do not match.');
        if (pw.length < 6) return err(con, 'Password must be at least 6 characters.');
        if (localStorage.getItem('hv_reg_' + ph)) return err(con, 'Phone already registered. Please login.');
        const data = { firstName:fn, lastName:ln, phone:ph, email:em, password:pw, joinDate: new Date().toLocaleDateString('en-GB',{year:'numeric',month:'long',day:'numeric'}) };
        sub.classList.add('loading');
        setTimeout(() => { sub.classList.remove('loading'); localStorage.setItem('hv_reg_' + ph, JSON.stringify(data)); save(data); sub.querySelector('span').textContent = '✓ Welcome!'; setTimeout(() => location.href = 'profile.html', 700); }, 1100);
      });
    }
    document.querySelectorAll('.input-wrapper input').forEach(inp => {
      inp.addEventListener('focus', () => inp.parentElement.style.transform = 'scale(1.015)');
      inp.addEventListener('blur', () => inp.parentElement.style.transform = '');
    });
    const gBtn = document.querySelector('.social-btn.google');
    if (gBtn) gBtn.addEventListener('click', () => alert('Redirecting to Google...'));
    const fp = document.querySelector('.forgot-password a');
    if (fp) fp.addEventListener('click', e => { e.preventDefault(); alert('Password reset link sent to your email.'); });
  }

  // PROPERTY DETAILS
  if (page.isDetails) {
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) shareBtn.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(location.href).then(() => { shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'; setTimeout(() => { shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share'; }, 1500); }); });
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('contactBtn');
    const closeBtn = document.querySelector('.pd-close-modal');
    const mForm = modal ? modal.querySelector('.pd-contact-form') : null;
    if (modal && openBtn) {
      openBtn.addEventListener('click', () => { modal.classList.add('active'); document.body.style.overflow = 'hidden'; });
      if (closeBtn) closeBtn.addEventListener('click', close);
      modal.addEventListener('click', e => { if (e.target === modal) close(); });
      if (mForm) mForm.addEventListener('submit', e => { e.preventDefault(); const b = mForm.querySelector('.pd-btn-primary'); b.textContent = '✓ Request Sent!'; b.style.background = 'var(--em-d)'; setTimeout(() => { b.textContent = 'Send Request'; b.style.background = ''; close(); mForm.reset(); }, 2000); });
    }
    function close() { if(modal){ modal.classList.remove('active'); document.body.style.overflow = ''; } }
  }

  // PROFILE
  if (page.isProfile) {
    if (!loggedIn()) { location.href = 'login-style.html'; return; }
    const u = load();
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    const nameEl = document.getElementById('profileFullName');
    if (nameEl) nameEl.innerHTML = u.firstName + ' <span>' + u.lastName + '</span>';
    set('profileFirstName', u.firstName);
    set('profileLastName', u.lastName);
    set('profilePhone', u.phone);
    set('profileEmail', u.email || 'Not provided');
    set('profileJoinDate', u.joinDate || '-');
    set('profileJoinDate2', u.joinDate || '-');
    const statNums = document.querySelectorAll('.prof-stat-num');
    if (statNums[3]) statNums[3].textContent = u.joinDate ? u.joinDate.split(' ')[2] || u.joinDate : '-';
    const lb = document.getElementById('logoutBtn');
    if (lb) lb.addEventListener('click', logout);
  }

  function err(form, msg) {
    form.querySelectorAll('.form-err').forEach(e => e.remove());
    const d = document.createElement('div');
    d.className = 'form-err';
    d.style.cssText = 'background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#fca5a5;padding:10px 16px;border-radius:10px;font-size:.87rem;margin-bottom:1rem;text-align:center';
    d.textContent = msg;
    form.insertBefore(d, form.firstChild);
    setTimeout(() => d.remove(), 4000);
  }
});
