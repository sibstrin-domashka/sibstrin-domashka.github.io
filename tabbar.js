/* =====================================================================
   Домашка — нижняя панель навигации, как в приложениях.
   DomashkaTabbar.mount([{ key, label, icon, center, onClick }], activeKey)
   DomashkaTabbar.setActive(key) · DomashkaTabbar.setBadge(key, n)
   ===================================================================== */
(function(){
  "use strict";
  var ICONS = {
    home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    qr:'<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17.5 21H21v-3.5"/>',
    chart:'<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx=".8"/><rect x="10.5" y="6" width="3" height="12" rx=".8"/><rect x="16" y="13" width="3" height="5" rx=".8"/>',
    more:'<circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
    calendar:'<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
    journal:'<path d="M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3z"/><path d="M9 8h6M9 12h6M9 16h3"/>'
  };
  function svg(name){ return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>"; }

  function css(){
    if(document.getElementById("tbCss")) return;
    var s = document.createElement("style"); s.id = "tbCss";
    s.textContent =
      ".tabbar{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:space-around;align-items:flex-end;" +
        "padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));background:rgba(5,31,32,.9);" +
        "backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--border,rgba(255,255,255,.1));font-family:var(--font-body,'Golos Text',system-ui,sans-serif)}" +
      ".tabbar button{flex:1;max-width:110px;background:none;border:none;border-radius:12px;padding:4px 2px 2px;margin:0;display:flex;flex-direction:column;align-items:center;gap:3px;" +
        "color:var(--text-secondary,#9FC7BE);font:inherit;font-size:.68rem;font-weight:600;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent}" +
      ".tabbar button.on{color:var(--text-primary,#F2FBF8)}" +
      ".tabbar button.on svg{color:var(--accent,#4FD1A5)}" +
      ".tabbar button:active{transform:scale(.94)}" +
      ".tabbar .tb-center .tb-ic{width:56px;height:56px;margin-top:-26px;border-radius:50%;background:var(--accent,#4FD1A5);color:#052421;display:flex;align-items:center;justify-content:center;" +
        "box-shadow:0 8px 22px rgba(0,0,0,.45),0 0 0 5px rgba(5,31,32,.9)}" +
      ".tabbar .tb-center .tb-ic svg{width:28px;height:28px;color:#052421}" +
      ".tabbar .tb-center{color:var(--text-primary,#F2FBF8)}" +
      ".tb-badge{position:absolute;top:0;left:calc(50% + 6px);min-width:17px;height:17px;padding:0 5px;border-radius:999px;background:var(--danger,#E8605C);color:#fff;font-size:.64rem;line-height:17px;font-weight:700}" +
      "body.has-tabbar{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)) !important}" +
      "@media(min-width:900px){.tabbar{left:50%;right:auto;transform:translateX(-50%);width:560px;bottom:14px;border:1px solid var(--border,rgba(255,255,255,.1));border-radius:22px;padding-bottom:6px}}";
    document.head.appendChild(s);
  }

  var bar = null, items = [];
  function mount(list, active){
    css();
    items = list;
    if(bar) bar.remove();
    bar = document.createElement("nav"); bar.className = "tabbar"; bar.setAttribute("aria-label", "Навигация");
    list.forEach(function(it){
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-tab", it.key);
      if(it.center) b.className = "tb-center";
      b.innerHTML = (it.center ? '<span class="tb-ic">' + svg(it.icon) + "</span>" : svg(it.icon)) + "<span>" + it.label + "</span>";
      b.onclick = function(){ it.onClick && it.onClick(); };
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
    document.body.classList.add("has-tabbar");
    if(active) setActive(active);
  }
  function setActive(key){
    if(!bar) return;
    bar.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-tab") === key && !b.classList.contains("tb-center")); });
  }
  function setBadge(key, n){
    if(!bar) return;
    var b = bar.querySelector('[data-tab="' + key + '"]'); if(!b) return;
    var x = b.querySelector(".tb-badge");
    if(!n){ if(x) x.remove(); return; }
    if(!x){ x = document.createElement("span"); x.className = "tb-badge"; b.appendChild(x); }
    x.textContent = n > 99 ? "99+" : n;
  }
  window.DomashkaTabbar = { mount:mount, setActive:setActive, setBadge:setBadge };
})();
