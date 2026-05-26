(function () {
  const tools = window.TOOLS || [];
  const socialLinks = window.SOCIAL_LINKS || [];
  const grid = document.querySelector("#tool-grid");
  const rows = document.querySelector("#archive-rows");
  const tabs = document.querySelector("#category-tabs");
  const search = document.querySelector("#tool-search");
  const dialog = document.querySelector("#tool-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const closeDialogButton = document.querySelector(".dialog-close");
  const connectGrid = document.querySelector("#nav-social-links");
  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector("#site-nav");

  let activeCategory = "All";

  const categories = ["All", ...Array.from(new Set(tools.map((tool) => tool.category)))];
  const customIcons = {
    github: `
      <svg class="brand-svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
      </svg>
    `,
    "x-twitter": `<span class="brand-letter" aria-hidden="true">X</span>`,
    youtube: `<span class="brand-play" aria-hidden="true"></span>`,
    linkedin: `<span class="brand-letter brand-letter-small" aria-hidden="true">in</span>`
  };

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
  }

  function icon(name) {
    if (customIcons[name]) return customIcons[name];
    return `<i data-lucide="${name}" aria-hidden="true"></i>`;
  }

  function toolMatches(tool) {
    const term = search.value.trim().toLowerCase();
    const haystack = [
      tool.name,
      tool.category,
      tool.status,
      tool.oneLiner,
      tool.description,
      tool.language,
      ...(tool.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    return (activeCategory === "All" || tool.category === activeCategory) && haystack.includes(term);
  }

  function renderTabs() {
    tabs.innerHTML = categories
      .map(
        (category) => `
          <button
            class="tab-button${category === activeCategory ? " is-active" : ""}"
            type="button"
            role="tab"
            aria-selected="${category === activeCategory}"
            data-category="${category}"
          >
            ${category}
          </button>
        `
      )
      .join("");
  }

  function renderTools() {
    const visibleTools = tools.filter(toolMatches);

    grid.innerHTML = visibleTools
      .map(
        (tool) => `
          <article class="tool-card reveal" data-tool-card>
            <div class="tool-media">
              <img src="${tool.image}" alt="${tool.imageAlt}" loading="lazy" />
            </div>
            <div class="tool-card-body">
              <div class="tool-card-topline">
                <span class="tool-category">${tool.category}</span>
                <span class="tool-status">${tool.status}</span>
              </div>
              <h3>${tool.name}</h3>
              <p>${tool.oneLiner}</p>
              <div class="tag-row">
                ${tool.tags.map((tag) => `<span>${tag}</span>`).join("")}
              </div>
              <div class="metric-row" aria-label="${tool.name} GitHub metrics">
                <span>${icon("star")} ${formatNumber(tool.stars)}</span>
                <span>${icon("git-fork")} ${formatNumber(tool.forks)}</span>
                <span>${icon("code-2")} ${tool.language}</span>
              </div>
              <div class="card-actions">
                <a class="button compact" href="${tool.githubUrl}" target="_blank" rel="noreferrer">
                  ${icon("github")}
                  <span>Source</span>
                </a>
                ${
                  tool.youtubeUrl
                    ? `<a class="button compact" href="${tool.youtubeUrl}" target="_blank" rel="noreferrer">
                        ${icon("youtube")}
                        <span>Video</span>
                      </a>`
                    : ""
                }
                <button class="button compact secondary" type="button" data-open-tool="${tool.slug}">
                  ${icon("panel-right-open")}
                  <span>Details</span>
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    if (!visibleTools.length) {
      grid.innerHTML = `
        <div class="empty-state">
          ${icon("search-x")}
          <p>No tools match that filter yet.</p>
        </div>
      `;
    }

    refreshIcons();
    observeReveals();
  }

  function renderArchive() {
    rows.innerHTML = tools
      .map(
        (tool) => `
          <tr>
            <th scope="row">
              <span>${tool.name}</span>
              <small>${tool.oneLiner}</small>
            </th>
            <td>${tool.category}</td>
            <td>${tool.status}</td>
            <td>${formatNumber(tool.stars)}</td>
            <td>
              <div class="table-links">
                <a href="${tool.githubUrl}" target="_blank" rel="noreferrer">Source</a>
                ${tool.youtubeUrl ? `<a href="${tool.youtubeUrl}" target="_blank" rel="noreferrer">Video</a>` : ""}
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderConnectLinks() {
    if (!connectGrid) return;
    connectGrid.innerHTML = socialLinks
      .map(
        (link) => `
          <a class="nav-social-link" href="${link.url}" target="_blank" rel="noreferrer">
            ${icon(link.icon)}
            <span>
              <strong>${link.label}</strong>
            </span>
            ${icon("arrow-up-right")}
          </a>
        `
      )
      .join("");
  }

  function openTool(slug) {
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) return;

    dialogContent.innerHTML = `
      <div class="dialog-hero">
        <img src="${tool.image}" alt="${tool.imageAlt}" />
      </div>
      <div class="dialog-copy">
        <p class="eyebrow">${tool.category} / ${tool.status}</p>
        <h2>${tool.name}</h2>
        <p>${tool.description}</p>
        <div class="tag-row">
          ${tool.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        ${
          tool.installCommand
            ? `<div class="install-box">
                <span>${icon("terminal")}</span>
                <code>${tool.installCommand}</code>
              </div>`
            : ""
        }
        <div class="dialog-actions">
          <a class="button primary" href="${tool.githubUrl}" target="_blank" rel="noreferrer">
            ${icon("github")}
            <span>GitHub</span>
          </a>
          ${
            tool.youtubeUrl
              ? `<a class="button secondary" href="${tool.youtubeUrl}" target="_blank" rel="noreferrer">
                  ${icon("youtube")}
                  <span>YouTube</span>
                </a>`
              : ""
          }
          ${
            tool.demoUrl
              ? `<a class="button secondary" href="${tool.demoUrl}" target="_blank" rel="noreferrer">
                  ${icon("external-link")}
                  <span>Package</span>
                </a>`
              : ""
          }
          ${
            tool.articleUrl
              ? `<a class="button secondary" href="${tool.articleUrl}" target="_blank" rel="noreferrer">
                  ${icon("book-open")}
                  <span>Notes</span>
                </a>`
              : ""
          }
        </div>
      </div>
    `;

    dialog.showModal();
    refreshIcons();
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    document.querySelectorAll("i[data-lucide]").forEach((item) => {
      const fallback = document.createElement("span");
      fallback.className = "icon-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.textContent = "•";
      item.replaceWith(fallback);
    });
  }

  function observeReveals() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => observer.observe(item));
  }

  function setMobileMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
  }

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderTabs();
    renderTools();
  });

  search.addEventListener("input", renderTools);

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-tool]");
    if (!button) return;
    openTool(button.dataset.openTool);
  });

  closeDialogButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog();
  });

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    setMobileMenu(!expanded);
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });

  renderTabs();
  renderTools();
  renderArchive();
  renderConnectLinks();
  refreshIcons();
  observeReveals();
})();
