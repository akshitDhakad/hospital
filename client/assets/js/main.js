"use strict";

(function initSiteFeatures() {
  const inPagesDirectory = /\/pages\//.test(window.location.pathname);
  const basePrefix = inPagesDirectory ? "../" : "./";

  const searchablePages = [
    { href: `${basePrefix}index.html`, label: "Home" },
    { href: `${basePrefix}pages/about.html`, label: "About Us" },
    { href: `${basePrefix}pages/services.html`, label: "Services" },
    { href: `${basePrefix}pages/facilities.html`, label: "Facilities" },
    { href: `${basePrefix}pages/doctor.html`, label: "Doctor" },
    { href: `${basePrefix}pages/contact.html`, label: "Contact Us" }
  ];

  let pageIndex = [];
  let indexReady = false;

  function createSearchModal() {
    const existingModal = document.getElementById("site-search-modal");
    if (existingModal) {
      return existingModal;
    }

    const modal = document.createElement("div");
    modal.id = "site-search-modal";
    modal.className = "search-modal";
    modal.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
        <div class="search-head">
          <input id="site-search-input" type="search" placeholder="Search full website content..." aria-label="Search website content" />
          <button type="button" class="search-close" id="site-search-close">Close</button>
        </div>
        <div class="search-results" id="site-search-results">
          <div class="search-item"><strong id="site-search-title">Website Search</strong><p>Type at least 2 characters to search pages and sections.</p></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  async function buildSearchIndex() {
    if (indexReady) {
      return;
    }

    const parser = new DOMParser();
    const items = [];

    for (const page of searchablePages) {
      try {
        const response = await fetch(page.href, { cache: "no-store" });
        if (!response.ok) {
          continue;
        }
        const html = await response.text();
        const doc = parser.parseFromString(html, "text/html");
        const title = (doc.querySelector("title")?.textContent || page.label).trim();
        const bodyText = (doc.body?.textContent || "").replace(/\s+/g, " ").trim();
        items.push({
          href: page.href,
          label: page.label,
          title,
          bodyText
        });
      } catch (_error) {
        // keep search resilient even when a page cannot be fetched
      }
    }

    pageIndex = items;
    indexReady = true;
  }

  function renderSearchResults(query) {
    const resultsNode = document.getElementById("site-search-results");
    if (!resultsNode) {
      return;
    }

    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      resultsNode.innerHTML =
        '<div class="search-item"><strong>Keep typing</strong><p>Enter at least 2 characters.</p></div>';
      return;
    }

    const matches = pageIndex
      .map((page) => {
        const index = page.bodyText.toLowerCase().indexOf(normalized);
        return { page, index };
      })
      .filter((item) => item.index >= 0)
      .slice(0, 8);

    if (!matches.length) {
      resultsNode.innerHTML =
        '<div class="search-item"><strong>No results found</strong><p>Try another keyword.</p></div>';
      return;
    }

    resultsNode.innerHTML = matches
      .map(({ page, index }) => {
        const start = Math.max(index - 80, 0);
        const end = Math.min(index + 140, page.bodyText.length);
        const snippet = `${page.bodyText.slice(start, end)}...`;
        return `
          <a class="search-item" href="${page.href}">
            <strong>${page.title}</strong>
            <p>${snippet}</p>
          </a>
        `;
      })
      .join("");
  }

  async function setupSearch() {
    const toggleButtons = Array.from(document.querySelectorAll(".nav-search"));
    if (!toggleButtons.length) {
      return;
    }

    const modal = createSearchModal();
    const input = document.getElementById("site-search-input");
    const closeButton = document.getElementById("site-search-close");

    async function openSearch() {
      modal.classList.add("open");
      await buildSearchIndex();
      if (input) {
        input.value = "";
        input.focus();
      }
      renderSearchResults("");
    }

    function closeSearch() {
      modal.classList.remove("open");
    }

    toggleButtons.forEach((button) => {
      button.addEventListener("click", openSearch);
    });

    closeButton?.addEventListener("click", closeSearch);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeSearch();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    });
    input?.addEventListener("input", (event) => {
      renderSearchResults(event.target.value);
    });
  }

  function setupAppointmentForm() {
    const form = document.getElementById("appointment-form-el");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const email = form.getAttribute("data-email") || "info@jyotihospital.in";
      const subject = encodeURIComponent("Appointment Request - Jyoti Hospital");
      const body = encodeURIComponent(
        [
          `Name: ${formData.get("name") || ""}`,
          `Phone: ${formData.get("phone") || ""}`,
          `Email: ${formData.get("email") || ""}`,
          `Preferred Date: ${formData.get("date") || ""}`,
          "",
          "Concern / Notes:",
          `${formData.get("message") || ""}`
        ].join("\n")
      );

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  }

  setupSearch();
  setupAppointmentForm();
})();
