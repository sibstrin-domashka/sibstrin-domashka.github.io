// Домашка — что собирать с сайта университета (и за сколько капч).
//
//   RUN_MODE=queue  (каждые 30 минут): только новые группы и только что
//                   вошедшие преподаватели из очереди scrape_queue. Если
//                   очередь пуста — браузер даже не открывается.
//   RUN_MODE=daily  (раз в день): группы, где есть хотя бы один студент,
//                   и вошедшие преподаватели (в дни TEACHERS_DAYS).
//                   По воскресеньям ещё обновляется список всех групп.
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

async function plan() {
  const queue = await sb("/rest/v1/scrape_queue?status=eq.pending&select=id,kind,name&order=requested_at");
  let groups = queue.filter(q => q.kind === "group").map(q => q.name);
  let teachers = queue.filter(q => q.kind === "teacher").map(q => q.name);
  let collectGroups = false;
  if (MODE === "daily") {
    const targets = await sb("/rest/v1/rpc/scrape_targets", { method: "POST", body: "{}" });
    groups = groups.concat(targets.filter(t => t.kind === "group").map(t => t.name));
    const tDays = (process.env.TEACHERS_DAYS || "1,4").split(",").map(Number);
    if (IS_MANUAL || tDays.indexOf(dow()) !== -1) teachers = teachers.concat(targets.filter(t => t.kind === "teacher").map(t => t.name));
    collectGroups = IS_MANUAL || dow() === 7;
  }
  return { queue, groups: uniq(groups), teachers: uniq(teachers), collectGroups };
}

function runNode(script, env) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], { stdio: "inherit", env: Object.assign({}, process.env, env) });
  return r.status === 0;
}

(async function main() {
  if (!SUPABASE_URL || !KEY) { console.error("Нужны SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
  const p = await plan();
  const hasWork = p.groups.length + p.teachers.length > 0 || p.collectGroups;
  console.log("Режим: " + MODE + " | группы: " + (p.groups.join(", ") || "—") + " | преподаватели: " + (p.teachers.join("; ") || "—") +
              (p.collectGroups ? " | + список всех групп" : ""));

  if (process.argv.indexOf("--check") !== -1) {
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "has_work=" + hasWork + "\n");
    if (!hasWork) console.log("Работы нет — браузер не запускаем, капчи не тратим.");
    return;
  }
  if (!hasWork) return;

  if (p.collectGroups) runNode("scrape-schedule.js", { COLLECT_GROUP_LIST: "1", TIMETABLE_GROUP_NAME: "" });

  const okGroups = {};
  for (const g of p.groups) {
    console.log("\n===== Группа " + g + " =====");
    okGroups[g] = runNode("scrape-schedule.js", { TIMETABLE_GROUP_NAME: g });
  }
  let teachersOk = true;
  if (p.teachers.length) {
    console.log("\n===== Преподаватели: " + p.teachers.join("; ") + " =====");
    // Группы, собранные целиком, преподавательский сбор не трогает.
    const active = await sb("/rest/v1/rpc/scrape_targets", { method: "POST", body: "{}" });
    const full = uniq(active.filter(t => t.kind === "group").map(t => t.name).concat(p.groups));
    teachersOk = runNode("scrape-lecturers.js", { LECTURER_APP_MODE: "1", TEACHER_NAMES: p.teachers.join("|"), SKIP_GROUPS: full.join(","), TEACHERS_DAYS: "" });
  }

  for (const q of p.queue) {
    const ok = q.kind === "group" ? okGroups[q.name] : teachersOk;
    await sb("/rest/v1/scrape_queue?id=eq." + q.id, {
      method: "PATCH", headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: ok ? "done" : "failed", done_at: new Date().toISOString() })
    });
  }
})().catch(function (e) { console.error(e); process.exit(1); });
