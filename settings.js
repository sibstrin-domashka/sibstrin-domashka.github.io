/* =====================================================================
   Домашка — «Настройки» (общие для студентов и преподавателей).
   То, что требуют App Store и Google Play:
     * аккаунт: выйти, сменить пароль, УДАЛИТЬ аккаунт прямо в приложении;
     * политика конфиденциальности, пользовательское соглашение;
     * поддержка и «сообщить о проблеме»;
     * жалоба на содержимое + «скрыть пользователя» (контент от людей);
     * выгрузка своих данных.
   Плюс оформление: фон (сезоны/праздники), анимация, размер текста,
   напоминания о сроках.
   Нужны app-config.js и themes.js (подключаются раньше этого файла).
   ===================================================================== */
(function(){
  "use strict";
  var CFG = window.DOMASHKA_CONFIG || {};
  var opts = null;

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function lsGet(k, d){ try{ var v = localStorage.getItem(k); return v === null ? d : v; }catch(e){ return d; } }
  function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function $(id){ return document.getElementById(id); }

  /* ---------------- Размер текста (применяется сразу) ---------------- */
  var SIZES = { normal:"100%", large:"112.5%", xl:"125%" };
  function applyTextSize(){ document.documentElement.style.fontSize = SIZES[lsGet("domashka_text", "normal")] || "100%"; }
  applyTextSize();

  /* ---------------- Стили ---------------- */
  function injectCss(){
    if($("dsCss")) return;
    var s = document.createElement("style"); s.id = "dsCss";
    var card = "var(--surface-solid,var(--bg-card,#0B2B26))";
    var txt = "var(--text-primary,#EAF6F1)", sub = "var(--text-secondary,#9FC7BE)";
    var acc = "var(--accent,#4FD1A5)", bd = "var(--border,rgba(255,255,255,.1))", dng = "var(--danger,#E8605C)";
    s.textContent =
      ".ds-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:flex-end;justify-content:center;z-index:1000;font-family:var(--font-body,'Golos Text',system-ui,sans-serif)}" +
      ".ds-ov.on{display:flex}" +
      ".ds-sheet{background:" + card + ";color:" + txt + ";width:100%;max-width:520px;max-height:92vh;overflow-y:auto;border-radius:24px 24px 0 0;padding:0 0 24px;animation:dsUp .22s ease;-webkit-overflow-scrolling:touch}" +
      "@media(min-width:700px){.ds-ov{align-items:center}.ds-sheet{border-radius:24px}}" +
      "@keyframes dsUp{from{transform:translateY(30px);opacity:.4}to{transform:none;opacity:1}}" +
      ".ds-head{position:sticky;top:0;z-index:2;background:" + card + ";display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid " + bd + "}" +
      ".ds-head h3{font-family:var(--font-display,'Unbounded',sans-serif);font-size:1.05rem;font-weight:600;margin:0}" +
      ".ds-x{background:rgba(255,255,255,.1);color:" + txt + ";border:none;width:32px;height:32px;border-radius:50%;font-size:1.25rem;cursor:pointer;line-height:1}" +
      ".ds-body{padding:6px 16px 0}" +
      ".ds-me{display:flex;align-items:center;gap:12px;padding:14px 4px 6px}" +
      ".ds-ava{width:48px;height:48px;border-radius:50%;background:" + acc + ";color:#06201C;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;overflow:hidden;flex-shrink:0}" +
      ".ds-ava img{width:100%;height:100%;object-fit:cover}" +
      ".ds-me b{display:block;font-size:1rem}.ds-me span{color:" + sub + ";font-size:.84rem}" +
      ".ds-sec{margin-top:16px}" +
      ".ds-sec>h4{font-size:.74rem;text-transform:uppercase;letter-spacing:.06em;color:" + sub + ";margin:0 4px 6px;font-weight:600}" +
      ".ds-list{background:rgba(255,255,255,.04);border:1px solid " + bd + ";border-radius:16px;overflow:hidden}" +
      ".ds-row{display:flex;align-items:center;gap:12px;width:100%;padding:13px 14px;background:none;border:none;border-top:1px solid " + bd + ";color:" + txt + ";font:inherit;font-size:.94rem;text-align:left;cursor:pointer;text-decoration:none}" +
      ".ds-row:first-child{border-top:none}" +
      ".ds-row:active{background:rgba(255,255,255,.05)}" +
      ".ds-row .ds-ic{width:22px;text-align:center;flex-shrink:0}" +
      ".ds-row .ds-t{flex:1;min-width:0}.ds-row .ds-t small{display:block;color:" + sub + ";font-size:.78rem;margin-top:2px}" +
      ".ds-row .ds-v{color:" + sub + ";font-size:.84rem}" +
      ".ds-row .ds-chev{color:" + sub + "}" +
      ".ds-row.danger{color:" + dng + "}" +
      ".ds-row select{background:rgba(255,255,255,.06);color:" + txt + ";border:1px solid " + bd + ";border-radius:10px;padding:7px 8px;font:inherit;font-size:.86rem;max-width:56%}" +
      ".ds-row select option{background:#0B2B26;color:#fff}" +
      ".ds-sw{position:relative;width:46px;height:28px;flex-shrink:0}" +
      ".ds-sw input{opacity:0;width:0;height:0;position:absolute}" +
      ".ds-sw i{position:absolute;inset:0;border-radius:999px;background:rgba(255,255,255,.18);transition:.2s}" +
      ".ds-sw i:after{content:'';position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:.2s}" +
      ".ds-sw input:checked+i{background:" + acc + "}.ds-sw input:checked+i:after{left:21px}" +
      ".ds-foot{text-align:center;color:" + sub + ";font-size:.76rem;margin-top:18px;line-height:1.5}" +
      ".ds-p{color:" + sub + ";font-size:.88rem;line-height:1.5;margin:10px 4px}" +
      ".ds-p ul{margin:6px 0 0 18px}" +
      ".ds-lbl{display:block;font-size:.8rem;font-weight:600;color:" + sub + ";margin:14px 4px 6px}" +
      ".ds-in{width:100%;padding:12px 13px;border:1.5px solid " + bd + ";border-radius:12px;background:rgba(255,255,255,.04);color:" + txt + ";font:inherit;font-size:.95rem;box-sizing:border-box}" +
      ".ds-in:focus{outline:none;border-color:" + acc + "}" +
      "textarea.ds-in{min-height:90px;resize:vertical}" +
      ".ds-btn{width:100%;margin-top:16px;padding:14px;border:none;border-radius:14px;background:" + acc + ";color:#06201C;font:inherit;font-weight:700;font-size:.98rem;cursor:pointer}" +
      ".ds-btn.red{background:" + dng + ";color:#fff}.ds-btn.ghost{background:transparent;border:1.5px solid " + bd + ";color:" + txt + ";margin-top:10px}" +
      ".ds-btn:disabled{opacity:.55}" +
      ".ds-err{color:" + dng + ";font-size:.86rem;margin:10px 4px 0;min-height:1em}" +
      ".ds-radio{display:flex;align-items:center;gap:10px;padding:11px 12px;border:1px solid " + bd + ";border-radius:12px;margin-top:8px;cursor:pointer;font-size:.92rem}" +
      ".ds-radio input{accent-color:" + acc + ";width:18px;height:18px}" +
      ".ds-check{display:flex;gap:10px;align-items:flex-start;margin:14px 4px 0;font-size:.88rem;line-height:1.4;cursor:pointer}" +
      ".ds-check input{accent-color:" + acc + ";width:18px;height:18px;flex-shrink:0;margin-top:1px}" +
      ".ds-toast{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#111;color:#fff;padding:11px 16px;border-radius:12px;font-size:.88rem;z-index:1100;opacity:0;transition:opacity .25s;pointer-events:none;max-width:90vw;text-align:center}" +
      ".ds-toast.on{opacity:1}" +
      ".ds-rep{border:1px solid " + bd + ";border-radius:14px;padding:12px;margin-top:10px;font-size:.88rem;line-height:1.45}" +
      ".ds-rep .ds-meta{color:" + sub + ";font-size:.78rem}" +
      ".ds-rep .ds-acts{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}" +
      ".ds-mini{padding:7px 12px;border-radius:10px;border:1px solid " + bd + ";background:none;color:" + txt + ";font:inherit;font-size:.82rem;cursor:pointer}";
    document.head.appendChild(s);
  }

  function toast(m){
    var t = $("dsToast");
    if(!t){ t = document.createElement("div"); t.id = "dsToast"; t.className = "ds-toast"; document.body.appendChild(t); }
    t.textContent = m; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("on"); }, 2800);
  }

  /* ---------------- Окна ---------------- */
  function sheet(id, title, html){
    injectCss();
    var ov = $(id);
    if(!ov){
      ov = document.createElement("div"); ov.id = id; ov.className = "ds-ov";
      ov.addEventListener("click", function(e){ if(e.target === ov) close(id); });
      document.body.appendChild(ov);
    }
    ov.innerHTML = '<div class="ds-sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="ds-head"><h3>' + esc(title) +
      '</h3><button class="ds-x" aria-label="Закрыть" data-close="' + id + '">×</button></div><div class="ds-body">' + html + '</div></div>';
    ov.querySelector("[data-close]").onclick = function(){ close(id); };
    ov.classList.add("on");
    return ov;
  }
  function close(id){ var ov = $(id); if(ov) ov.classList.remove("on"); }

  function row(o){
    var tag = o.href ? "a" : "button";
    return "<" + tag + ' class="ds-row' + (o.danger ? " danger" : "") + '"' + (o.id ? ' id="' + o.id + '"' : "") +
      (o.href ? ' href="' + esc(o.href) + '"' + (o.blank ? ' target="_blank" rel="noopener"' : "") : ' type="button"') + ">" +
      '<span class="ds-ic">' + (o.icon || "") + '</span><span class="ds-t">' + esc(o.title) + (o.sub ? "<small>" + esc(o.sub) + "</small>" : "") + "</span>" +
      (o.right || '<span class="ds-chev">›</span>') + "</" + tag + ">";
  }
  function sw(id, on){ return '<label class="ds-sw"><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + "><i></i></label>"; }

  /* ---------------- Главный экран настроек ---------------- */
  function open(){
    if(!opts) return;
    var info = (opts.getInfo && opts.getInfo()) || {};
    var name = info.name || "Без имени";
    var initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(function(w){ return w[0]; }).join("").toUpperCase() || "?";
    var T = window.DomashkaTheme;
    var isStudent = opts.role === "student";

    var h = '<div class="ds-me"><div class="ds-ava">' + (info.avatar ? '<img src="' + esc(info.avatar) + '" alt="">' : esc(initials)) +
      '</div><div><b>' + esc(name) + '</b><span>' + esc(info.subtitle || (isStudent ? "Студент" : "Преподаватель")) + "</span></div></div>";

    h += '<div class="ds-sec"><h4>Аккаунт</h4><div class="ds-list">';
    if(opts.onEditProfile) h += row({ id:"dsEdit", icon:"👤", title:"Имя и фото" });
    if(opts.canChangePassword !== false) h += row({ id:"dsPass", icon:"🔑", title:"Сменить пароль" });
    h += row({ id:"dsLogout", icon:"🚪", title:"Выйти из аккаунта" });
    h += "</div></div>";

    h += '<div class="ds-sec"><h4>Оформление</h4><div class="ds-list">';
    if(T){
      var opt = T.list().map(function(t){ return '<option value="' + t.key + '"' + (t.key === T.setting() ? " selected" : "") + ">" + esc(t.name) + "</option>"; }).join("");
      h += '<div class="ds-row" style="cursor:default"><span class="ds-ic">🖼️</span><span class="ds-t">Фон<small id="dsBgNow">Сейчас: ' + esc(T.activeName()) + '</small></span><select id="dsBg" aria-label="Фон">' + opt + "</select></div>";
      h += '<div class="ds-row" style="cursor:default"><span class="ds-ic">✨</span><span class="ds-t">Анимация фона<small>Снег, листья, салют</small></span>' + sw("dsFx", T.fx()) + "</div>";
    }
    var ts = lsGet("domashka_text", "normal");
    h += '<div class="ds-row" style="cursor:default"><span class="ds-ic">🔠</span><span class="ds-t">Размер текста</span><select id="dsText" aria-label="Размер текста">' +
      '<option value="normal"' + (ts === "normal" ? " selected" : "") + '>Обычный</option>' +
      '<option value="large"' + (ts === "large" ? " selected" : "") + '>Крупный</option>' +
      '<option value="xl"' + (ts === "xl" ? " selected" : "") + ">Очень крупный</option></select></div>";
    h += "</div></div>";

    if(isStudent){
      h += '<div class="ds-sec"><h4>Уведомления</h4><div class="ds-list">';
      h += '<div class="ds-row" style="cursor:default"><span class="ds-ic">⏰</span><span class="ds-t">Напоминать о сроках сдачи<small>Плашка «сдать сегодня / завтра» на главном экране</small></span>' + sw("dsRem", remindersOn()) + "</div>";
      h += "</div></div>";
    }

    h += '<div class="ds-sec"><h4>Данные</h4><div class="ds-list">';
    h += row({ id:"dsExport", icon:"⬇️", title:"Скачать мои данные", sub:"Файл со всем, что приложение хранит о тебе" });
    if(blockedList().length) h += row({ id:"dsUnblock", icon:"🙈", title:"Скрытые пользователи", right:'<span class="ds-v">' + blockedList().length + "</span>" });
    h += row({ id:"dsCache", icon:"🧹", title:"Очистить кэш", sub:"Если что-то отображается неправильно" });
    h += "</div></div>";

    h += '<div class="ds-sec"><h4>Помощь и документы</h4><div class="ds-list">';
    h += row({ icon:"💬", title:"Поддержка", sub:CFG.supportEmail, href:"support.html", blank:true });
    h += row({ id:"dsBug", icon:"🐞", title:"Сообщить о проблеме" });
    h += row({ id:"dsIdea", icon:"💡", title:"Предложить идею", sub:"Что добавить или улучшить" });
    h += row({ id:"dsMine", icon:"📨", title:"Мои обращения", sub:"Ответы владельца" });
    h += row({ icon:"🔒", title:"Политика конфиденциальности", href:"privacy.html", blank:true });
    h += row({ icon:"📄", title:"Пользовательское соглашение", href:"terms.html", blank:true });
    h += "</div></div>";

    if(opts.isOwner && opts.isOwner()){
      h += '<div class="ds-sec"><h4>Владелец</h4><div class="ds-list">' + row({ id:"dsReports", icon:"📨", title:"Обращения пользователей", sub:"Проблемы, идеи и жалобы" }) + "</div></div>";
    }

    h += '<div class="ds-sec"><div class="ds-list">' + row({ id:"dsDelete", icon:"🗑️", title:"Удалить аккаунт", danger:true }) + "</div></div>";
    h += '<div class="ds-foot">' + esc(CFG.appName || "Домашка") + " · версия " + esc(CFG.appVersion || "1.0.0") + "<br>© " + new Date().getFullYear() + " " + esc(CFG.operatorName || "") + "</div>";

    sheet("dsMain", "Настройки", h);

    if($("dsEdit")) $("dsEdit").onclick = function(){ close("dsMain"); opts.onEditProfile(); };
    if($("dsPass")) $("dsPass").onclick = openPassword;
    $("dsLogout").onclick = logout;
    if($("dsBg")) $("dsBg").onchange = function(){ T.set(this.value); $("dsBgNow").textContent = "Сейчас: " + T.activeName(); };
    if($("dsFx")) $("dsFx").onchange = function(){ T.setFx(this.checked); };
    $("dsText").onchange = function(){ lsSet("domashka_text", this.value); applyTextSize(); };
    if($("dsRem")) $("dsRem").onchange = function(){ lsSet("domashka_reminders", this.checked ? "1" : "0"); if(opts.onRemindersChange) opts.onRemindersChange(this.checked); };
    $("dsExport").onclick = exportData;
    if($("dsUnblock")) $("dsUnblock").onclick = openBlocked;
    $("dsCache").onclick = clearCache;
    $("dsBug").onclick = function(){ report({ kind:"app" }); };
    $("dsIdea").onclick = function(){ report({ kind:"idea" }); };
    $("dsMine").onclick = openMine;
    unreadReplies().then(function(n){ var m = $("dsMine"); if(n && m && !$("dsMineDot")) m.querySelector(".ds-chev").insertAdjacentHTML("beforebegin", '<span id="dsMineDot" class="ds-v" style="background:var(--danger,#E8605C);color:#fff;border-radius:999px;padding:1px 8px">' + n + "</span>"); });
    if($("dsReports")) openCount().then(function(n){ var m = $("dsReports"); if(n && m) m.querySelector(".ds-chev").insertAdjacentHTML("beforebegin", '<span class="ds-v" style="background:var(--danger,#E8605C);color:#fff;border-radius:999px;padding:1px 8px">' + n + "</span>"); });
    if($("dsReports")) $("dsReports").onclick = openReports;
    $("dsDelete").onclick = openDelete;
  }

  /* ---------------- Пароль ---------------- */
  function openPassword(){
    sheet("dsSub", "Сменить пароль",
      '<label class="ds-lbl">Новый пароль</label><input class="ds-in" type="password" id="dsP1" autocomplete="new-password" placeholder="Минимум 6 символов">' +
      '<label class="ds-lbl">Повтори</label><input class="ds-in" type="password" id="dsP2" autocomplete="new-password">' +
      '<div class="ds-err" id="dsPErr"></div><button class="ds-btn" id="dsPGo">Сохранить</button>');
    $("dsPGo").onclick = async function(){
      var a = $("dsP1").value, b = $("dsP2").value, e = $("dsPErr");
      if(a.length < 6){ e.textContent = "Минимум 6 символов"; return; }
      if(a !== b){ e.textContent = "Пароли не совпадают"; return; }
      this.disabled = true;
      var r = await opts.sb.auth.updateUser({ password:a });
      this.disabled = false;
      if(r.error){ e.textContent = "Не получилось: " + r.error.message; return; }
      close("dsSub"); toast("Пароль изменён");
    };
  }

  /* ---------------- Выход ---------------- */
  function clearLocal(all){
    try{
      var keep = ["domashka_bg", "domashka_fx", "domashka_text"];
      Object.keys(localStorage).forEach(function(k){
        if(/^sb-|supabase|domashka/i.test(k) && (all || keep.indexOf(k) === -1)) localStorage.removeItem(k);
      });
      sessionStorage.clear();
    }catch(e){}
  }
  async function logout(){
    try{ await opts.sb.auth.signOut(); }catch(e){}
    clearLocal(false);
    location.href = opts.loginUrl;
  }

  /* ---------------- Удаление аккаунта ---------------- */
  function openDelete(){
    var isStudent = opts.role === "student";
    var what = isStudent
      ? "<li>вход в приложение, имя и фото профиля;</li><li>сданные работы и их файлы;</li><li>отметки «выполнено» и брони тем;</li><li>если ты вступил(а) в группу по заявке — запись в группе, оценки и посещаемость.</li>"
      : "<li>вход в приложение и профиль преподавателя;</li><li>литература и план курса, которые вы добавили.</li>";
    var stay = isStudent
      ? "Если твоё ФИО было в официальном списке группы, оно останется в журнале преподавателя, но без связи с аккаунтом."
      : "Задания, оценки и посещаемость, выставленные группам, остаются у студентов как учебные записи.";
    sheet("dsSub", "Удалить аккаунт",
      '<div class="ds-p"><b style="color:var(--danger,#E8605C)">Это нельзя отменить.</b> Будет удалено навсегда:<ul>' + what + "</ul><p style=\"margin-top:8px\">" + stay + "</p></div>" +
      '<label class="ds-lbl">' + esc(opts.passwordLabel || "Пароль от аккаунта") + '</label><input class="ds-in" type="password" id="dsDPass" autocomplete="current-password">' +
      '<label class="ds-lbl">Напиши слово УДАЛИТЬ</label><input class="ds-in" id="dsDWord" autocomplete="off" placeholder="УДАЛИТЬ">' +
      '<div class="ds-err" id="dsDErr"></div>' +
      '<button class="ds-btn red" id="dsDGo">Удалить навсегда</button><button class="ds-btn ghost" id="dsDNo">Отмена</button>');
    $("dsDNo").onclick = function(){ close("dsSub"); };
    $("dsDGo").onclick = async function(){
      var err = $("dsDErr"), btn = this, sb = opts.sb;
      err.textContent = "";
      if($("dsDWord").value.trim().toUpperCase() !== "УДАЛИТЬ"){ err.textContent = "Напиши слово УДАЛИТЬ"; return; }
      var pass = $("dsDPass").value;
      if(!pass){ err.textContent = "Введи " + (opts.passwordLabel || "пароль").toLowerCase(); return; }
      btn.disabled = true; btn.textContent = "Проверяем...";
      try{
        var u = await sb.auth.getUser();
        var user = u.data && u.data.user;
        if(!user){ throw new Error("Сначала войди в аккаунт"); }
        var chk = await sb.auth.signInWithPassword({ email:user.email, password:opts.passwordTransform ? opts.passwordTransform(pass) : pass });
        if(chk.error){ throw new Error("Неверный " + (opts.passwordLabel || "пароль").toLowerCase()); }

        btn.textContent = "Удаляем файлы...";
        if(isStudent){
          var folder = "sub/" + user.id;
          for(var guard = 0; guard < 20; guard++){
            var ls = await sb.storage.from("homework-files").list(folder, { limit:100 });
            if(ls.error || !ls.data || !ls.data.length) break;
            var paths = ls.data.filter(function(f){ return f.name && f.id !== null; }).map(function(f){ return folder + "/" + f.name; });
            if(!paths.length) break;
            var rm = await sb.storage.from("homework-files").remove(paths);
            if(rm.error) break;
          }
        }
        if(opts.beforeDelete){ try{ await opts.beforeDelete(user); }catch(e){} }

        btn.textContent = "Удаляем аккаунт...";
        var r = await sb.rpc("delete_my_account");
        if(r.error){
          var m = r.error.message || "";
          if(/owner_account/.test(m)) throw new Error("Аккаунт владельца удалить нельзя.");
          if(/delete_my_account|function/i.test(m)) throw new Error("Сервер ещё не обновлён. Напиши в поддержку: " + (CFG.supportEmail || ""));
          throw new Error(m);
        }
        try{ await sb.auth.signOut(); }catch(e){}
        clearLocal(true);
        location.href = opts.loginUrl + (opts.loginUrl.indexOf("?") === -1 ? "?" : "&") + "deleted=1";
      }catch(e){
        err.textContent = e.message || String(e);
        btn.disabled = false; btn.textContent = "Удалить навсегда";
      }
    };
  }

  /* ---------------- Мои данные ---------------- */
  async function exportData(){
    var sb = opts.sb, out = { app:CFG.appName, exported_at:new Date().toISOString() };
    try{
      var u = await sb.auth.getUser(); var user = u.data && u.data.user;
      if(!user){ toast("Сначала войди"); return; }
      out.account = { id:user.id, login:user.email, created_at:user.created_at };
      if(opts.role === "student"){
        var p = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle(); out.profile = p.data || null;
        var m = await sb.rpc("my_membership"); out.group = m.data || null;
        var j = await sb.rpc("my_journal"); out.grades_and_attendance = j.data || [];
        var s = await sb.from("submissions").select("homework_id,files,comment,submitted_at,score,teacher_comment").eq("student_id", user.id); out.submissions = s.data || [];
      } else {
        var t = await sb.from("teacher_profiles").select("*").eq("id", user.id).maybeSingle(); out.profile = t.data || null;
        var l = await sb.from("teacher_literature").select("*").eq("teacher_id", user.id); out.literature = l.data || [];
        var c = await sb.from("course_plan").select("*").eq("teacher_id", user.id); out.course_plan = c.data || [];
      }
      if(opts.extraExport){ try{ Object.assign(out, await opts.extraExport()); }catch(e){} }
    }catch(e){ out.error = String(e && e.message || e); }
    var blob = new Blob([JSON.stringify(out, null, 2)], { type:"application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "domashka-moi-dannye.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
    toast("Файл с данными скачан");
  }

  async function clearCache(){
    try{ if(window.caches){ var ks = await caches.keys(); await Promise.all(ks.map(function(k){ return caches.delete(k); })); } }catch(e){}
    try{
      Object.keys(localStorage).forEach(function(k){
        if(/^domashka/.test(k) && ["domashka_bg","domashka_fx","domashka_text","domashka_reminders","domashka_blocked"].indexOf(k) === -1 && !/greet/.test(k)) localStorage.removeItem(k);
      });
    }catch(e){}
    toast("Кэш очищен, перезагружаю...");
    setTimeout(function(){ location.reload(); }, 900);
  }

  /* ---------------- Напоминания ---------------- */
  function remindersOn(){ return lsGet("domashka_reminders", "1") === "1"; }

  /* ---------------- Скрытые пользователи ---------------- */
  function blockedList(){ try{ return JSON.parse(lsGet("domashka_blocked", "[]")) || []; }catch(e){ return []; } }
  function isBlocked(uid){ if(!uid) return false; return blockedList().some(function(b){ return b.id === uid; }); }
  function block(uid, name){
    if(!uid) return;
    var l = blockedList().filter(function(b){ return b.id !== uid; });
    l.push({ id:uid, name:name || "" }); lsSet("domashka_blocked", JSON.stringify(l));
    if(opts && opts.onBlockChange) opts.onBlockChange();
  }
  function unblock(uid){
    lsSet("domashka_blocked", JSON.stringify(blockedList().filter(function(b){ return b.id !== uid; })));
    if(opts && opts.onBlockChange) opts.onBlockChange();
  }
  function openBlocked(){
    var l = blockedList();
    var h = '<p class="ds-p">Их темы и имя скрыты только у тебя.</p>';
    l.forEach(function(b){ h += '<div class="ds-rep" style="display:flex;align-items:center;justify-content:space-between"><span>' + esc(b.name || "Пользователь") + '</span><button class="ds-mini" data-ub="' + esc(b.id) + '">Показать снова</button></div>'; });
    var ov = sheet("dsSub", "Скрытые пользователи", h);
    ov.querySelectorAll("[data-ub]").forEach(function(x){ x.onclick = function(){ unblock(x.getAttribute("data-ub")); x.closest(".ds-rep").remove(); toast("Готово"); }; });
  }

  /* ---------------- Обращения: жалоба / проблема / идея ---------------- */
  var REASONS = ["Оскорбление или травля", "Неприличное содержимое", "Спам или реклама", "Чужие личные данные", "Неверная информация", "Другое"];
  var KIND = { homework:"Жалоба на задание", topic:"Жалоба на тему", profile:"Жалоба на профиль", literature:"Жалоба на литературу", app:"Проблема", idea:"Идея", other:"Другое" };

  async function sendToOwner(ins){
    var sb = opts && opts.sb;
    if(!sb) return { error:{ message:"offline" } };
    var info = (opts.getInfo && opts.getInfo()) || {};
    var full = Object.assign({ reporter_name:(info.name || "").slice(0, 120) || null, reporter_role:opts.role }, ins);
    var r = await sb.from("content_reports").insert(full);
    if(r.error && /reporter_name|reporter_role|column/i.test(r.error.message || "")) r = await sb.from("content_reports").insert(ins);
    return r;
  }
  function mailFallback(subject, body){
    location.href = "mailto:" + encodeURIComponent(CFG.supportEmail || "") + "?subject=" + encodeURIComponent(subject + " — " + (CFG.appName || "Домашка")) + "&body=" + encodeURIComponent(body);
  }

  function report(o){
    o = o || {};
    var isApp = o.kind === "app", isIdea = o.kind === "idea", isFree = isApp || isIdea;
    var me = opts && opts.myId ? opts.myId() : null;
    var h = "";
    if(isIdea) h += '<p class="ds-p">Что добавить, что убрать, что неудобно? Идею прочитает владелец приложения и ответит тебе в «Настройки → Мои обращения».</p>';
    if(isApp) h += '<p class="ds-p">Сообщение придёт владельцу приложения. Ответ появится в «Настройки → Мои обращения».</p>';
    if(o.snapshot) h += '<div class="ds-rep">' + esc(String(o.snapshot).slice(0, 300)) + "</div>";
    if(!isFree){
      h += '<label class="ds-lbl">Что не так?</label>';
      REASONS.forEach(function(r, i){ h += '<label class="ds-radio"><input type="radio" name="dsReason" value="' + esc(r) + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(r) + "</span></label>"; });
    }
    var lbl = isIdea ? "Твоя идея" : isApp ? "Опиши проблему" : "Комментарий (необязательно)";
    var ph = isIdea ? "Например: добавить тёмную тему для журнала..." : isApp ? "Что случилось и на каком экране?" : "";
    h += '<label class="ds-lbl">' + lbl + '</label><textarea class="ds-in" id="dsRepText" maxlength="2000" placeholder="' + esc(ph) + '"></textarea>';
    if(o.userId && o.userId !== me) h += '<label class="ds-check"><input type="checkbox" id="dsRepBlock"><span>Скрыть от меня этого пользователя' + (o.userName ? " (" + esc(o.userName) + ")" : "") + "</span></label>";
    h += '<div class="ds-err" id="dsRepErr"></div><button class="ds-btn" id="dsRepGo">' + (isFree ? "Отправить" : "Пожаловаться") + "</button>";
    if(!isFree) h += '<p class="ds-p" style="font-size:.78rem">Жалобы проверяются в течение 24 часов. Нарушающее правила содержимое удаляется, а автора могут заблокировать.</p>';
    sheet("dsSub", o.title || (isIdea ? "💡 Предложить идею" : isApp ? "Сообщить о проблеме" : "Пожаловаться"), h);
    $("dsRepGo").onclick = async function(){
      var text = $("dsRepText").value.trim(), err = $("dsRepErr");
      var rr = document.querySelector('input[name="dsReason"]:checked');
      var reason = isIdea ? "Идея" : isApp ? "Проблема в приложении" : (rr ? rr.value : "Другое");
      if(isFree && text.length < 3){ err.textContent = isIdea ? "Напиши свою идею" : "Напиши пару слов о проблеме"; return; }
      this.disabled = true;
      var ins = { target_kind:o.kind || "other", target_id:o.id ? String(o.id) : null, target_user:o.userId || null,
                  snapshot:o.snapshot ? String(o.snapshot).slice(0, 2000) : null, reason:reason, comment:(text || "").slice(0, 2000) || null };
      if(isApp) ins.snapshot = (opts.role + " · " + navigator.userAgent).slice(0, 500);
      var r = await sendToOwner(ins);
      this.disabled = false;
      if($("dsRepBlock") && $("dsRepBlock").checked) block(o.userId, o.userName);
      if(r.error){
        if(/idea|check/i.test(r.error.message || "") && isIdea){
          // сервер ещё без «идей» — сохраним как «другое», чтобы не потерять
          ins.target_kind = "other"; r = await sendToOwner(ins);
        }
        if(r.error){ mailFallback(KIND[o.kind] || "Обращение", reason + "\n" + (text || "") + "\n\n" + (o.snapshot || "") + "\n" + (o.id ? "ID: " + o.id : "")); close("dsSub"); return; }
      }
      close("dsSub");
      toast(isIdea ? "Спасибо за идею! 💡" : isApp ? "Спасибо! Сообщение отправлено" : "Жалоба отправлена. Спасибо!");
    };
  }

  /* ---------------- Мои обращения (ответы владельца) ---------------- */
  function seenKey(){ return "domashka_inbox_seen_" + (opts && opts.role); }
  async function openMine(){
    var ov = sheet("dsSub", "📨 Мои обращения", '<p class="ds-p">Загрузка...</p>');
    var me = opts.myId && opts.myId();
    var q = opts.sb.from("content_reports").select("*");
    if(me) q = q.eq("reporter", me);
    var r = await q.order("created_at", { ascending:false }).limit(50);
    var body = ov.querySelector(".ds-body");
    if(r.error){ body.innerHTML = '<p class="ds-p">Не загрузилось: ' + esc(r.error.message) + "</p>"; return; }
    var list = r.data || [];
    var h = list.length ? "" : '<p class="ds-p">Ты пока ничего не отправлял(а).</p>';
    list.forEach(function(x){
      h += '<div class="ds-rep"><div class="ds-meta">' + esc(KIND[x.target_kind] || "Обращение") + " · " + new Date(x.created_at).toLocaleString("ru-RU") +
        " · " + (x.owner_reply ? "есть ответ" : x.status === "resolved" ? "рассмотрено" : "ждёт ответа") + "</div>" +
        (x.target_kind === "idea" || x.target_kind === "app" ? "" : "<b>" + esc(x.reason) + "</b>") +
        (x.comment ? "<div>" + esc(x.comment) + "</div>" : "") +
        (x.owner_reply ? '<div style="margin-top:8px;padding:9px 11px;border-radius:10px;background:rgba(142,182,155,.14)"><div class="ds-meta">Ответ владельца' +
          (x.replied_at ? " · " + new Date(x.replied_at).toLocaleString("ru-RU") : "") + "</div>" + esc(x.owner_reply) + "</div>" : "") + "</div>";
    });
    body.innerHTML = h;
    lsSet(seenKey(), new Date().toISOString());
    var dot = $("dsMineDot"); if(dot) dot.remove();
  }
  async function unreadReplies(){
    try{
      if(!opts || !opts.sb || !opts.myId || !opts.myId()) return 0;
      var since = lsGet(seenKey(), "1970-01-01T00:00:00Z");
      var r = await opts.sb.from("content_reports").select("id,replied_at").eq("reporter", opts.myId()).gt("replied_at", since);
      return (r.data || []).length;
    }catch(e){ return 0; }
  }
  async function checkReplies(){
    var n = await unreadReplies();
    if(n) toast("📨 Владелец ответил на твоё обращение — «Настройки → Мои обращения»");
    return n;
  }

  /* ---------------- Обращения — для владельца ---------------- */
  var inboxFilter = "all";
  async function openReports(){
    var ov = sheet("dsSub", "📨 Обращения", '<p class="ds-p">Загрузка...</p>');
    var r = await opts.sb.from("content_reports").select("*").order("created_at", { ascending:false }).limit(200);
    var body = ov.querySelector(".ds-body");
    if(r.error){ body.innerHTML = '<p class="ds-p">Не загрузилось: ' + esc(r.error.message) + "</p>"; return; }
    var all = r.data || [];
    function group(x){ return x.target_kind === "idea" ? "idea" : x.target_kind === "app" ? "app" : "report"; }
    var cnt = { all:0, app:0, idea:0, report:0 };
    all.forEach(function(x){ if(x.status === "open"){ cnt.all++; cnt[group(x)]++; } });
    var tabs = [["all","Все"],["app","🐞 Проблемы"],["idea","💡 Идеи"],["report","🚩 Жалобы"]];
    var h = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 4px">' + tabs.map(function(t){
      return '<button class="ds-mini" data-f="' + t[0] + '" style="' + (inboxFilter === t[0] ? "background:var(--accent,#4FD1A5);color:#06201C;border-color:transparent" : "") + '">' + t[1] + (cnt[t[0]] ? " · " + cnt[t[0]] : "") + "</button>";
    }).join("") + "</div>";
    h += '<p class="ds-p" style="font-size:.8rem">Открытых: <b>' + cnt.all + "</b>. На жалобы нужно реагировать в течение 24 часов (требование магазинов).</p>";
    var list = all.filter(function(x){ return inboxFilter === "all" || group(x) === inboxFilter; });
    if(!list.length) h += '<p class="ds-p">Пусто 🎉</p>';
    list.forEach(function(x){
      var who = (x.reporter_name || "Без имени") + (x.reporter_role === "teacher" ? " · преподаватель" : x.reporter_role === "student" ? " · студент" : "");
      h += '<div class="ds-rep" style="' + (x.status === "open" ? "" : "opacity:.6") + '"><div class="ds-meta">' + esc(KIND[x.target_kind] || x.target_kind) + " · " + esc(who) + " · " +
        new Date(x.created_at).toLocaleString("ru-RU") + (x.status === "open" ? "" : " · закрыто") + "</div>" +
        (group(x) === "report" ? "<b>" + esc(x.reason) + "</b>" : "") + (x.comment ? '<div style="white-space:pre-wrap">' + esc(x.comment) + "</div>" : "") +
        (x.snapshot ? '<div class="ds-meta" style="margin-top:4px">«' + esc(x.snapshot) + "»</div>" : "") +
        (x.owner_reply ? '<div style="margin-top:8px;padding:9px 11px;border-radius:10px;background:rgba(142,182,155,.14)"><div class="ds-meta">Твой ответ</div>' + esc(x.owner_reply) + "</div>" : "") +
        (x.reporter ? '<textarea class="ds-in" data-rtext="' + x.id + '" placeholder="' + (x.owner_reply ? "Изменить ответ..." : "Ответить автору...") + '" style="min-height:60px;margin-top:8px"></textarea>' : "") +
        '<div class="ds-acts">' +
        (x.reporter ? '<button class="ds-mini" data-reply="' + x.id + '">Ответить</button>' : "") +
        (x.target_kind === "topic" && x.target_id && x.status === "open" ? '<button class="ds-mini" data-deltopic="' + esc(x.target_id) + '" data-rid="' + x.id + '">Удалить тему</button>' : "") +
        (x.status === "open" ? '<button class="ds-mini" data-done="' + x.id + '">Закрыть</button>' : "") +
        "</div></div>";
    });
    body.innerHTML = h;
    async function resolve(id){ await opts.sb.from("content_reports").update({ status:"resolved", resolved_at:new Date().toISOString() }).eq("id", id); }
    body.querySelectorAll("[data-f]").forEach(function(b){ b.onclick = function(){ inboxFilter = b.getAttribute("data-f"); openReports(); }; });
    body.querySelectorAll("[data-done]").forEach(function(b){ b.onclick = async function(){ await resolve(b.getAttribute("data-done")); openReports(); }; });
    body.querySelectorAll("[data-reply]").forEach(function(b){ b.onclick = async function(){
      var id = b.getAttribute("data-reply"), ta = body.querySelector('[data-rtext="' + id + '"]'), t = ta ? ta.value.trim() : "";
      if(!t){ toast("Напиши ответ"); return; }
      var u = await opts.sb.from("content_reports").update({ owner_reply:t.slice(0, 2000), replied_at:new Date().toISOString(), status:"resolved", resolved_at:new Date().toISOString() }).eq("id", id);
      if(u.error){ toast("Не отправилось: " + u.error.message); return; }
      toast("Ответ отправлен"); openReports();
    }; });
    body.querySelectorAll("[data-deltopic]").forEach(function(b){ b.onclick = async function(){
      var d = await opts.sb.from("homework_topics").delete().eq("id", b.getAttribute("data-deltopic"));
      if(d.error){ toast("Не удалилось: " + d.error.message); return; }
      await resolve(b.getAttribute("data-rid")); toast("Тема удалена"); openReports();
    }; });
  }
  async function openCount(){
    try{ var r = await opts.sb.from("content_reports").select("id").eq("status", "open"); return (r.data || []).length; }catch(e){ return 0; }
  }

  /* ---------------- Меню «Ещё» ---------------- */
  function menu(title, list){
    var h = '<div class="ds-sec" style="margin-top:10px"><div class="ds-list">';
    list.forEach(function(it, i){
      h += row({ id:"dsMenu" + i, icon:it.icon, title:it.title, sub:it.sub, danger:it.danger,
        right:(it.badge ? '<span class="ds-v" style="background:var(--danger,#E8605C);color:#fff;border-radius:999px;padding:1px 8px">' + it.badge + "</span>" : "") + '<span class="ds-chev">›</span>' });
    });
    h += "</div></div>";
    sheet("dsMenu", title, h);
    list.forEach(function(it, i){ $("dsMenu" + i).onclick = function(){ close("dsMenu"); it.onClick && it.onClick(); }; });
  }

  window.DomashkaSettings = {
    init: function(o){ opts = o; injectCss(); },
    menu: menu,
    unreadReplies: unreadReplies,
    open: open,
    report: report,
    idea: function(){ report({ kind:"idea" }); },
    problem: function(){ report({ kind:"app" }); },
    mine: openMine,
    inbox: openReports,
    inboxCount: openCount,
    checkReplies: checkReplies,
    toast: toast,
    isBlocked: isBlocked,
    blockedList: blockedList,
    remindersOn: remindersOn
  };
})();
