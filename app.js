(function () {
  "use strict";

  const API_BASE = "https://bored-api.appbrewery.com";

  const els = {
    type: document.getElementById("type"),
    participants: document.getElementById("participants"),
    price: document.getElementById("price"),
    kidFriendly: document.getElementById("kidFriendly"),
    suggestBtn: document.getElementById("suggestBtn"),
    randomBtn: document.getElementById("randomBtn"),
    result: document.getElementById("result"),
  };

  // --- Helpers ---------------------------------------------------------------

  function priceLabel(p) {
    if (p === 0) return "Free";
    if (p <= 0.3) return "Cheap";
    if (p <= 0.6) return "Moderate";
    return "Pricey";
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function setLoading(isLoading) {
    els.suggestBtn.disabled = isLoading;
    els.randomBtn.disabled = isLoading;
    if (isLoading) {
      els.result.innerHTML = '<div class="msg">Finding something fun…</div>';
    }
  }

  function showError(message) {
    els.result.innerHTML =
      '<div class="msg error">' + escapeHtml(message) + "</div>";
  }

  function showEmpty() {
    els.result.innerHTML =
      '<div class="msg">No activities matched those filters. Try loosening them. 🙂</div>';
  }

  // --- Rendering -------------------------------------------------------------

  function renderActivity(a) {
    const tags = [];
    if (a.type) {
      tags.push(
        '<span class="tag type">' + escapeHtml(capitalize(a.type)) + "</span>"
      );
    }
    tags.push(
      '<span class="tag">👥 <strong>' +
        escapeHtml(a.participants) +
        "</strong></span>"
    );
    if (typeof a.price === "number") {
      tags.push(
        '<span class="tag">💰 <strong>' +
          escapeHtml(priceLabel(a.price)) +
          "</strong></span>"
      );
    }
    if (a.duration) {
      tags.push(
        '<span class="tag">⏱️ <strong>' +
          escapeHtml(capitalize(a.duration)) +
          "</strong></span>"
      );
    }
    if (a.accessibility) {
      tags.push(
        '<span class="tag">♿ ' + escapeHtml(a.accessibility) + "</span>"
      );
    }
    if (a.kidFriendly) {
      tags.push('<span class="tag">🧒 Kid-friendly</span>');
    }

    let linkHtml = "";
    if (a.link) {
      linkHtml =
        '<p class="link">🔗 <a href="' +
        escapeHtml(a.link) +
        '" target="_blank" rel="noopener">Learn more</a></p>';
    }

    els.result.innerHTML =
      '<article class="card">' +
      "<h2>" +
      escapeHtml(a.activity) +
      "</h2>" +
      '<div class="tags">' +
      tags.join("") +
      "</div>" +
      linkHtml +
      "</article>";
  }

  // --- Data fetching ---------------------------------------------------------

  function buildFilterUrl() {
    const params = new URLSearchParams();
    if (els.type.value) params.set("type", els.type.value);
    if (els.participants.value) params.set("participants", els.participants.value);
    const query = params.toString();
    return API_BASE + "/filter" + (query ? "?" + query : "");
  }

  // Apply filters the API doesn't support directly (price, kidFriendly).
  function applyClientFilters(list) {
    const maxPrice = els.price.value === "" ? null : parseFloat(els.price.value);
    const kidOnly = els.kidFriendly.checked;

    return list.filter(function (a) {
      if (maxPrice !== null && typeof a.price === "number" && a.price > maxPrice) {
        return false;
      }
      if (kidOnly && !a.kidFriendly) {
        return false;
      }
      return true;
    });
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("The activity service returned an error (" + res.status + ").");
    }
    return res.json();
  }

  async function suggestFiltered() {
    setLoading(true);
    try {
      const data = await fetchJson(buildFilterUrl());
      const list = Array.isArray(data) ? data : [data];
      const filtered = applyClientFilters(list);

      if (!filtered.length) {
        showEmpty();
        return;
      }
      renderActivity(pickRandom(filtered));
    } catch (err) {
      showError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function suggestRandom() {
    setLoading(true);
    try {
      const data = await fetchJson(API_BASE + "/random");
      renderActivity(data);
    } catch (err) {
      showError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // --- Wire up ---------------------------------------------------------------

  els.suggestBtn.addEventListener("click", suggestFiltered);
  els.randomBtn.addEventListener("click", suggestRandom);

  // Give a first suggestion on load so the page isn't empty.
  suggestRandom();
})();
