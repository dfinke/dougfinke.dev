(() => {
  "use strict";

  const pages = [
    { words: "Hello, Enzo! Look at this tree.", scene: "A friendly tree waits on a sunny hill." },
    { words: "Here is one little leaf.", scene: "One small green leaf grows on the tree." },
    { words: "Here is another leaf.", scene: "A green leaf and a golden leaf grow together." },
    { words: "Every leaf is different.", scene: "The tree has leaves of many happy colors." },
    { words: "Every leaf shares the tree.", scene: "All the colorful leaves sway together on one tree." },
    { words: "You are you.", scene: "Enzo stands proudly beside the colorful tree." },
    { words: "I am me.", scene: "Enzo sees a special glowing leaf among all the others." },
    { words: "We share one wonderful world.", prompt: "Can you find the leaf that looks like you?", scene: "Enzo, the leaves, the tree, and the sunshine share one wonderful world." }
  ];

  const book = document.querySelector(".book");
  const stage = document.querySelector(".story-stage");
  const words = document.querySelector(".story-words");
  const prompt = document.querySelector(".story-prompt");
  const sceneDescription = document.querySelector("#scene-description");
  const progress = document.querySelector(".progress");
  const previousButton = document.querySelector(".previous-button");
  const nextButton = document.querySelector(".next-button");
  const restartButton = document.querySelector(".restart-button");
  const speakButton = document.querySelector(".speak-button");
  const leaves = [...document.querySelectorAll(".leaf")];
  const speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let currentPage = 0;
  let pointerStart = null;
  let changing = false;

  pages.forEach((page, index) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    dot.setAttribute("aria-label", `Page ${index + 1} of ${pages.length}`);
    progress.append(dot);
  });

  const dots = [...progress.children];

  function stopSpeaking() {
    if (speechSupported) window.speechSynthesis.cancel();
    speakButton.classList.remove("speaking");
  }

  function render(direction = 0) {
    const page = pages[currentPage];
    stopSpeaking();
    book.className = `book page-${currentPage} page-changing`;
    words.textContent = page.words;
    prompt.textContent = page.prompt || "";
    sceneDescription.textContent = page.scene;
    previousButton.hidden = currentPage === 0;
    nextButton.querySelector(".nav-label").textContent = currentPage === pages.length - 1 ? "Again" : "Next";
    nextButton.setAttribute("aria-label", currentPage === pages.length - 1 ? "Read the story again" : "Next page");
    dots.forEach((dot, index) => {
      dot.classList.toggle("current", index === currentPage);
      dot.setAttribute("aria-current", index === currentPage ? "page" : "false");
    });
    window.clearTimeout(render.animationTimer);
    render.animationTimer = window.setTimeout(() => book.classList.remove("page-changing"), 380);
    changing = true;
    window.setTimeout(() => { changing = false; }, direction ? 240 : 100);
  }

  function goNext() {
    if (changing) return;
    currentPage = currentPage === pages.length - 1 ? 0 : currentPage + 1;
    render(1);
  }

  function goPrevious() {
    if (changing || currentPage === 0) return;
    currentPage -= 1;
    render(-1);
  }

  function speakPage() {
    if (!speechSupported) return;
    stopSpeaking();
    const page = pages[currentPage];
    const utterance = new SpeechSynthesisUtterance([page.words, page.prompt].filter(Boolean).join(" "));
    utterance.rate = 0.82;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    utterance.onstart = () => speakButton.classList.add("speaking");
    utterance.onend = utterance.onerror = () => speakButton.classList.remove("speaking");
    window.speechSynthesis.speak(utterance);
  }

  function wiggleLeaf(leaf) {
    leaf.classList.remove("wiggle");
    requestAnimationFrame(() => requestAnimationFrame(() => leaf.classList.add("wiggle")));
    window.setTimeout(() => leaf.classList.remove("wiggle"), 950);
  }

  stage.addEventListener("pointerdown", event => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", event => {
    if (event.target.closest(".leaf")) return;
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? goNext() : goPrevious();
    } else if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
      goNext();
    }
  });

  stage.addEventListener("pointercancel", () => { pointerStart = null; });
  previousButton.addEventListener("click", goPrevious);
  nextButton.addEventListener("click", goNext);
  restartButton.addEventListener("click", () => { currentPage = 0; render(-1); });
  speakButton.addEventListener("click", speakPage);

  leaves.forEach(leaf => {
    leaf.addEventListener("pointerup", event => {
      event.stopPropagation();
      wiggleLeaf(leaf);
    });
    leaf.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        wiggleLeaf(leaf);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "PageDown") goNext();
    if (event.key === "ArrowLeft" || event.key === "PageUp") goPrevious();
    if (event.key.toLowerCase() === "r") speakPage();
  });

  if (!speechSupported) {
    speakButton.hidden = true;
    progress.style.gridColumn = "2 / 4";
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSpeaking();
  });

  render();
})();
