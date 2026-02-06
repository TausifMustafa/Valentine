const NAME = "Shonamma";
const PLAN_TEXT = "Valentine plan: flowers + food + show + cuddles 🍿📞";

document.getElementById("herName").textContent = NAME;
document.getElementById("dateIdea").textContent = PLAN_TEXT;

const herNameIntro = document.getElementById("herNameIntro");
if (herNameIntro) herNameIntro.textContent = NAME;

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

const intro = document.getElementById("intro");
const ask = document.getElementById("ask");
const proceedBtn = document.getElementById("proceed");
const skipHint = document.getElementById("skipHint");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");

function setStep(step) {
  [p1, p2, p3].forEach((el) => el && el.classList.remove("active"));
  if (step === 1 && p1) p1.classList.add("active");
  if (step === 2 && p2) p2.classList.add("active");
  if (step === 3 && p3) p3.classList.add("active");
}
setStep(1);

let noMoves = 0;

function popHearts(count = 20) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "-20px";
    h.style.animationDuration = (4 + Math.random() * 3) + "s";
    h.style.transform = "rotate(45deg) scale(" + (0.6 + Math.random() * 1.2) + ")";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 8000);
  }
}

yesBtn.addEventListener("click", () => {
  document.getElementById("ask").classList.add("hidden");
  document.getElementById("win").classList.remove("hidden");
  popHearts(48);
  setStep(3);
});

// playful “no” button: moves away
function moveNoButton() {
  noMoves++;

  const x = Math.random() * 260 - 130;
  const y = Math.random() * 160 - 80;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;

  if (noMoves >= 5) noBtn.textContent = "okay fine 🙈";
  if (noMoves >= 7) noBtn.textContent = "i’m kidding, click yes 😭";
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);

// --- typewriter animation ---
const letterEl = document.getElementById("letterText");

const TYPE_SPEED_MS = 18;
const START_DELAY_MS = 250;

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let fullLetter = (letterEl.innerHTML || "").trim();
fullLetter = fullLetter.replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/g, " ");
fullLetter = fullLetter.replace(/<[^>]*>/g, "");

fullLetter = fullLetter
  .replace(/\r\n/g, "\n")
  .replace(/[ \t]+\n/g, "\n")
  .replace(/\n[ \t]+/g, "\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

letterEl.innerHTML = "";
letterEl.classList.add("typing-caret");

let i = 0;
let typingDone = false;
let timerId = null;

function renderTyped(text) {
  letterEl.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
}

function typeStep() {
  i++;
  renderTyped(fullLetter.slice(0, i));

  if (i < fullLetter.length) {
    timerId = setTimeout(typeStep, TYPE_SPEED_MS);
  } else {
    typingDone = true;
    letterEl.classList.remove("typing-caret");
    if (skipHint) skipHint.textContent = "ok now click proceed 😌";
  }
}

setTimeout(typeStep, START_DELAY_MS);

// proceed button behavior:
// - if typing not finished: finish instantly
// - if finished: go to yes/no page
proceedBtn.addEventListener("click", () => {
  if (!typingDone) {
    if (timerId) clearTimeout(timerId);
    i = fullLetter.length;
    renderTyped(fullLetter);
    typingDone = true;
    letterEl.classList.remove("typing-caret");
    if (skipHint) skipHint.textContent = "ok now click proceed 😌";
    return;
  }

  intro.classList.add("hidden");
  ask.classList.remove("hidden");
  popHearts(14);
  setStep(2);
});
