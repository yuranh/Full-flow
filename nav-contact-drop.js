/* Transforma o link "Contacto" do menu principal num dropdown */
(function () {
  function init() {
    var nav = document.querySelector(".main-nav");
    if (!nav) return;
    var links = Array.from(nav.querySelectorAll(':scope > a, :scope > * > a'));
    var link = links.find(function (a) { return a.textContent.trim() === 'Contacto'; });
    if (!link || link.parentElement.classList.contains('nav-drop')) return;

    var isContactPage = /contact\.html$/i.test(location.pathname);
    var currentFile = location.pathname.split("/").pop() || "index.html";

    var wrap = document.createElement("div");
    wrap.className = "nav-drop";
    if (isContactPage) wrap.classList.add("open");

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-drop-toggle" + (isContactPage ? " active" : "");
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      'Contacto <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/></svg>';

    var menu = document.createElement("ul");
    menu.className = "nav-drop-menu";
    var items = [
      {
        label: "Localizador de Lojas",
        href: "contact.html",
      },
    ];
    items.forEach(function (item) {
      if (!item.href) return;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      if (/^https:/.test(item.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.textContent = item.label;
      li.appendChild(a);
      menu.appendChild(li);
    });

    link.style.display = "none";
    link.parentElement.insertBefore(wrap, link);
    wrap.appendChild(toggle);
    wrap.appendChild(menu);

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
