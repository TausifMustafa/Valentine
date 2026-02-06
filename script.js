// Config
const NAME = "Shonamma";
const PLAN_TEXT = "Valentine plan: flowers + food + show + cuddles 🍿❤️";

// DOM refs
const card = document.getElementById("card");
const intro = document.getElementById("intro");
const ask = document.getElementById("ask");
const win = document.getElementById("win");

const stepDots = document.getElementById("stepDots");
const dots = stepDots ? Array.from(stepDots.querySelectorAll(".dot")) : [];

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const proceedBtn = document.getElementById("proceed");
const skipHint = document.getElementById("skipHint");

// Inject names + plan text
document.getElementById("herName").textContent = NAME;
document.getElementById("dateIdea").textContent = PLAN_TEXT;
const herNameIntro = document.getElementById("herNameIntro");
if (herNameIntro) herNameIntro.textContent = NAME;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Screen routing + step dots
function setActiveStep(stepIndex) {
  dots.forEach((d, i) => d.classList.toggle("active", i === stepIndex));
}

function reveal(el) {
  el.classList.remove("reveal");
  void el.offsetWidth; // reflow to restart animation
  el.classList.add("reveal");
}

function showScreen(which) {
  [intro, ask, win].forEach((el) => el.classList.add("hidden"));
  which.classList.remove("hidden");
  reveal(which);

  if (which === intro) setActiveStep(0);
  if (which === ask) setActiveStep(1);
  if (which === win) setActiveStep(2);
}

showScreen(intro);

// Hearts burst
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

// Playful “no” button dodge
let noMoves = 0;

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

// Typewriter (intro letter)
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

// Proceed: finish typing OR advance to ask
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

  showScreen(ask);
  popHearts(12);
});

// Yes: advance to win
yesBtn.addEventListener("click", () => {
  showScreen(win);
  popHearts(40);
});

// Parallax tilt (subtle)
if (!reduceMotion && card && card.dataset.tilt === "true") {
  const maxRot = 6;
  let raf = null;

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const ry = (px - 0.5) * (maxRot * 2);
    const rx = (0.5 - py) * (maxRot * 2);

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.classList.add("tilting");
      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    });
  }

  function onLeave() {
    card.classList.remove("tilting");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }

  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", onLeave);
}

// Sparkle trail on button hover + small burst on click
function attachSparkles(btn) {
  if (!btn || reduceMotion) return;

  let last = 0;

  btn.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - last < 28) return;
    last = now;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = document.createElement("span");
    s.className = "sparkle";
    const size = 6 + Math.random() * 10;

    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;

    btn.appendChild(s);
    setTimeout(() => s.remove(), 700);
  });

  btn.addEventListener("click", () => {
    for (let k = 0; k < 6; k++) {
      const rect = btn.getBoundingClientRect();
      const s = document.createElement("span");
      s.className = "sparkle";
      const size = 7 + Math.random() * 12;

      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${rect.width * (0.25 + Math.random() * 0.5)}px`;
      s.style.top = `${rect.height * (0.25 + Math.random() * 0.5)}px`;

      btn.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  });
}

attachSparkles(proceedBtn);
attachSparkles(yesBtn);

// Falling petals (decorative)
const petalsLayer = document.getElementById("petals");

function spawnPetal() {
  if (!petalsLayer) return;
  if (petalsLayer.childElementCount > 120) return;

  const p = document.createElement("span");
  p.className = "petal";

  const size = 14 + Math.random() * 18; // 14..32
  const h = size * (1.15 + Math.random() * 0.35);

  p.style.width = `${size}px`;
  p.style.height = `${h}px`;
  p.style.left = `${Math.random() * 100}vw`;

  const dur = 6 + Math.random() * 7; // 6..13s
  p.style.animationDuration = `${dur}s`;

  const drift = (Math.random() * 220 - 110).toFixed(0);
  p.style.setProperty("--drift", `${drift}px`);

  const rot = (Math.random() * 1100 - 550).toFixed(0);
  p.style.setProperty("--rot", `${rot}deg`);

  const op = (0.62 + Math.random() * 0.28).toFixed(2);
  p.style.setProperty("--op", op);

  petalsLayer.appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

if (!reduceMotion) {
  setInterval(() => {
    spawnPetal();
    if (Math.random() < 0.6) spawnPetal();
  }, 120);

  for (let k = 0; k < 28; k++) setTimeout(spawnPetal, k * 70);
}
