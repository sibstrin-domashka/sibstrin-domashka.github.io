/* =====================================================================
   Домашка — сезонные и праздничные фоны.
   * Сам выбирает фон по дате: зима / весна / лето / осень и праздники
     (Новый год, 23 февраля, 8 марта, День Победы, 1 сентября, Хэллоуин).
   * Если в папке assets/bg/ лежит картинка с именем темы (например
     assets/bg/newyear.jpg) — ставит её. Если картинки нет — берёт горы
     assets/mountain-bg.jpg и перекрашивает их под тему.
   * Поверх — лёгкая анимация (снег, листья, лепестки, летучие мыши,
     салют). Выключается в настройках; не работает, если в системе
     включено «уменьшить движение».
   * Посмотреть любую тему сразу: добавь к адресу ?bg=newyear (или
     winter, spring, summer, autumn, defender, women, victory, knowledge,
     halloween, classic).
   ===================================================================== */
(function(){
  "use strict";

  // base: цвет затемнения (r,g,b); color: перекраска гор; glow: свечение.
  var THEMES = {
    auto:      { name:"Авто — по сезону и праздникам" },
    classic:   { name:"Классический (горы)", base:[5,31,32] },
    winter:    { name:"Зима", emoji:"❄️", base:[6,22,38], color:"#7fb6ff", glow:"rgba(150,200,255,.18)", fx:"snow" },
    spring:    { name:"Весна", emoji:"🌸", base:[8,30,26], color:"#ff9ccf", glow:"rgba(255,170,210,.14)", fx:"petals" },
    summer:    { name:"Лето", emoji:"☀️", base:[6,30,30], color:"#ffd36b", glow:"rgba(255,214,120,.16)", fx:"fireflies" },
    autumn:    { name:"Осень", emoji:"🍂", base:[30,18,6], color:"#ff9a3c", glow:"rgba(255,150,60,.16)", fx:"leaves" },
    newyear:   { name:"Новый год", emoji:"🎄", base:[5,14,36], color:"#6fa8ff", glow:"rgba(255,215,120,.20)", fx:"snow", lights:true, greet:"С Новым годом! 🎄" },
    defender:  { name:"23 февраля", emoji:"⭐", base:[8,18,30], color:"#8fb0d8", glow:"rgba(230,60,60,.14)", fx:"stars", greet:"С Днём защитника Отечества! ⭐" },
    women:     { name:"8 марта", emoji:"🌷", base:[34,10,26], color:"#ff7fb8", glow:"rgba(255,120,180,.18)", fx:"tulips", greet:"С 8 Марта! 🌷" },
    victory:   { name:"День Победы", emoji:"🎖️", base:[20,12,6], color:"#ff9a2e", glow:"rgba(255,140,0,.18)", fx:"salute", ribbon:true, greet:"С Днём Победы! 🎖️" },
    knowledge: { name:"1 сентября", emoji:"📚", base:[8,24,34], color:"#ffc14d", glow:"rgba(255,200,90,.14)", fx:"leaves", greet:"С Днём знаний! 📚" },
    halloween: { name:"Хэллоуин", emoji:"🎃", base:[20,6,28], color:"#ff7a1a", glow:"rgba(255,110,20,.20)", fx:"bats", greet:"Жуткого Хэллоуина! 🎃" }
  };

  // Праздники: [месяц, день] с ... по ... (включительно). Важнее сезона.
  var HOLIDAYS = [
    { key:"newyear",   from:[12,20], to:[1,10] },
    { key:"defender",  from:[2,21],  to:[2,23] },
    { key:"women",     from:[3,6],   to:[3,8]  },
    { key:"victory",   from:[5,5],   to:[5,10] },
    { key:"knowledge", from:[8,30],  to:[9,3]  },
    { key:"halloween", from:[10,25], to:[11,1] }
  ];

  function md(d){ return (d.getMonth()+1)*100 + d.getDate(); }
  function inRange(v, from, to){
    var a = from[0]*100+from[1], b = to[0]*100+to[1];
    return a <= b ? (v >= a && v <= b) : (v >= a || v <= b);   // через Новый год
  }
  function autoKey(date){
    var v = md(date || new Date());
    for(var i=0;i<HOLIDAYS.length;i++) if(inRange(v, HOLIDAYS[i].from, HOLIDAYS[i].to)) return HOLIDAYS[i].key;
    var m = (date || new Date()).getMonth()+1;
    if(m===12 || m<=2) return "winter";
    if(m<=5) return "spring";
    if(m<=8) return "summer";
    return "autumn";
  }

  function lsGet(k, d){ try{ var v = localStorage.getItem(k); return v===null ? d : v; }catch(e){ return d; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }

  function urlKey(){
    try{ var m = /[?&]bg=([a-z]+)/.exec(location.search); if(m && THEMES[m[1]] && m[1]!=="auto") return m[1]; }catch(e){}
    return null;
  }
  function setting(){ var s = lsGet("domashka_bg", "auto"); return THEMES[s] ? s : "auto"; }
  function fxOn(){ return lsGet("domashka_fx", "1") === "1"; }
  function activeKey(){
    var u = urlKey(); if(u) return u;
    var s = setting();
    return s === "auto" ? autoKey() : s;
  }
  function reducedMotion(){
    try{ return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; }
  }

  /* ---------------- DOM слои ---------------- */
  var root, imgEl, colorEl, scrimEl, canvas, ribbonEl, ctx, gCanvas, gctx, raf = 0, parts = [], fxKind = null, lastBurst = 0;

  function injectCss(){
    if(document.getElementById("dmThemeCss")) return;
    var s = document.createElement("style"); s.id = "dmThemeCss";
    s.textContent =
      "#dmBg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}" +
      "#dmBg>*{position:absolute;inset:0}" +
      "#dmBg .dm-img{background-size:cover;background-position:center 30%;transition:opacity .6s}" +
      "#dmBg .dm-color{mix-blend-mode:color;opacity:.42}" +
      "#dmBg canvas{width:100%;height:100%}" +
      "#dmGarland{position:fixed;left:0;top:0;width:100%;height:26px;z-index:150;pointer-events:none}" +
      "#dmRibbon{position:fixed;left:0;right:0;top:0;height:6px;z-index:151;pointer-events:none;background:repeating-linear-gradient(135deg,#f08a00 0 9px,#141414 9px 18px)}" +
      ".dm-greet{position:fixed;left:50%;top:14px;transform:translate(-50%,-30px);opacity:0;z-index:9999;pointer-events:none;" +
        "background:rgba(10,20,20,.88);color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:9px 16px;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis;" +
        "font:600 .9rem 'Golos Text',system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:all .5s ease}" +
      ".dm-greet.on{opacity:1;transform:translate(-50%,0)}";
    document.head.appendChild(s);
  }

  function build(){
    if(root) return;
    injectCss();
    root = document.createElement("div"); root.id = "dmBg"; root.setAttribute("aria-hidden", "true");
    imgEl = document.createElement("div"); imgEl.className = "dm-img";
    colorEl = document.createElement("div"); colorEl.className = "dm-color";
    scrimEl = document.createElement("div"); scrimEl.className = "dm-scrim";
    canvas = document.createElement("canvas");
    ribbonEl = document.createElement("div"); ribbonEl.id = "dmRibbon"; ribbonEl.setAttribute("aria-hidden", "true");
    root.appendChild(imgEl); root.appendChild(colorEl); root.appendChild(scrimEl);
    root.appendChild(canvas);
    document.body.insertBefore(root, document.body.firstChild);
    ctx = canvas.getContext("2d");
    gCanvas = document.createElement("canvas"); gCanvas.id = "dmGarland"; gCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(gCanvas); document.body.appendChild(ribbonEl); gctx = gCanvas.getContext("2d");
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stop(); else startFx(); });
    resize();
  }

  function rgba(b, a){ return "rgba(" + b[0] + "," + b[1] + "," + b[2] + "," + a + ")"; }

  var imgCache = {};
  function probe(url, cb){
    if(url in imgCache){ cb(imgCache[url]); return; }
    var im = new Image();
    im.onload = function(){ imgCache[url] = true; cb(true); };
    im.onerror = function(){ imgCache[url] = false; cb(false); };
    im.src = url;
  }

  function apply(){
    if(!document.body){ document.addEventListener("DOMContentLoaded", apply); return; }
    build();
    var key = activeKey(), t = THEMES[key] || THEMES.classic, base = t.base || THEMES.classic.base;
    root.setAttribute("data-theme", key);
    scrimEl.style.background =
      (t.glow ? "radial-gradient(ellipse at 50% 0%," + t.glow + ",transparent 60%)," : "") +
      "linear-gradient(to bottom," + rgba(base,.9) + " 0%," + rgba(base,.55) + " 32%," + rgba(base,.55) + " 68%," + rgba(base,.95) + " 100%)";
    ribbonEl.style.display = t.ribbon ? "block" : "none";
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", "rgb(" + base.join(",") + ")");

    var custom = "assets/bg/" + key + ".jpg";
    var fallback = "assets/mountain-bg.jpg";
    if(key === "classic"){ setImg(fallback, false, t); }
    else probe(custom, function(ok){ setImg(ok ? custom : fallback, !ok, t); });

    fxKind = (fxOn() && !reducedMotion()) ? (t.fx || null) : null;
    parts = []; startFx();
  }

  function setImg(url, recolor, t){
    probe(url, function(ok){
      imgEl.style.backgroundImage = ok ? 'url("' + url + '")' : "none";
      colorEl.style.background = (recolor && t.color) ? t.color : "transparent";
    });
  }

  /* ---------------- Анимация ---------------- */
  var W = 0, H = 0, DPR = 1;
  function resize(){
    if(!canvas) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx && ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if(gCanvas){ gCanvas.width = W * DPR; gCanvas.height = 26 * DPR; gctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  }
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function count(base){ return Math.round(base * Math.max(.5, Math.min(1.6, W / 900))); }

  function spawn(kind, initial){
    var p = { x:rnd(0, W), y: initial ? rnd(0, H) : rnd(-60, -10), a:rnd(0, 6.28), s:Math.random() };
    switch(kind){
      case "snow":      p.r = rnd(1, 3.2); p.vy = rnd(.35, 1.1); p.vx = rnd(-.2, .2); break;
      case "petals":    p.r = rnd(4, 7); p.vy = rnd(.4, .9); p.vx = rnd(.1, .6); p.rot = rnd(0, 6.28); p.vr = rnd(-.03, .03);
                        p.c = ["#ffc2dd","#ffd6e8","#ffb0d0","#fff0f6"][Math.floor(rnd(0,4))]; break;
      case "leaves":    p.e = ["🍁","🍂","🍂","🍁"][Math.floor(rnd(0,4))]; p.r = rnd(14, 22); p.vy = rnd(.5, 1.1); p.vx = rnd(-.3, .5); p.rot = rnd(0, 6.28); p.vr = rnd(-.02, .02); break;
      case "tulips":    p.e = ["🌷","🌸","🌷"][Math.floor(rnd(0,3))]; p.r = rnd(14, 20); p.vy = rnd(.35, .8); p.vx = rnd(-.2, .3); p.rot = rnd(-.4, .4); p.vr = rnd(-.01, .01); break;
      case "fireflies": p.y = rnd(H * .35, H); p.r = rnd(1.5, 3); p.vx = rnd(-.25, .25); p.vy = rnd(-.25, .1); break;
      case "stars":     p.y = rnd(0, H * .7); p.r = rnd(1, 2.4); break;
      case "bats":      p.x = initial ? rnd(0, W) : rnd(-W * .6, -30); p.y = rnd(H * .3, H * .92); p.e = Math.random() < .3 ? "🎃" : "🦇"; p.r = rnd(20, 32); p.vx = rnd(.5, 1.2); p.amp = rnd(8, 26); break;
    }
    return p;
  }
  function target(kind){
    return { snow:count(70), petals:count(26), leaves:count(14), tulips:count(12), fireflies:count(26), stars:count(40), bats:count(9) }[kind] || 0;
  }

  function burst(){
    var cx = rnd(W * .15, W * .85), cy = rnd(H * .2, H * .65);
    var colors = ["#ffb347","#ff7043","#ffd54f","#ffffff","#ff5252"];
    var c = colors[Math.floor(rnd(0, colors.length))];
    for(var i=0;i<46;i++){
      var ang = (i / 46) * 6.283, sp = rnd(1.2, 3.2);
      parts.push({ burst:true, x:cx, y:cy, vx:Math.cos(ang) * sp, vy:Math.sin(ang) * sp, life:1, c:c, r:rnd(1.6, 2.8) });
    }
  }

  function drawLights(t){
    gctx.clearRect(0, 0, W, 26);
    var n = Math.max(10, Math.round(W / 46)), cols = ["#ff5252","#ffd54f","#69f0ae","#40c4ff","#ff80ab"];
    gctx.strokeStyle = "rgba(255,255,255,.18)"; gctx.lineWidth = 1; gctx.beginPath();
    for(var i=0;i<=n;i++){ var x = i * W / n, y = 7 + Math.sin(i * .9) * 4; i ? gctx.lineTo(x, y) : gctx.moveTo(x, y); }
    gctx.stroke();
    for(var j=0;j<=n;j++){
      var xx = j * W / n, yy = 10 + Math.sin(j * .9) * 4, on = .45 + .55 * Math.abs(Math.sin(t / 600 + j * 1.7));
      gctx.globalAlpha = on; gctx.fillStyle = cols[j % cols.length];
      gctx.shadowColor = cols[j % cols.length]; gctx.shadowBlur = 10;
      gctx.beginPath(); gctx.arc(xx, yy, 2.8, 0, 6.283); gctx.fill();
    }
    gctx.shadowBlur = 0; gctx.globalAlpha = 1;
  }

  function frame(t){
    raf = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
    var th = THEMES[activeKey()] || {};
    if(fxKind === "salute"){
      if(t - lastBurst > 1500){ lastBurst = t; burst(); }
    } else {
      while(parts.length < target(fxKind)) parts.push(spawn(fxKind, parts.length < target(fxKind) && !parts._init));
      parts._init = true;
    }
    for(var i=parts.length-1;i>=0;i--){
      var p = parts[i];
      if(p.burst){
        p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .985; p.life -= .008;
        if(p.life <= 0){ parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        continue;
      }
      p.a += .01;
      switch(fxKind){
        case "snow":
          p.y += p.vy; p.x += p.vx + Math.sin(p.a) * .3;
          ctx.globalAlpha = .55 + p.s * .4; ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); break;
        case "petals":
          p.y += p.vy; p.x += p.vx + Math.sin(p.a) * .4; p.rot += p.vr;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = .8; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill(); ctx.restore(); break;
        case "leaves": case "tulips":
          p.y += p.vy; p.x += p.vx + Math.sin(p.a) * .5; p.rot += p.vr;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = .85;
          ctx.font = p.r + "px serif"; ctx.textAlign = "center"; ctx.fillText(p.e, 0, 0); ctx.restore(); break;
        case "fireflies":
          p.x += p.vx + Math.sin(p.a * 2) * .2; p.y += p.vy + Math.cos(p.a * 1.5) * .2;
          ctx.globalAlpha = .35 + .6 * Math.abs(Math.sin(t / 900 + p.s * 10));
          ctx.fillStyle = "#ffe98a"; ctx.shadowColor = "#ffd54f"; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
          if(p.y < H * .2 || p.y > H + 10 || p.x < -10 || p.x > W + 10){ parts[i] = spawn("fireflies", true); }
          continue;
        case "stars":
          ctx.globalAlpha = .25 + .75 * Math.abs(Math.sin(t / 1200 + p.s * 20));
          ctx.fillStyle = p.s > .8 ? "#ff6b6b" : "#ffe7a3";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); continue;
        case "bats":
          p.x += p.vx; var yy = p.y + Math.sin(p.a * 3) * p.amp;
          ctx.globalAlpha = .9; ctx.font = p.r + "px serif"; ctx.textAlign = "center";
          ctx.save(); ctx.translate(p.x, yy); if(p.e === "🦇") ctx.scale(1, .8 + .2 * Math.sin(t / 90 + p.s * 9));
          ctx.shadowColor = "rgba(255,120,20,.6)"; ctx.shadowBlur = 14; ctx.fillText(p.e, 0, 0); ctx.restore();
          if(p.x > W + 40) parts[i] = spawn("bats", false);
          continue;
      }
      if(p.y > H + 30 || p.x > W + 40 || p.x < -40) parts[i] = spawn(fxKind, false);
    }
    ctx.globalAlpha = 1;
    if(th.lights && fxOn() && !reducedMotion()) drawLights(t); else if(gctx) gctx.clearRect(0, 0, W, 26);
  }

  function stop(){ if(raf){ cancelAnimationFrame(raf); raf = 0; } }
  function startFx(){
    stop();
    if(!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if(gctx) gctx.clearRect(0, 0, W, 26);
    var th = THEMES[activeKey()] || {};
    if((fxKind || (th.lights && fxOn() && !reducedMotion())) && !document.hidden) raf = requestAnimationFrame(frame);
  }

  /* ---------------- Поздравление (один раз за праздник) ---------------- */
  function greet(){
    var key = activeKey(), t = THEMES[key];
    if(!t || !t.greet || setting() !== "auto" || urlKey()) return;
    var flag = "domashka_greet_" + key + "_" + new Date().getFullYear();
    if(lsGet(flag, "") === "1") return;
    lsSet(flag, "1");
    var el = document.createElement("div"); el.className = "dm-greet"; el.textContent = t.greet;
    document.body.appendChild(el);
    setTimeout(function(){ el.classList.add("on"); }, 600);
    setTimeout(function(){ el.classList.remove("on"); }, 4800);
    setTimeout(function(){ el.remove(); }, 5600);
  }

  window.DomashkaTheme = {
    list: function(){ return Object.keys(THEMES).map(function(k){ return { key:k, name:(THEMES[k].emoji ? THEMES[k].emoji + " " : "") + THEMES[k].name }; }); },
    setting: setting,
    activeKey: activeKey,
    activeName: function(){ var t = THEMES[activeKey()]; return t ? t.name : ""; },
    autoKey: autoKey,
    set: function(k){ if(THEMES[k]){ lsSet("domashka_bg", k); apply(); } },
    fx: fxOn,
    setFx: function(on){ lsSet("domashka_fx", on ? "1" : "0"); apply(); },
    apply: apply,
    _debug: function(){ return { fx:fxKind, parts:parts.length, running:!!raf }; }
  };

  function boot(){ apply(); greet(); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
