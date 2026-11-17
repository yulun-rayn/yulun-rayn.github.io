// Page behavior: light/dark toggle, rotating headshot, last-updated date.
// The initial theme is applied by a one-line inline script in <head> to avoid a flash.

(function () {
  // ---- Light / dark toggle (light is the default) ----
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (toggle) {
      const next = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", "Switch to " + next + " mode");
      toggle.title = "Switch to " + next + " mode";
    }
  }

  if (toggle) {
    setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    toggle.addEventListener("click", function () {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  // ---- Headshot: random on first visit, then alternate ----
  const headshot = document.getElementById("headshot");
  if (headshot) {
    const images = ["IMG3186.jpg", "IMG3200.jpg"];
    const storageKey = "lastImageIndex";
    const lastIndex = localStorage.getItem(storageKey);
    const nextIndex = lastIndex === null
      ? Math.floor(Math.random() * images.length)
      : (parseInt(lastIndex, 10) + 1) % images.length;
    headshot.src = images[nextIndex];
    localStorage.setItem(storageKey, nextIndex);
  }

  // ---- Last updated: date of the latest commit, falling back to the hardcoded text ----
  const updated = document.getElementById("last-updated");
  if (updated) {
    const render = function (iso) {
      updated.dateTime = iso;
      updated.textContent = new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
    };
    const cached = sessionStorage.getItem("lastUpdated");
    if (cached) {
      render(cached);
    } else {
      fetch("https://api.github.com/repos/yulun-rayn/yulun-rayn.github.io/commits?per_page=1")
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (commits) {
          const iso = commits[0].commit.committer.date;
          sessionStorage.setItem("lastUpdated", iso);
          render(iso);
        })
        .catch(function () { /* keep fallback text */ });
    }
  }
})();
