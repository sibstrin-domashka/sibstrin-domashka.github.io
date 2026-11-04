/* =====================================================================
   Домашка — реклама и акции на главном экране.
   Объявления добавляет только владелец (owner.html → «Реклама и акции»).
   Виды: «карточка» (картинка слева + текст) и «баннер» (широкая картинка
   во всю ширину). Можно показать QR-код ссылки и условия акции.
     DomashkaAds.load(sb, "students" | "teachers").then(render)
     html += DomashkaAds.html();  DomashkaAds.bind();
   ===================================================================== */
(function(){
  var ad = null, sbRef = null, seen = {};
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function css(){
    if(document.getElementById("adsCss")) return;
    var st = document.createElement("style"); st.id = "adsCss";
    st.textContent =
      ".ad-card{position:relative;max-width:760px;margin:0 auto 12px;border-radius:14px;overflow:hidden;" +
        "background:var(--surface,rgba(18,40,36,.82));border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-sizing:border-box}" +
      ".ad-row{display:flex;gap:14px;align-items:center;padding:14px 16px}" +
      ".ad-card .ad-img{flex:0 0 76px;width:76px;height:76px;border-radius:10px;object-fit:cover;background:rgba(255,255,255,.06)}" +
      ".ad-card .ad-qr{flex:0 0 88px;width:88px;height:88px;background:#fff;border-radius:10px;padding:6px;box-sizing:border-box}" +
      ".ad-card .ad-qr svg{width:100%;height:100%;display:block}" +
      ".ad-banner{display:block;width:100%;aspect-ratio:2/1;object-fit:cover;background:rgba(255,255,255,.06)}" +
      ".ad-card .ad-main{flex:1;min-width:0}" +
      ".ad-card .ad-l{font-size:.7rem;color:var(--text-secondary,#9fb5ad);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:26px}" +
      ".ad-card.is-banner .ad-l{position:absolute;left:10px;top:10px;padding:2px 8px;border-radius:999px;background:rgba(0,0,0,.55);color:#fff;max-width:70%}" +
      ".ad-card .ad-t{font-weight:700;font-size:1rem;margin-top:3px;line-height:1.3;color:var(--text-primary,#fff)}" +
      ".ad-card .ad-s{font-size:.84rem;color:var(--text-secondary,#9fb5ad);margin-top:3px;line-height:1.4}" +
      ".ad-card .ad-acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:9px}" +
      ".ad-card .ad-b{display:inline-block;padding:7px 14px;border-radius:999px;background:var(--accent,#5BD0A8);color:#04211C;font-weight:700;font-size:.84rem;text-decoration:none}" +
      ".ad-card .ad-terms-btn{background:none;border:none;color:var(--text-secondary,#9fb5ad);font:inherit;font-size:.78rem;text-decoration:underline;cursor:pointer;padding:4px 0}" +
      ".ad-card .ad-terms{display:none;font-size:.78rem;line-height:1.45;color:var(--text-secondary,#9fb5ad);margin-top:8px;white-space:pre-line}" +
      ".ad-card .ad-terms.on{display:block}" +
      ".ad-card .ad-x{position:absolute;top:8px;right:8px;z-index:2;width:28px;height:28px;border:none;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}" +
      ".ad-card .ad-x svg{width:12px;height:12px}" +
      ".ad-card.clickable .ad-hit{cursor:pointer}";
    document.head.appendChild(st);
  }

  function pick(list){
    var vis = list.filter(function(a){ var h = +lsGet("domashka_ad_hide_" + a.id) || 0; return Date.now() > h; });
    if(!vis.length) return null;
    return vis[Math.floor(Date.now() / 86400000) % vis.length];   // в течение дня — одно объявление
  }
  function linkWithErid(a){
    if(!a.link_url) return "";
    if(!a.erid) return a.link_url;
    return a.link_url + (a.link_url.indexOf("?") < 0 ? "?" : "&") + "erid=" + encodeURIComponent(a.erid);
  }
  function loadQrLib(cb){
    if(window.qrcode) return cb();
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";
    s.onload = cb; s.onerror = function(){}; document.head.appendChild(s);
  }

  window.DomashkaAds = {
    load: async function(sb, audience){
      sbRef = sb; ad = null;
      if(!sb) return null;
      try{
        var r = await sb.from("ads").select("*").eq("active", true).in("audience", ["all", audience || "students"])
          .order("created_at", { ascending:false }).limit(20);
        if(r.error || !r.data) return null;
        ad = pick(r.data);
      }catch(e){ ad = null; }
      return ad;
    },
    current: function(){ return ad; },
    html: function(){
      if(!ad) return "";
      css();
      var a = ad, banner = a.layout === "banner", href = linkWithErid(a);
      var label = "Реклама" + (a.advertiser ? " · " + esc(a.advertiser) : "") + (a.erid ? " · erid: " + esc(a.erid) : "");
      var acts = (href ? '<a class="ad-b" id="adBtn" href="' + esc(href) + '" target="_blank" rel="noopener sponsored">' + esc(a.button_text || "Подробнее") + '</a>' : "") +
                 (a.terms ? '<button class="ad-terms-btn" id="adTermsBtn" type="button">Условия</button>' : "");
      var text = (a.title && a.title.trim() ? '<div class="ad-t">' + esc(a.title) + '</div>' : "") + (a.body ? '<div class="ad-s">' + esc(a.body) + '</div>' : "") +
                 (acts ? '<div class="ad-acts">' + acts + '</div>' : "") +
                 (a.terms ? '<div class="ad-terms" id="adTerms">' + esc(a.terms) + '</div>' : "");
      var qr = (a.show_qr && href) ? '<div class="ad-qr" id="adQr"></div>' : "";
      var h = '<div class="ad-card' + (banner ? " is-banner" : "") + (href ? " clickable" : "") + '" id="adCard">' +
        '<button class="ad-x" id="adX" aria-label="Скрыть на сутки">' + X + '</button>';
      if(banner){
        h += (a.image_url ? '<img class="ad-banner ad-hit" src="' + esc(a.image_url) + '" alt="">' : "") +
             '<div class="ad-l">' + label + '</div>' +
             ((text || qr) ? '<div class="ad-row">' + '<div class="ad-main">' + text + '</div>' + qr + '</div>' : "");
      } else {
        h += '<div class="ad-row">' + (qr || (a.image_url ? '<img class="ad-img ad-hit" src="' + esc(a.image_url) + '" alt="" loading="lazy">' : "")) +
             '<div class="ad-main"><div class="ad-l">' + label + '</div>' + text + '</div></div>';
      }
      return h + '</div>';
    },
    bind: function(onHide){
      var card = document.getElementById("adCard"); if(!card || !ad) return;
      var a = ad, href = linkWithErid(a);
      if(!seen[a.id] && sbRef){ seen[a.id] = 1; sbRef.rpc("ad_event", { p_ad:a.id, p_kind:"view" }).then(function(){}, function(){}); }
      function click(){ if(sbRef) sbRef.rpc("ad_event", { p_ad:a.id, p_kind:"click" }).then(function(){}, function(){}); }
      var btn = document.getElementById("adBtn");
      if(btn) btn.addEventListener("click", function(e){ e.stopPropagation(); click(); });
      if(href) card.querySelectorAll(".ad-hit").forEach(function(el){ el.addEventListener("click", function(){ click(); window.open(href, "_blank", "noopener"); }); });
      var tb = document.getElementById("adTermsBtn");
      if(tb) tb.addEventListener("click", function(e){ e.stopPropagation(); var t = document.getElementById("adTerms"); t.classList.toggle("on"); tb.textContent = t.classList.contains("on") ? "Скрыть условия" : "Условия"; });
      var qrBox = document.getElementById("adQr");
      if(qrBox) loadQrLib(function(){ try{ var q = qrcode(0, "M"); q.addData(href); q.make(); qrBox.innerHTML = q.createSvgTag({ cellSize:4, margin:0, scalable:true }); }catch(e){} });
      document.getElementById("adX").addEventListener("click", function(e){
        e.stopPropagation();
        lsSet("domashka_ad_hide_" + a.id, String(Date.now() + 86400000));
        ad = null; card.remove(); if(onHide) onHide();
      });
    }
  };
})();
