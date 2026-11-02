/* =====================================================================
   Домашка — рекламная карточка (объявление) на главном экране.
   Объявления добавляет только владелец (owner.html → «Реклама»).
   Использование:
     DomashkaAds.load(sb, "students" | "teachers").then(render)
     html += DomashkaAds.html();      // в разметку экрана
     DomashkaAds.bind();              // после вставки в страницу
   ===================================================================== */
(function(){
  var ad = null, sbRef = null, seen = {};
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }

  function css(){
    if(document.getElementById("adsCss")) return;
    var st = document.createElement("style"); st.id = "adsCss";
    st.textContent =
      ".ad-card{position:relative;max-width:760px;margin:0 auto 12px;display:flex;gap:14px;align-items:center;padding:14px 16px;border-radius:14px;" +
        "background:var(--surface,rgba(18,40,36,.82));border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-sizing:border-box}" +
      ".ad-card .ad-img{flex:0 0 76px;width:76px;height:76px;border-radius:10px;object-fit:cover;background:rgba(255,255,255,.06)}" +
      ".ad-card .ad-main{flex:1;min-width:0}" +
      ".ad-card .ad-l{font-size:.7rem;color:var(--text-secondary,#9fb5ad);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:26px}" +
      ".ad-card .ad-t{font-weight:700;font-size:1rem;margin-top:3px;line-height:1.3;color:var(--text-primary,#fff)}" +
      ".ad-card .ad-s{font-size:.84rem;color:var(--text-secondary,#9fb5ad);margin-top:3px;line-height:1.4}" +
      ".ad-card .ad-b{display:inline-block;margin-top:9px;padding:7px 14px;border-radius:999px;background:var(--accent,#5BD0A8);color:#04211C;font-weight:700;font-size:.84rem;text-decoration:none}" +
      ".ad-card .ad-x{position:absolute;top:8px;right:8px;width:26px;height:26px;border:none;border-radius:50%;background:rgba(255,255,255,.08);color:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}" +
      ".ad-card .ad-x svg{width:12px;height:12px}" +
      ".ad-card.clickable{cursor:pointer}";
    document.head.appendChild(st);
  }

  function pick(list){
    var vis = list.filter(function(a){ var h = +lsGet("domashka_ad_hide_" + a.id) || 0; return Date.now() > h; });
    if(!vis.length) return null;
    var day = Math.floor(Date.now() / 86400000);           // в течение дня — одно и то же объявление
    return vis[day % vis.length];
  }

  function linkWithErid(a){
    if(!a.link_url) return "";
    if(!a.erid) return a.link_url;
    return a.link_url + (a.link_url.indexOf("?") < 0 ? "?" : "&") + "erid=" + encodeURIComponent(a.erid);
  }

  window.DomashkaAds = {
    load: async function(sb, audience){
      sbRef = sb; ad = null;
      if(!sb) return null;
      try{
        var r = await sb.from("ads").select("id,title,body,image_url,link_url,button_text,audience,advertiser,erid")
          .eq("active", true).in("audience", ["all", audience || "students"]).order("created_at", { ascending:false }).limit(20);
        if(r.error || !r.data) return null;
        ad = pick(r.data);
      }catch(e){ ad = null; }
      return ad;
    },
    current: function(){ return ad; },
    html: function(){
      if(!ad) return "";
      css();
      var label = "Реклама" + (ad.advertiser ? " · " + esc(ad.advertiser) : "") + (ad.erid ? " · erid: " + esc(ad.erid) : "");
      var href = linkWithErid(ad);
      return '<div class="ad-card' + (href ? " clickable" : "") + '" id="adCard">' +
        (ad.image_url ? '<img class="ad-img" src="' + esc(ad.image_url) + '" alt="" loading="lazy">' : "") +
        '<div class="ad-main"><div class="ad-l">' + label + '</div>' +
        '<div class="ad-t">' + esc(ad.title) + '</div>' +
        (ad.body ? '<div class="ad-s">' + esc(ad.body) + '</div>' : "") +
        (href ? '<a class="ad-b" id="adBtn" href="' + esc(href) + '" target="_blank" rel="noopener sponsored">' + esc(ad.button_text || "Подробнее") + '</a>' : "") +
        '</div><button class="ad-x" id="adX" aria-label="Скрыть на сутки"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    },
    bind: function(onHide){
      var card = document.getElementById("adCard"); if(!card || !ad) return;
      var a = ad;
      if(!seen[a.id] && sbRef){ seen[a.id] = 1; sbRef.rpc("ad_event", { p_ad:a.id, p_kind:"view" }).then(function(){}, function(){}); }
      var href = linkWithErid(a);
      function click(){ if(sbRef) sbRef.rpc("ad_event", { p_ad:a.id, p_kind:"click" }).then(function(){}, function(){}); }
      var btn = document.getElementById("adBtn");
      if(btn) btn.addEventListener("click", function(e){ e.stopPropagation(); click(); });
      if(href) card.addEventListener("click", function(){ click(); window.open(href, "_blank", "noopener"); });
      document.getElementById("adX").addEventListener("click", function(e){
        e.stopPropagation();
        lsSet("domashka_ad_hide_" + a.id, String(Date.now() + 86400000));
        ad = null; card.remove(); if(onHide) onHide();
      });
    }
  };
})();
