// --- customize these ---
const NAME = "Shonamma";
const PLAN_TEXT = "Valentine plan: flowers + food + show + cuddles 🍿📞";
// ------------------------

document.getElementById("herName").textContent = NAME;
document.getElementById("dateIdea").textContent = PLAN_TEXT;

// intro name (same as main)
const herNameIntro = document.getElementById("herNameIntro");
if (herNameIntro) herNameIntro.textContent = NAME;

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

let noMoves = 0;

function popHearts(count = 20) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "-20px";
    h.style.animationDuration = (4 + Math.random() * 3) + "s";
    h.style.transform =
      "rotate(45deg) scale(" + (0.6 + Math.random() * 1.2) + ")";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 8000);
  }
}

yesBtn.addEventListener("click", () => {
  document.getElementById("ask").classList.add("hidden");
  document.getElementById("win").classList.remove("hidden");
  popHearts(40);
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

// --- intro letter screen logic ---
const intro = document.getElementById("intro");
const ask = document.getElementById("ask");
const proceedBtn = document.getElementById("proceed");
const skipHint = document.getElementById("skipHint");

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

// normalize whitespace/newlines so formatting/indentation doesn't create huge gaps
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
  popHearts(12);
});
