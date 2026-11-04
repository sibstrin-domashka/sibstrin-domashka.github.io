/* =====================================================================
   Домашка — фон. Один постоянный фон: зелёная текстура (green-texture.jpg).
   Сезонные и праздничные фоны и анимации убраны.
   ===================================================================== */
(function(){
  "use strict";
  var BASE = [5, 31, 32];
  var LIST = ["assets/bg/green-texture.jpg", "green-texture.jpg", "assets/mountain-bg.jpg"];
  var root, imgEl, scrimEl;

  function rgba(a){ return "rgba(" + BASE[0] + "," + BASE[1] + "," + BASE[2] + "," + a + ")"; }
  function firstOk(list, cb, i){
    i = i || 0;
    if(i >= list.length){ cb(null); return; }
    var im = new Image();
    im.onload = function(){ cb(list[i]); };
    im.onerror = function(){ firstOk(list, cb, i + 1); };
    im.src = list[i];
  }
  function apply(){
    if(!document.body){ document.addEventListener("DOMContentLoaded", apply); return; }
    if(!root){
      var s = document.createElement("style"); s.id = "dmThemeCss";
      s.textContent = "#dmBg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}" +
        "#dmBg>*{position:absolute;inset:0}" +
        "#dmBg .dm-img{background-size:cover;background-position:center 30%}";
      document.head.appendChild(s);
      root = document.createElement("div"); root.id = "dmBg"; root.setAttribute("aria-hidden", "true");
      imgEl = document.createElement("div"); imgEl.className = "dm-img";
      scrimEl = document.createElement("div");
      root.appendChild(imgEl); root.appendChild(scrimEl);
      document.body.insertBefore(root, document.body.firstChild);
    }
    scrimEl.style.background = "linear-gradient(to bottom," + rgba(.9) + " 0%," + rgba(.55) + " 32%," + rgba(.55) + " 68%," + rgba(.95) + " 100%)";
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", "rgb(" + BASE.join(",") + ")");
    firstOk(LIST, function(u){ imgEl.style.backgroundImage = u ? 'url("' + u + '")' : "none"; });
  }

  // Совместимость со старым кодом (настройки больше не показывают выбор фона).
  window.DomashkaTheme = {
    list: function(){ return []; },
    setting: function(){ return "classic"; },
    activeKey: function(){ return "classic"; },
    activeName: function(){ return "Зелёный"; },
    set: function(){}, fx: function(){ return false; }, setFx: function(){},
    apply: apply, fixed: true
  };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
})();
