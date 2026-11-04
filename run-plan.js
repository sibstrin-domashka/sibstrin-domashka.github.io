// Домашка — что собирать с сайта университета (и за сколько капч).
//
//   RUN_MODE=queue  (каждые 30 минут): только новые группы и только что
//                   вошедшие преподаватели из очереди scrape_queue. Если
//                   очередь пуста — браузер даже не открывается.
//   RUN_MODE=weekly (раз в неделю): все группы, где есть хотя бы один студент,
//                   все вошедшие преподаватели и список всех групп.
//                   (старое имя daily тоже работает)
//   После каждого запуска результат отправляется в Supabase (scraper_report):
//   если что-то сломалось — на экране владельца появится красное объявление.
//   node run-plan.js --check  — только сказать, есть ли работа (для workflow).
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MODE = process.env.RUN_MODE || "queue";
const IS_MANUAL = process.env.GITHUB_EVENT_NAME === "workflow_dispatch";

async function sb(p, opt) {
  opt = opt || {};
  const res = await fetch(SUPABASE_URL + p, Object.assign({}, opt, {
    headers: Object.assign({ apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, opt.headers || {})
  }));
  const t = await res.text();
  if (!res.ok) throw new Error(p + " -> " + res.status + ": " + t);
  return t ? JSON.parse(t) : null;
}
function dow() { return ((new Date().getDay() + 6) % 7) + 1; }   // 1 = понедельник
function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

// Почему не получилось — по тексту, который напечатал сборщик.
function classify(log) {
  if (/ZERO_BALANCE|недостаточно средств/i.test(log)) return ["no_balance", "На счёте rucaptcha закончились деньги — капчу нечем решать."];
  if (/Лимит платных капч/.test(log)) return ["budget", "Дневной лимит капч исчерпан (MAX_CAPTCHAS_PER_DAY). Остальное соберётся завтра."];
  if (/No RUCAPTCHA_KEY/.test(log)) return ["error", "Не задан ключ RUCAPTCHA_KEY в секретах GitHub."];
  if (/CAPTCHA_UNSOLVABLE|rucaptcha rejected|rucaptcha error|Gave up waiting for rucaptcha|couldn't find the smart-token/i.test(log))
    return ["captcha", "Капча на сайте вуза не решается — возможно, сайт сменил капчу."];
  if (/No Yandex SmartCaptcha sitekey found/i.test(log) && /Could not find a table/i.test(log))
    return ["protection", "Сайт вуза показывает что-то вместо расписания и это не известная капча — похоже на новую защиту."];
  if (/\b(403|429)\b|ERR_CONNECTION|ECONNRESET|ETIMEDOUT|Navigation timeout|net::ERR/i.test(log))
    return ["protection", "Сайт вуза не пускает сборщик (блокировка, ошибка 403/429 или не отвечает)."];
  if (/Could not find a table|doesn't recognise|classifyLines/i.test(log))
    return ["site_changed", "Страница расписания на сайте вуза изменилась — сборщик не узнаёт таблицу."];
  return ["error", "Сборщик завершился с ошибкой (подробности в журнале)."];
}
async function report(ok, kind, target, message, log) {
  try {
    await sb("/rest/v1/rpc/scraper_report", { method: "POST",
      body: JSON.stringify({ p_ok: ok, p_kind: kind || null, p_target: target || null, p_message: message || null, p_log: log ? String(log).slice(-4000) : null }) });
  } catch (e) { console.log("(не удалось отправить отчёт в Supabase: " + e.message + ")"); }
}

async function plan() {
  // Новые заявки + неудачные попытки (до 5 повторов).
  const queue = await sb("/rest/v1/scrape_queue?or=(status.eq.pending,and(status.eq.failed,attempts.lt.5))&select=id,kind,name,attempts&order=requested_at");
  let groups = queue.filter(q => q.kind === "group").map(q => q.name);
  let teachers = queue.filter(q => q.kind === "teacher").map(q => q.name);
  let collectGroups = false;
  if (MODE === "weekly" || MODE === "daily") {
    const targets = await sb("/rest/v1/rpc/scrape_targets", { method: "POST", body: "{}" });
    groups = groups.concat(targets.filter(t => t.kind === "group").map(t => t.name));
    teachers = teachers.concat(targets.filter(t => t.kind === "teacher").map(t => t.name));
    collectGroups = true;
  }
  return { queue, groups: uniq(groups), teachers: uniq(teachers), collectGroups };
}

// Запускает сборщик, показывает его вывод и запоминает текст для разбора ошибок.
function runNode(script, env) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], {
    env: Object.assign({}, process.env, env), encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
    stdio: ["inherit", "pipe", "pipe"]
  });
  const out = (r.stdout || "") + (r.stderr || "");
  process.stdout.write(r.stdout || ""); process.stderr.write(r.stderr || "");
  return { ok: r.status === 0, log: out, budget: r.status !== 0 && /Лимит платных капч/.test(out) };
}

(async function main() {
  if (!SUPABASE_URL || !KEY) { console.error("Нужны SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
  const p = await plan();
  const hasWork = p.groups.length + p.teachers.length > 0 || p.collectGroups;
  console.log("Режим: " + MODE + " | группы: " + (p.groups.join(", ") || "—") + " | преподаватели: " + (p.teachers.join("; ") || "—") +
              (p.collectGroups ? " | + список всех групп" : ""));

  if (process.argv.indexOf("--check") !== -1) {
    try { await sb("/rest/v1/rpc/scraper_heartbeat", { method: "POST", body: "{}" }); } catch (e) {}
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "has_work=" + hasWork + "\n");
    if (!hasWork) console.log("Работы нет — браузер не запускаем, капчи не тратим.");
    return;
  }
  if (!hasWork) return;

  const fails = [];
  if (p.collectGroups) {
    const r = runNode("scrape-schedule.js", { COLLECT_GROUP_LIST: "1", TIMETABLE_GROUP_NAME: "" });
    if (!r.ok) fails.push({ target: "список групп", r });
  }

  const res = {};
  for (const g of p.groups) {
    console.log("\n===== Группа " + g + " =====");
    res["group:" + g] = runNode("scrape-schedule.js", { TIMETABLE_GROUP_NAME: g });
    if (!res["group:" + g].ok) fails.push({ target: "группа " + g, r: res["group:" + g] });
  }
  let tr = { ok: true, log: "", budget: false };
  if (p.teachers.length) {
    console.log("\n===== Преподаватели: " + p.teachers.join("; ") + " =====");
    // Группы, собранные целиком, преподавательский сбор не трогает.
    const active = await sb("/rest/v1/rpc/scrape_targets", { method: "POST", body: "{}" });
    const full = uniq(active.filter(t => t.kind === "group").map(t => t.name).concat(p.groups));
    tr = runNode("scrape-lecturers.js", { LECTURER_APP_MODE: "1", TEACHER_NAMES: p.teachers.join("|"), SKIP_GROUPS: full.join(","), TEACHERS_DAYS: "" });
    if (!tr.ok) fails.push({ target: "преподаватели: " + p.teachers.slice(0, 5).join("; "), r: tr });
  }

  for (const q of p.queue) {
    const r = q.kind === "group" ? res["group:" + q.name] : tr;
    if (!r) continue;
    const patch = r.ok ? { status: "done", done_at: new Date().toISOString() }
      : r.budget ? { status: "pending" }                                    // лимит капч — просто подождём до завтра
      : { status: "failed", attempts: (q.attempts || 0) + 1, done_at: new Date().toISOString() };
    await sb("/rest/v1/scrape_queue?id=eq." + q.id, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
  }

  if (!fails.length) { await report(true, null, MODE, "Всё собрано: групп " + p.groups.length + ", преподавателей " + p.teachers.length); return; }
  for (const f of fails.slice(0, 5)) {
    const c = classify(f.r.log);
    console.log("\n!!! " + f.target + ": " + c[1]);
    await report(false, c[0], f.target, c[1], f.r.log);
  }
  process.exitCode = 1;
})().catch(function (e) { console.error(e); process.exit(1); });
