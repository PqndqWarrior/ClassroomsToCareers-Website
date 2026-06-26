const app = document.querySelector("#pathfinder-app");
const introTemplate = document.querySelector("#intro-template");

const questions = [
  {
    title: "What do you most enjoy doing in your free time?",
    options: [
      ["🔨", "Building and making things", { stem: 2 }],
      ["❤️", "Helping and caring for people", { healthcare: 2 }],
      ["📊", "Planning, organizing, and leading", { business: 2 }],
      ["🔍", "Researching and figuring things out", { stem: 1, healthcare: 1 }]
    ]
  },
  {
    title: "Do you enjoy speaking and sharing ideas with others?",
    options: [
      ["🎤", "Yes — I love presenting and persuading", { business: 2 }],
      ["👥", "One-on-one conversations, yes", { healthcare: 2 }],
      ["⌨️", "I prefer to show through my work", { stem: 2 }],
      ["🌱", "I want to grow in this", { business: 1, stem: 1 }]
    ]
  },
  {
    title: "When someone around you is stressed, what do you naturally do?",
    options: [
      ["🤝", "Stop and listen carefully", { healthcare: 2 }],
      ["💡", "Jump in and help fix the problem", { stem: 2, business: 1 }],
      ["📣", "Rally people together to solve it", { business: 2 }],
      ["🧘", "Give them space and check back later", { healthcare: 1, stem: 1 }]
    ]
  },
  {
    title: "Which sounds most like your ideal workday?",
    options: [
      ["💻", "Solving technical problems on a screen", { stem: 2 }],
      ["🏥", "Working directly with patients or people", { healthcare: 2 }],
      ["📈", "Pitching ideas, running meetings, making deals", { business: 2 }],
      ["🔬", "Running experiments and testing hypotheses", { stem: 2, healthcare: 1 }]
    ]
  },
  {
    title: "What would make you feel proudest at the end of a workday?",
    options: [
      ["🏗️", "I shipped something I built that works", { stem: 2 }],
      ["🩺", "I helped someone feel better or safer", { healthcare: 2 }],
      ["🤝", "I closed a deal or grew something", { business: 2 }],
      ["📚", "I learned something totally new", { stem: 1, business: 1, healthcare: 1 }]
    ]
  }
];

const matches = {
  healthcare: {
    title: "Healthcare — Nursing",
    icon: "🩺",
    description: "You notice people, listen closely, and stay useful when something feels uncertain. That combination is at the heart of patient care.",
    intro: "Step into a hospital room and act as Maya’s nurse. The patient, monitor, chart, and bed are all interactive."
  },
  business: {
    title: "Business — Startup Founder",
    icon: "📈",
    description: "You organize ideas, communicate clearly, and naturally look for momentum. Those instincts help turn a possibility into something real.",
    intro: "Enter the pitch room as the founder. Use the market board, traction dashboard, and funding plan to win investor interest."
  },
  stem: {
    title: "STEM — Software Engineer",
    icon: "💻",
    description: "You like finding patterns, testing possibilities, and making things work. That’s the mindset behind thoughtful engineering.",
    intro: "Sit down at the developer workstation. Inspect the bug, edit the code, and prove your fix with the test console."
  }
};

const simulations = {
  healthcare: {
    role: "Nurse",
    objective: "Safely stabilize Maya after she becomes dizzy.",
    prompt: "Click objects in the hospital room to complete the care sequence.",
    steps: [
      { action: "patient", label: "Talk to Maya", instruction: "Start by checking in with your patient.", success: "You introduced yourself, kept Maya calm, and learned that she felt dizzy when she stood up." },
      { action: "monitor", label: "Check vital signs", instruction: "Now gather objective information.", success: "Vitals checked: her blood pressure is low and her heart rate is elevated." },
      { action: "bed", label: "Adjust the bed", instruction: "Use what you learned to make Maya safer.", success: "You reclined Maya and raised her legs. Her dizziness begins to settle." }
    ],
    wrong: [
      { chart: "The chart matters, but Maya is awake and worried. Check in with her first.", monitor: "Before touching equipment, introduce yourself and ask Maya what happened.", bed: "Changing the bed without explaining could frighten her.", door: "Leaving now would delay care." },
      { patient: "You have Maya’s story. Now collect objective information.", chart: "The chart can wait until you know what is happening right now.", bed: "You need vital signs before choosing the safest position.", door: "Stay with your patient while you assess her." },
      { patient: "Maya has explained her symptoms.", monitor: "You already have the numbers. Respond to them now.", chart: "Her low blood pressure needs a safety action first.", door: "Do not leave a dizzy patient sitting upright." }
    ]
  },
  business: {
    role: "Startup founder",
    objective: "Earn investor interest with a clear, evidence-backed pitch.",
    prompt: "Use the materials in the pitch room to build your case.",
    steps: [
      { action: "market", label: "Frame the problem", instruction: "Give the investors a reason to care.", success: "You showed a specific customer problem and a $4B market opportunity." },
      { action: "traction", label: "Prove traction", instruction: "Back your story with evidence.", success: "You shared 200 beta users and 40% weekly retention. The investors lean in." },
      { action: "ask", label: "Make the ask", instruction: "Close with a precise next step.", success: "You asked for $250K, explained the 18-month runway, and tied it to clear milestones." }
    ],
    wrong: [
      { investors: "They are listening—but first, show them something concrete.", traction: "Numbers need context. Explain the problem and market first.", ask: "An ask without context feels premature.", snacks: "A snack break will not open the pitch." },
      { investors: "A strong claim needs evidence. Show real customer behavior.", market: "The problem is clear. What proves people want the solution?", ask: "Build credibility before asking for money.", snacks: "Stay in the room—the investors are waiting for proof." },
      { investors: "They are ready for a concrete next step.", market: "The market case is already established.", traction: "Your traction landed. Now close clearly.", snacks: "Almost there. Finish the pitch first." }
    ]
  },
  stem: {
    role: "Software engineer",
    objective: "Fix the empty-form crash and ship a safe solution.",
    prompt: "Inspect the developer workspace and complete the debugging loop.",
    steps: [
      { action: "report", label: "Read the bug report", instruction: "Reproduce and understand the problem first.", success: "You found the failure: calling trim() when the name field is empty." },
      { action: "editor", label: "Add validation", instruction: "Fix the root cause in the code.", success: "You added an input guard before submission. Empty values no longer reach the handler." },
      { action: "tests", label: "Run the tests", instruction: "Prove the fix before shipping.", success: "All tests pass—including the new empty-name case. The fix is ready to ship." }
    ],
    wrong: [
      { editor: "Changing code before understanding the failure can create a second bug.", tests: "First identify exactly what is failing.", deploy: "Shipping now could send the crash to every user.", coffee: "Tempting, but the bug report is waiting." },
      { report: "You understand the failure. Fix the root cause now.", tests: "The failing behavior is known; make the targeted code change first.", deploy: "The crash is still present.", coffee: "The code needs one focused fix first." },
      { report: "You already reproduced and understood the bug.", editor: "The validation fix is in place. Verify it before shipping.", deploy: "Professional engineers test before they deploy.", coffee: "One test run, then coffee." }
    ]
  }
};

let state = {
  screen: "intro",
  question: 0,
  selected: null,
  surveyScores: { healthcare: 0, business: 0, stem: 0 },
  track: null,
  step: 0,
  completed: [],
  stepMistakes: 0,
  gameScore: 0,
  feedback: null,
  simStarted: false,
  moving: false
};

const requestedTrack = new URLSearchParams(window.location.search).get("track");
if (requestedTrack && simulations[requestedTrack]) {
  state.screen = "result";
  state.track = requestedTrack;
}

function reset() {
  state = {
    screen: "intro", question: 0, selected: null,
    surveyScores: { healthcare: 0, business: 0, stem: 0 },
    track: null, step: 0, completed: [], stepMistakes: 0, gameScore: 0, feedback: null, simStarted: false, moving: false
  };
  render();
}

function transition(next) {
  const current = app.querySelector(".screen");
  if (current) current.classList.add("exit");
  window.setTimeout(() => { state.screen = next; render(); }, 240);
}

function renderProgress(current, total, label = "Discovery") {
  const percent = Math.round((current / total) * 100);
  return `<div class="progress-wrap">
    <div class="progress-meta"><span>${label}</span><span>${current} / ${total}</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
  </div>`;
}

function renderIntro() {
  app.replaceChildren(introTemplate.content.cloneNode(true));
}

function renderQuestion() {
  const question = questions[state.question];
  app.innerHTML = `<div class="screen">
    ${renderProgress(state.question + 1, questions.length)}
    <div class="question-card">
      <p class="question-number">Question ${state.question + 1}</p>
      <h2>${question.title}</h2>
      <div class="options-grid">
        ${question.options.map((option, index) => `<button class="option ${state.selected === index ? "selected" : ""}" style="animation-delay:${index * 80}ms" data-option="${index}" aria-pressed="${state.selected === index}" type="button">
          <span class="emoji">${option[0]}</span>${option[1]}<i class="check" aria-hidden="true">✓</i>
        </button>`).join("")}
      </div>
      <div class="question-actions"><small>Choose what feels most natural.</small><button class="primary-action" data-action="next-question" ${state.selected === null ? "disabled" : ""} type="button">${state.question === 4 ? "Reveal my match" : "Next question"} <b>→</b></button></div>
    </div>
  </div>`;
}

function chooseWinner() {
  const order = ["healthcare", "business", "stem"];
  return order.reduce((winner, track) => state.surveyScores[track] > state.surveyScores[winner] ? track : winner, order[0]);
}

function renderResult() {
  const match = matches[state.track];
  app.innerHTML = `<div class="screen result-layout">
    <div class="result-copy">
      <p class="match-label">Your strongest match</p>
      <h2>You’re wired to<br><em>make an impact.</em></h2>
      <p>${match.description}</p>
    </div>
    <div class="result-card ${state.track}">
      <div>
        <div class="result-icon">${match.icon}</div>
        <h2 id="typed-match" aria-label="${match.title}"></h2>
        <p>${match.intro}</p>
      </div>
      <button class="primary-action" data-action="start-game" type="button">Play the simulation <b>→</b></button>
    </div>
  </div>`;
  typeText(document.querySelector("#typed-match"), match.title, 20);
}

function typeText(element, text, speed, callback) {
  if (!element) return;
  let index = 0;
  element.textContent = "";
  const timer = window.setInterval(() => {
    index += 1;
    element.textContent = text.slice(0, index);
    if (index >= text.length) {
      window.clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
}

function taskProgress() {
  return `<div class="simulation-score">
    <div class="score-line"><strong>SCORE.</strong><span>${state.gameScore} / 150 pts</span></div>
    <div class="score-rail"><i style="width:${(state.completed.length / 3) * 100}%"></i></div>
    <div class="task-avatars">${[0, 1, 2].map((index) => `<span class="${index < state.completed.length ? "done" : index === state.step ? "current" : ""}">${index < state.completed.length ? "✓" : index + 1}</span>`).join("")}</div>
  </div>`;
}

function hotspot(action, label, content, extra = "") {
  const done = state.completed.includes(action);
  return `<button class="scene-hotspot hotspot-${action} ${done ? "completed" : ""} ${extra}" data-sim-action="${action}" type="button" aria-label="${label}">
    ${content}<span class="hotspot-label">${done ? "Completed" : label}</span>
  </button>`;
}

function renderHealthcareScene() {
  const talked = state.completed.includes("patient");
  const checked = state.completed.includes("monitor");
  const adjusted = state.completed.includes("bed");
  return `<div class="career-scene hospital-scene ${adjusted ? "bed-adjusted" : ""}">
    <div class="room-window"><i></i><i></i><i></i></div>
    <div class="iv-pole"><i></i><span></span></div>
    ${hotspot("door", "Leave room", '<span class="door-shape">EXIT</span>', "decoy")}
    ${hotspot("chart", "Review chart", '<span class="chart-shape">MAYA<br><i>Room 204</i></span>', "decoy")}
    ${hotspot("monitor", "Check monitor", `<span class="monitor-shape"><i>${checked ? "112" : "--"}</i><b>${checked ? "88/58" : "VITALS"}</b><svg viewBox="0 0 120 35" aria-hidden="true"><polyline points="0,22 18,22 25,6 35,31 47,17 58,22 120,22"/></svg></span>`)}
    <div class="bed-visual"><span class="bed-shape"><i class="pillow"></i><i class="blanket"></i><i class="rail"></i><b class="wheel w1"></b><b class="wheel w2"></b></span></div>
    ${hotspot("bed", "Use bed controls", '<span class="bed-control"><b>BED</b><i>↑</i><i>↓</i></span>')}
    ${hotspot("patient", "Talk to Maya", `<span class="patient-shape"><i class="head">👧🏽</i><i class="body"></i>${talked ? '<b class="speech-note">“I got dizzy when I stood up.”</b>' : ""}</span>`)}
    <div class="nurse-avatar"><span>👩🏽‍⚕️</span><b>You</b></div>
  </div>`;
}

function renderBusinessScene() {
  const market = state.completed.includes("market");
  const traction = state.completed.includes("traction");
  const ask = state.completed.includes("ask");
  return `<div class="career-scene pitch-scene">
    <div class="pitch-wall"><span>SEED ROUND · 10:00 AM</span></div>
    <div class="investor-avatar investor-a"><span>🧑🏽‍💼</span><b>Jordan</b></div>
    <div class="investor-avatar investor-b"><span>👩🏻‍💼</span><b>Avery</b></div>
    ${hotspot("investors", "Talk without evidence", '<span class="speech-cloud">Convince us.</span>', "decoy")}
    ${hotspot("market", "Show market board", `<span class="market-board"><b>$4B</b><i>${market ? "Clear problem" : "MARKET"}</i></span>`)}
    ${hotspot("traction", "Open traction dashboard", `<span class="traction-laptop"><i></i><b>${traction ? "40% retention" : "TRACTION"}</b><em></em></span>`)}
    ${hotspot("ask", "Present funding plan", `<span class="ask-folder"><b>${ask ? "$250K" : "THE ASK"}</b><i>18-month plan</i></span>`)}
    ${hotspot("snacks", "Take a snack break", '<span class="snack-shape">☕</span>', "decoy")}
    <div class="founder-avatar"><span>🧑🏾‍💻</span><b>You</b></div>
  </div>`;
}

function renderStemScene() {
  const report = state.completed.includes("report");
  const editor = state.completed.includes("editor");
  const tests = state.completed.includes("tests");
  return `<div class="career-scene dev-scene">
    <div class="dev-window"><span>ENGINEERING · BUG #104</span></div>
    ${hotspot("report", "Read bug report", `<span class="bug-report"><b>BUG #104</b><i>${report ? "Cause found: empty name" : "Form crashes on submit"}</i></span>`)}
    ${hotspot("editor", "Edit validation code", `<span class="editor-screen"><i>function submit(name) {</i><b>${editor ? "if (!name?.trim()) return;" : "// validation missing"}</b><i>send(name); }</i></span>`)}
    ${hotspot("tests", "Run test suite", `<span class="test-console"><b>${tests ? "✓ 12 tests passed" : "RUN TESTS ▶"}</b><i>${tests ? "Ready to ship" : "0 / 12"}</i></span>`)}
    ${hotspot("deploy", "Deploy immediately", '<span class="deploy-button">DEPLOY</span>', "decoy")}
    ${hotspot("coffee", "Grab coffee", '<span class="coffee-shape">☕</span>', "decoy")}
    <div class="developer-avatar"><span>🧑🏻‍💻</span><b>You</b></div>
  </div>`;
}

function renderGame() {
  const simulation = simulations[state.track];
  const step = simulation.steps[state.step];
  const scene = state.track === "healthcare" ? renderHealthcareScene() : state.track === "business" ? renderBusinessScene() : renderStemScene();
  app.innerHTML = `<div class="screen ${state.track}-game simulation-screen">
    <div class="world-hud">
      <div class="world-title"><span>${simulation.role} simulation</span><strong>${simulation.objective}</strong></div>
      <button class="sound-orb" type="button" aria-label="Sound effects">♪</button>
    </div>
    <div class="world-viewport ${state.track}-world scene-step-${state.step} ${state.moving ? "world-moving" : ""}">
      <div class="world-sky"><i></i><i></i><i></i></div>
      <div class="world-ground"></div>
      <div class="world-scene">${scene}</div>
      <div class="chapter-dots">${[0,1,2].map(index => `<i class="${index <= state.step ? "active" : ""} ${index < state.completed.length ? "done" : ""}"></i>`).join("")}</div>
      ${!state.simStarted ? `<div class="world-dialog welcome-dialog">
        <p>Welcome to your shift</p><h2>${simulation.role}</h2><span>${simulation.prompt}</span>
        <button class="world-button" data-action="enter-simulation" type="button">Enter the simulation <b>→</b></button>
      </div>` : `<div class="world-dialog mission-dialog ${state.feedback ? (state.feedback.correct ? "dialog-success" : "dialog-miss") : ""}">
        <div class="dialog-step"><span>${state.feedback?.correct ? "TASK COMPLETE" : `STEP ${state.step + 1} OF 3`}</span><b>${state.gameScore} / 150</b></div>
        <h2>${state.feedback ? (state.feedback.correct ? step.label : "Try another move") : step.instruction}</h2>
        <p>${state.feedback ? state.feedback.text : "Explore the scene and click the right station to act."}</p>
        ${state.feedback?.correct ? `<div class="moving-label">Moving to the next station…</div>` : ""}
      </div>`}
    </div>
  </div>`;
}

function renderEnd() {
  const score = state.gameScore;
  const medal = score >= 140 ? "🏆" : score >= 90 ? "🥈" : "🌱";
  const title = score >= 140 ? "Natural instincts." : score >= 90 ? "Strong first shift." : "Curiosity unlocked.";
  const message = score >= 140 ? "You made confident, evidence-based choices under pressure. This path is worth exploring." : score >= 90 ? "You showed real potential and learned from each decision. That is how career confidence grows." : "A career path is something you practice, not something you magically know. You just took the first step.";
  app.innerHTML = `<div class="screen"><div class="end-card">
    <div class="medal">${medal}</div>
    <div class="final-score"><span id="final-score">0</span><small> / 150</small></div>
    <h2>${title}</h2><p>${message}</p>
    <div class="end-actions"><a class="primary-action" href="./explore/?track=${state.track}">Explore this career <b>→</b></a><button class="secondary-action" data-action="restart" type="button">Try again</button></div>
  </div></div>`;
  countTo(document.querySelector("#final-score"), score, 800);
}

function countTo(element, target, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function selectSimulationAction(action) {
  const simulation = simulations[state.track];
  const step = simulation.steps[state.step];
  if (state.completed.includes(action)) {
    state.feedback = { correct: false, text: simulation.wrong[state.step]?.[action] || "You already completed that action." };
    renderGame();
    return;
  }
  if (action !== step.action) {
    state.stepMistakes += 1;
    state.feedback = { correct: false, text: simulation.wrong[state.step]?.[action] || "That action is useful, but not at this moment." };
    renderGame();
    return;
  }

  const points = Math.max(30, 50 - state.stepMistakes * 10);
  state.completed.push(action);
  state.gameScore += points;
  state.feedback = { correct: true, points, text: step.success };
  state.stepMistakes = 0;
  state.moving = true;
  renderGame();

  window.setTimeout(() => {
    if (state.step < simulation.steps.length - 1) {
      state.step += 1;
      state.feedback = null;
      state.moving = false;
      renderGame();
    } else {
      transition("end");
    }
  }, 1700);
}

function render() {
  if (state.screen === "intro") renderIntro();
  if (state.screen === "question") renderQuestion();
  if (state.screen === "result") renderResult();
  if (state.screen === "game") renderGame();
  if (state.screen === "end") renderEnd();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

app.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const optionButton = event.target.closest("[data-option]");
  const simulationButton = event.target.closest("[data-sim-action]");

  if (action === "begin") transition("question");
  if (action === "restart") reset();
  if (action === "start-game") transition("game");
  if (action === "enter-simulation") {
    state.simStarted = true;
    renderGame();
  }
  if (optionButton) {
    state.selected = Number(optionButton.dataset.option);
    renderQuestion();
  }
  if (action === "next-question" && state.selected !== null) {
    const points = questions[state.question].options[state.selected][2];
    Object.entries(points).forEach(([track, value]) => { state.surveyScores[track] += value; });
    if (state.question < questions.length - 1) {
      state.question += 1;
      state.selected = null;
      transition("question");
    } else {
      state.track = chooseWinner();
      transition("result");
    }
  }
  if (simulationButton) selectSimulationAction(simulationButton.dataset.simAction);
});

document.querySelector("#restart-top").addEventListener("click", reset);
render();
