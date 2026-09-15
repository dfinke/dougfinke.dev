(function () {
  const menuButton=document.querySelector(".menu-button");
  const siteNav=document.querySelector("#site-nav");
  if(menuButton && siteNav){
    menuButton.addEventListener("click",function(){
      const open=menuButton.getAttribute("aria-expanded")==="true";
      menuButton.setAttribute("aria-expanded",String(!open));
      siteNav.classList.toggle("is-open",!open);
    });
    document.querySelectorAll("[data-nav-link]").forEach(link=>link.addEventListener("click",()=>{menuButton.setAttribute("aria-expanded","false");siteNav.classList.remove("is-open");}));
  }
  document.addEventListener("click",async function(event){
    const button=event.target.closest("[data-copy-target]");
    if(!button)return;
    const target=document.getElementById(button.dataset.copyTarget);
    if(!target)return;
    const original=button.textContent;
    try{await navigator.clipboard.writeText(target.innerText);button.textContent="Copied";}catch(error){button.textContent="Select manually";}
    window.setTimeout(()=>{button.textContent=original;},1400);
  });
  if(window.lucide){window.lucide.createIcons();}
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(function(item) { observer.observe(item); });
  } else {
    revealItems.forEach(function(item) { item.classList.add("is-visible"); });
  }
})();
