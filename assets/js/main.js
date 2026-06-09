(function () {
  const CONFIG = window.SITE_CONFIG || {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function formatTime(date = new Date(), options = {}) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    }).format(date);
  }

  function startTopClock() {
    const el = $('#live-time');
    if (!el) return;
    const update = () => { el.textContent = formatTime(); };
    update();
    setInterval(update, 1000);
  }

  function setActiveNav() {
    const page = document.body.dataset.page;
    $$('.nav-link').forEach(link => {
      if (link.dataset.page === page) link.classList.add('active');
    });
  }

  function renderWorldClock() {
    const map = $('#world-map');
    const list = $('#world-clock-list');
    if (!map || !list) return;

    const cities = CONFIG.cityTimes || [];

    map.innerHTML = `
      <svg class="map-art" viewBox="0 0 300 150" role="img" aria-label="Mini world map">
        <rect x="1" y="1" width="298" height="148" rx="0" />
        <path d="M34 48 L60 34 L92 40 L104 57 L86 70 L58 66 Z" />
        <path d="M84 75 L103 85 L100 112 L87 134 L73 106 Z" />
        <path d="M138 39 L162 28 L193 36 L207 54 L190 68 L157 63 L140 52 Z" />
        <path d="M171 69 L191 76 L199 103 L185 127 L166 111 L160 86 Z" />
        <path d="M211 44 L239 38 L267 53 L258 75 L229 69 Z" />
        <path d="M229 94 L252 88 L278 105 L263 124 L232 116 Z" />
        <path d="M1 75 H299 M150 1 V149 M75 1 V149 M225 1 V149" class="map-grid" />
      </svg>`;

    cities.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.className = 'city-dot';
      dot.type = 'button';
      dot.style.left = `${item.x}%`;
      dot.style.top = `${item.y}%`;
      dot.dataset.tz = item.tz;
      dot.dataset.city = item.city;
      dot.setAttribute('aria-label', `${item.city} local time`);
      map.appendChild(dot);
    });

    function updateCityTimes() {
      list.innerHTML = '';
      const now = new Date();
      cities.forEach((item) => {
        const time = new Intl.DateTimeFormat('en-US', {
          timeZone: item.tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);

        const row = document.createElement('li');
        row.innerHTML = `<span>${item.city}</span><b>${time}</b>`;
        list.appendChild(row);
      });

      $$('.city-dot').forEach(dot => {
        const city = cities.find(c => c.city === dot.dataset.city);
        if (!city) return;
        const time = new Intl.DateTimeFormat('en-US', {
          timeZone: city.tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);
        dot.title = `${city.city}: ${time}`;
      });
    }

    updateCityTimes();
    setInterval(updateCityTimes, 30 * 1000);
  }

  async function renderGithubRepos() {
    const box = $('#repo-list');
    const status = $('#repo-status');
    if (!box) return;

    const user = CONFIG.githubUser || 'pipelzm';
    const fallback = [
      { name: 'KRASG12D_7RPZ', html_url: '#', description: 'Docking, consensus ranking and MD notes.', language: 'Python' },
      { name: 'pipelzm.github.io', html_url: '#', description: 'Personal website, retro interface.', language: 'HTML' },
      { name: 'bioinfo-notes', html_url: '#', description: 'Small scripts and research utilities.', language: 'R' }
    ];

    function paint(repos, isFallback = false) {
      box.innerHTML = repos.slice(0, 4).map(repo => `
        <a class="repo-item" href="${repo.html_url}" target="_blank" rel="noopener">
          <span class="repo-name">${repo.name}</span>
          <span class="repo-desc">${repo.description || 'No description yet.'}</span>
          <span class="repo-meta">${repo.language || 'repo'} · updated</span>
        </a>
      `).join('');

      if (status) {
        status.textContent = isFallback ? 'local fallback' : `github.com/${user}`;
      }
    }

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=4`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error('GitHub API unavailable');
      const data = await res.json();
      paint(data.length ? data : fallback, data.length === 0);
    } catch (err) {
      paint(fallback, true);
    }
  }

  async function renderSpotify() {
    const wrap = $('#spotify-frame-wrap');
    const label = $('#spotify-track-label');
    if (!wrap) return;

    let embedUrl = CONFIG.spotifyEmbedUrl;
    let title = 'Spotify widget';

    if (CONFIG.spotifyStatusEndpoint) {
      try {
        const res = await fetch(CONFIG.spotifyStatusEndpoint, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          embedUrl = data.embedUrl || embedUrl;
          title = data.title && data.artist ? `${data.title} — ${data.artist}` : title;
        }
      } catch (err) {
        // Silencioso: vuelve al embed estático.
      }
    }

    if (label) label.textContent = title;

    if (!embedUrl) {
      wrap.innerHTML = '<p class="mini-muted">Add a Spotify embed URL in assets/js/config.js</p>';
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.title = 'Spotify embed';
    iframe.src = embedUrl;
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    wrap.innerHTML = '';
    wrap.appendChild(iframe);
  }

  function setupFeedback() {
    const form = $('#quick-feedback-form');
    const input = $('#quick-feedback-input');
    if (!form || !input) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      const subject = encodeURIComponent('Quick feedback from personal website');
      const body = encodeURIComponent(text || 'Hi Felipe, I wanted to send feedback about your website.');
      window.location.href = `mailto:${CONFIG.feedbackEmail}?subject=${subject}&body=${body}`;
    });
  }

  function setupFooterLinks() {
    const map = CONFIG.socials || {};
    Object.entries(map).forEach(([key, url]) => {
      const el = $(`[data-social="${key}"]`);
      if (el && url) el.href = url;
    });
  }

  function setupMobileNav() {
    const button = $('#nav-toggle');
    const nav = $('#main-nav');
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    startTopClock();
    setActiveNav();
    renderWorldClock();
    renderGithubRepos();
    renderSpotify();
    setupFeedback();
    setupFooterLinks();
    setupMobileNav();
  });
})();
