(function () {
  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector("#site-nav");

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function () {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      siteNav.classList.toggle("is-open", !open);
    });

    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
      });
    });
  }

  function showCopyResult(button, success) {
    const original = button.dataset.copyOriginal || button.textContent;
    button.dataset.copyOriginal = original;
    window.clearTimeout(button.copyResetTimer);
    button.textContent = success ? "✓ Copied" : "Copy failed";
    button.classList.toggle("is-copied", success);
    button.setAttribute("aria-label", success ? "Copied" : "Copy failed");
    button.copyResetTimer = window.setTimeout(function () {
      button.textContent = original;
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", original);
    }, 1600);
  }

  document.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-copy-target], [data-copy-lab-link], [data-copy-lab-agent]");
    if (!button) {
      return;
    }

    let copyText = "";
    if (button.dataset.copyTarget) {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) {
        return;
      }
      copyText = target.innerText;
    } else {
      const lab = button.closest(".lab-detail");
      if (!lab || !lab.id) {
        return;
      }
      const labTitle = lab.querySelector("h3")?.textContent.trim() || "PowerShell Idea Lab";
      const labUrl = window.location.origin + window.location.pathname + "#" + lab.id;
      copyText = button.hasAttribute("data-copy-lab-agent")
        ? 'Read and understand this PowerShell 7 Idea Lab: "' + labTitle + '"\n' + labUrl + "\n\nHelp me extend, adapt, or automate it."
        : labUrl;
    }

    try {
      await navigator.clipboard.writeText(copyText);
      showCopyResult(button, true);
    } catch (error) {
      showCopyResult(button, false);
    }
  });

  const filterBar = document.querySelector(".lab-filters");
  const labGrid = document.querySelector(".lab-grid");

  if (filterBar && labGrid) {
    const searchInput = document.querySelector("#lab-search");
    const topicSelect = document.querySelector("#lab-topic-filter");
    const filterStatus = document.querySelector("#lab-filter-status");
    const cards = Array.from(labGrid.querySelectorAll(".lab-card"));
    const topics = Array.from(new Set(cards.flatMap(function (card) {
      return Array.from(card.querySelectorAll(".lab-tags span")).map(function (tag) {
        return tag.textContent.trim();
      });
    }))).sort(function (left, right) {
      return left.localeCompare(right);
    });

    topics.forEach(function (topic) {
      const option = document.createElement("option");
      option.value = topic.toLowerCase();
      option.textContent = topic;
      topicSelect.appendChild(option);
    });

    function applyFilters() {
      const query = (searchInput.value || "").trim().toLowerCase();
      const selectedTopic = topicSelect.value;
      let visible = 0;

      cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        const cardTopics = Array.from(card.querySelectorAll(".lab-tags span")).map(function (tag) {
          return tag.textContent.trim().toLowerCase();
        });
        const matchesQuery = !query || text.includes(query);
        const matchesTopic = !selectedTopic || cardTopics.includes(selectedTopic);
        const show = matchesQuery && matchesTopic;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      filterStatus.textContent = visible === cards.length
        ? "Showing all " + cards.length + " labs"
        : "Showing " + visible + " of " + cards.length + " labs";
    }

    searchInput.addEventListener("input", applyFilters);
    topicSelect.addEventListener("change", applyFilters);
    applyFilters();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const revealItems = document.querySelectorAll(".reveal");
  const revealAll = function () {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(function (item) { observer.observe(item); });
    // Keep the page readable even when a browser exposes a broken or delayed observer.
    window.setTimeout(revealAll, 500);
  } else {
    revealAll();
  }
})();