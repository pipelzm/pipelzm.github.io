/* =========================================================
   site.js — dynamic widgets for @pipelzm's website
   ========================================================= */

(function () {
  "use strict";

  /* ---- EDIT THESE: your personal config ------------------ */
  const CONFIG = {
    githubUser: "pipelzm",
    email: "felipe.lizama@example.com", // <-- cambia por tu correo real
    // World cities shown in the mini map (label, IANA timezone, x%, y% on map)
    cities: [
      { name: "Santiago", tz: "America/Santiago", x: 31, y: 80 },
      { name: "Tokyo", tz: "Asia/Tokyo", x: 84, y: 41 },
      { name: "London", tz: "Europe/London", x: 49, y: 31 },
      { name: "New York", tz: "America/New_York", x: 27, y: 38 }
    ]
  };
  /* -------------------------------------------------------- */

  // ---------- Top status-bar clock ----------
  function startTopClock() {
    const el = document.querySelector("[data-clock]");
    if (!el) return;
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      el.textContent = h + ":" + m + " " + ampm;
    };
    tick();
    setInterval(tick, 1000 * 15);
  }

  // ---------- World clock list ----------
  function startWorldClock() {
    const list = document.querySelector("[data-clocklist]");
    if (!list) return;

    list.innerHTML = "";
    const rows = CONFIG.cities.map((c) => {
      const li = document.createElement("li");
      const city = document.createElement("span");
      city.className = "city";
      city.textContent = c.name;
      const time = document.createElement("span");
      time.className = "time";
      time.dataset.tz = c.tz;
      li.appendChild(city);
      li.appendChild(time);
      list.appendChild(li);
      return time;
    });

    const fmt = (tz) =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: tz
      }).format(new Date());

    const tick = () => rows.forEach((t) => (t.textContent = fmt(t.dataset.tz)));
    tick();
    setInterval(tick, 1000 * 20);
  }

  // ---------- Mini world map dots ----------
  function placeMapDots() {
    const svg = document.querySelector("svg.worldmap");
    if (!svg) return;
    const layer = svg.querySelector("[data-dots]");
    if (!layer) return;
    const vbW = 100;
    const vbH = 56;
    CONFIG.cities.forEach((c) => {
      const cx = (c.x / 100) * vbW;
      const cy = (c.y / 100) * vbH;
      const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      halo.setAttribute("cx", cx);
      halo.setAttribute("cy", cy);
      halo.setAttribute("r", 1.8);
      halo.setAttribute("class", "dot-pulse");
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
      dot.setAttribute("r", 0.9);
      dot.setAttribute("class", "dot");
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = c.name;
      dot.appendChild(title);
      layer.appendChild(halo);
      layer.appendChild(dot);
    });
  }

  // ---------- GitHub repos ----------
  function loadRepos() {
    const list = document.querySelector("[data-repos]");
    if (!list) return;
    const url =
      "https://api.github.com/users/" +
      encodeURIComponent(CONFIG.githubUser) +
      "/repos?sort=updated&per_page=5";

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("GitHub " + r.status);
        return r.json();
      })
      .then((repos) => {
        if (!Array.isArray(repos) || repos.length === 0) {
          list.innerHTML = '<li class="repos-loading">No public repos yet.</li>';
          return;
        }
        list.innerHTML = "";
        repos.forEach((repo) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = repo.html_url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = repo.name;
          li.appendChild(a);
          if (repo.description) {
            const d = document.createElement("div");
            d.className = "repo-desc";
            d.textContent = repo.description;
            li.appendChild(d);
          }
          const meta = document.createElement("div");
          meta.className = "repo-meta";
          const lang = repo.language ? repo.language + " · " : "";
          meta.textContent = lang + "★ " + repo.stargazers_count;
          li.appendChild(meta);
          list.appendChild(li);
        });
      })
      .catch(() => {
        list.innerHTML =
          '<li class="repos-loading">Ver repos en ' +
          '<a href="https://github.com/' +
          CONFIG.githubUser +
          '" target="_blank" rel="noopener">github.com/' +
          CONFIG.githubUser +
          "</a></li>";
      });
  }

  // ---------- Quick feedback -> mailto ----------
  function wireFeedback() {
    const form = document.querySelector("form.quickfb");
    if (!form) return;
    // set mailto links across the page
    document.querySelectorAll("[data-mailto]").forEach((a) => {
      a.href = "mailto:" + CONFIG.email;
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector("input");
      const msg = (input.value || "").trim();
      const subject = encodeURIComponent("Feedback from website");
      const body = encodeURIComponent(msg || "");
      window.location.href =
        "mailto:" + CONFIG.email + "?subject=" + subject + "&body=" + body;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    startTopClock();
    startWorldClock();
    placeMapDots();
    loadRepos();
    wireFeedback();
  });
})();
