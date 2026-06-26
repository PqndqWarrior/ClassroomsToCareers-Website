const careers = {
  healthcare: {
    name: "Nursing", role: "healthcare explorer", icon: "🩺", guide: "👩🏽‍⚕️", accent: "#1D9E75", soft: "#E1F5EE",
    intro: "Nurses help people feel safe, understand what is happening, and get the care they need.",
    stations: [
      ["❤️", "What nurses do", "Care, notice, explain", "Nurses check how people feel, watch for changes, give safe care, and explain things in a calm way.", "Nurses do much more than give medicine. They are careful observers and trusted teammates.", ["Ignore small changes", "Notice changes and speak up", "Make every decision alone"], 1],
      ["🧰", "Tools", "Meet the care tools", "A nurse may use a stethoscope, thermometer, blood-pressure cuff, computer chart, and many other tools.", "A tool gives information. The nurse still needs to think, listen, and ask good questions.", ["Stethoscope", "Paint roller", "Telescope"], 0],
      ["🤝", "People you help", "Every age, every story", "Nurses can help babies, kids, adults, and older people in hospitals, schools, clinics, homes, and communities.", "Some nurses care for one kind of patient. Others help many different people.", ["Only athletes", "Only children", "People of all ages"], 2],
      ["🌳", "Different paths", "Nursing has many branches", "You could become a school nurse, emergency nurse, children’s nurse, surgery nurse, public-health nurse, or nurse researcher.", "The same nursing skills can be used in many places—not only hospitals.", ["Only hospital nurse", "Many types of nurse", "There is one nursing job"], 1],
      ["🧠", "Try a care call", "Choose the safest move", "A student says they feel dizzy after standing. What should you do first?", "Safety comes first: help them sit down, stay calm, and get an adult or nurse.", ["Tell them to run", "Help them sit safely", "Leave them alone"], 1]
    ]
  },
  business: {
    name: "Business", role: "business explorer", icon: "📈", guide: "🧑🏾‍💼", accent: "#BA7517", soft: "#FEF3E2",
    intro: "Business is about solving a problem for people and building a team that can make the solution real.",
    stations: [
      ["💡", "What founders do", "Turn ideas into action", "Founders find a real problem, test ideas, organize a team, and keep learning from customers.", "A strong business begins with helping someone—not simply making money.", ["Solve a real problem", "Copy without asking", "Never talk to users"], 0],
      ["🧰", "Tools", "Plans, numbers, stories", "Business teams use budgets, calendars, surveys, presentations, spreadsheets, and prototypes.", "Numbers tell what happened. Customer stories help explain why.", ["Budget", "Stethoscope", "Microscope only"], 0],
      ["🤝", "People you serve", "Know your customer", "A customer is the person or group whose problem you are trying to solve.", "Good teams listen before they build. Guessing is not the same as learning.", ["Never ask questions", "Listen to customers", "Build only for yourself"], 1],
      ["🌳", "Different paths", "Business has many roles", "You could work in marketing, finance, sales, design, operations, management, or start your own organization.", "A business needs creative people, number people, planners, speakers, and builders.", ["Only sales exists", "Many different roles", "Everyone does one task"], 1],
      ["🧠", "Try a founder call", "Choose the strongest proof", "An investor asks if students would use your homework app. What answer is strongest?", "Real tests are stronger than guesses. Show what users actually did.", ["I just feel they will", "50 students tested it and 30 returned", "My friend likes the color"], 1]
    ]
  },
  stem: {
    name: "Software Engineering", role: "technology explorer", icon: "💻", guide: "🧑🏻‍💻", accent: "#3B6FD4", soft: "#EAF0FB",
    intro: "Software engineers use logic and creativity to build apps, games, websites, and tools people can use.",
    stations: [
      ["🧩", "What engineers do", "Solve one piece at a time", "Software engineers understand a problem, plan a solution, write code, test it, and improve it.", "Coding is part of the job. Asking questions and working with people matter too.", ["Guess forever", "Plan, build, and test", "Never change the code"], 1],
      ["🧰", "Tools", "The developer toolbox", "Engineers use code editors, computers, design notes, test tools, and systems that track changes.", "A code editor helps write code. Tests help check that the code behaves correctly.", ["Code editor", "Blood-pressure cuff", "Cash register only"], 0],
      ["🤝", "People you help", "Software is built for users", "Engineers build tools for students, doctors, artists, scientists, businesses, families, and many others.", "The best solution is not just clever—it should be useful and understandable.", ["Real users", "No one", "Only other computers"], 0],
      ["🌳", "Different paths", "Technology has many roads", "You could build games, websites, robots, phone apps, cybersecurity tools, medical software, or artificial intelligence.", "You do not have to love every kind of technology. Explore what feels exciting to you.", ["Only websites", "Many specialties", "Only robots"], 1],
      ["🧠", "Try a debug call", "Fix the root cause", "A form crashes when the name box is empty. What is the best first fix?", "Check the input before using it. This prevents the bad value from causing a crash.", ["Validate the name field", "Hide the button", "Ask users never to make mistakes"], 0]
    ]
  }
};

const params = new URLSearchParams(location.search);
const track = careers[params.get("track")] ? params.get("track") : "healthcare";
const career = careers[track];
const app = document.querySelector("#explore-app");
let completed = new Set();
let openStation = null;
let answered = false;

document.documentElement.style.setProperty("--accent", career.accent);
document.documentElement.style.setProperty("--soft", career.soft);

function render() {
  app.innerHTML = `
    <section class="hero">
      <span class="eyebrow">Your career clubhouse</span>
      <h1>Explore <em>${career.name}</em></h1>
      <p>${career.intro} Visit all five stations and earn your ${career.role} badge.</p>
    </section>
    <section class="passport">
      <div class="passport-top"><span>EXPLORER PASSPORT</span><span>${completed.size} / 5 stations</span></div>
      <div class="passport-rail"><i style="width:${completed.size * 20}%"></i></div>
      <div class="passport-dots">${career.stations.map((_, i) => `<i class="${completed.has(i) ? "done" : ""}">${completed.has(i) ? "✓" : i + 1}</i>`).join("")}</div>
    </section>
    <section class="clubhouse">
      <div class="world-label">${career.name} discovery world</div>
      ${career.stations.map((station, i) => `<button class="station s${i} ${completed.has(i) ? "done" : ""}" data-station="${i}" type="button"><span>${station[0]}</span><strong>${station[1]}</strong><small>${station[2]}</small></button>`).join("")}
      <div class="guide"><span>${career.guide}</span><b>Your guide</b></div>
    </section>
    ${completed.size === 5 ? `<section class="badge-card"><div class="badge">🏅</div><span class="eyebrow">Badge unlocked</span><h2>${career.role}</h2><p>You explored the work, tools, people, pathways, and thinking skills behind ${career.name}.</p><div class="badge-actions"><a href="../?track=${track}">Replay simulation</a><a href="../">Discover another path</a></div></section>` : ""}
    ${openStation !== null ? lessonMarkup(openStation) : ""}
  `;
}

function lessonMarkup(index) {
  const station = career.stations[index];
  return `<div class="lesson-backdrop"><section class="lesson" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
    <div class="lesson-head"><div class="lesson-icon">${station[0]}</div><button class="close" data-close type="button" aria-label="Close">×</button></div>
    <h2 id="lesson-title">${station[1]}</h2>
    <p class="lesson-copy">${station[3]}</p>
    <div class="fact-box"><strong>Good to know</strong><p>${station[4]}</p></div>
    <div class="choice-list">${station[5].map((choice, i) => `<button class="choice" data-choice="${i}" type="button">${choice}</button>`).join("")}</div>
    <p class="lesson-feedback" aria-live="polite"></p>
    <button class="continue" data-continue type="button" disabled>Stamp my passport →</button>
  </section></div>`;
}

app.addEventListener("click", (event) => {
  const stationButton = event.target.closest("[data-station]");
  const choiceButton = event.target.closest("[data-choice]");
  if (stationButton) {
    openStation = Number(stationButton.dataset.station);
    answered = false;
    render();
  }
  if (event.target.closest("[data-close]")) {
    openStation = null;
    render();
  }
  if (choiceButton && !answered) {
    const station = career.stations[openStation];
    const choice = Number(choiceButton.dataset.choice);
    answered = true;
    document.querySelectorAll(".choice").forEach((button, i) => {
      if (i === station[6]) button.classList.add("correct");
      if (i === choice && choice !== station[6]) button.classList.add("wrong");
    });
    document.querySelector(".lesson-feedback").textContent = choice === station[6] ? "Great thinking!" : "Good try—now you know the stronger choice.";
    document.querySelector("[data-continue]").disabled = false;
  }
  if (event.target.closest("[data-continue]")) {
    completed.add(openStation);
    openStation = null;
    answered = false;
    render();
    window.scrollTo({ top: completed.size === 5 ? document.body.scrollHeight : 190, behavior: "smooth" });
  }
});

render();
