// Подставляет значения из app-config.js во все документы.
(function(){
  var C = window.DOMASHKA_CONFIG || {};
  document.querySelectorAll("[data-cfg]").forEach(function(el){ el.textContent = C[el.getAttribute("data-cfg")] || ""; });
  document.querySelectorAll("[data-mail]").forEach(function(el){
    el.href = "mailto:" + (C.supportEmail || "") + (el.getAttribute("data-mail") ? "?subject=" + encodeURIComponent(el.getAttribute("data-mail")) : "");
    if(!el.textContent.trim()) el.textContent = C.supportEmail || "";
  });
  var page = location.pathname.split("/").pop() || "";
  document.querySelectorAll(".nav a").forEach(function(a){ if(a.getAttribute("href") === page) a.classList.add("on"); });
  var y = document.getElementById("year"); if(y) y.textContent = new Date().getFullYear();
})();
