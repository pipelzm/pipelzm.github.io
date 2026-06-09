(function () {
  const CONFIG = window.SITE_CONFIG || {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function formatTopTime(date = new Date()) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  }

  function startTopClock() {
    const el = $('#live-time');
    if (!el) return;
    const update = () => { el.textContent = formatTopTime(); };
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
    const list = $('#world-clock-list');
    if (!list) return;

    const cities = CONFIG.cityTimes || [];

    function updateCityTimes() {
      const now = new Date();
      list.innerHTML = cities.map((item) => {
        const time = new Intl.DateTimeFormat('en-GB', {
          timeZone: item.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);

        const label = item.country ? `${item.country} · ${item.tz.replace('_', ' ')}` : item.tz.replace('_', ' ');
        return `
          <li>
            <span>${item.city}<small>${label}</small></span>
            <time datetime="${now.toISOString()}">${time}</time>
          </li>`;
      }).join('');
    }

    updateCityTimes();
    setInterval(updateCityTimes, 1000);
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
        // If the status endpoint fails, keep the static embed.
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
