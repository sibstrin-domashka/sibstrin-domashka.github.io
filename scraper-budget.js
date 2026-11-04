// Экономия на капче.
// 1) Постоянный профиль браузера: после одной решённой капчи сайт ставит
//    cookie, и следующие страницы / запуски проходят без новой капчи, пока
//    сайт сам не попросит её снова.
// 2) Дневной лимит платных капч: больше MAX_CAPTCHAS_PER_DAY (по умолчанию 6)
//    в rucaptcha не отправляем — деньги не утекут, даже если что-то сломается.
const fs = require("fs");
const path = require("path");
const os = require("os");

const PROFILE_DIR = process.env.SCRAPER_PROFILE_DIR || path.join(os.homedir(), ".domashka-scraper-profile");
const MAX = parseInt(process.env.MAX_CAPTCHAS_PER_DAY || "6", 10);

function counterFile() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  return path.join(PROFILE_DIR, "captcha-" + new Date().toISOString().slice(0, 10) + ".txt");
}
function used() {
  try { return parseInt(fs.readFileSync(counterFile(), "utf8"), 10) || 0; } catch (e) { return 0; }
}
function take() {
  var n = used();
  if (n >= MAX) {
    console.log("Лимит платных капч на сегодня исчерпан (" + n + "/" + MAX + ") — в rucaptcha не отправляю. " +
                "Поднять лимит: переменная MAX_CAPTCHAS_PER_DAY.");
    return false;
  }
  fs.writeFileSync(counterFile(), String(n + 1));
  console.log("Платная капча " + (n + 1) + " из " + MAX + " за сегодня.");
  return true;
}
module.exports = { PROFILE_DIR: PROFILE_DIR, take: take, used: used, MAX: MAX };
