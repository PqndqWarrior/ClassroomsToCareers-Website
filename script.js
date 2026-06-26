function startTypewriter(element, delay = 1600) {
  const phrases = JSON.parse(element.dataset.phrases || "[]");
  let phraseIndex = 0;
  let charIndex = phrases[0]?.length || 0;
  let deleting = true;
  function loop() {
    const phrase = phrases[phraseIndex];
    if (deleting) {
      charIndex--;
      element.textContent = phrase.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(loop, 350);
        return;
      }
      setTimeout(loop, 42);
    } else {
      charIndex++;
      element.textContent = phrases[phraseIndex].slice(0, charIndex);
      if (charIndex >= phrases[phraseIndex].length) {
        deleting = true;
        setTimeout(loop, 1750);
        return;
      }
      setTimeout(loop, 72);
    }
  }
  setTimeout(loop, delay);
}
document.querySelectorAll(".typewriter").forEach((element, index) => startTypewriter(element, 1600 + index * 500));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1200;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.7 });
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

document.querySelectorAll(".magnetic-button").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
    button.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

document.querySelectorAll(".metric-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const menu = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (menu && links) menu.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

const decaTabs = document.querySelectorAll(".deca-tab");
decaTabs.forEach((tab) => tab.addEventListener("click", () => {
  decaTabs.forEach((item) => item.classList.remove("active"));
  tab.classList.add("active");
  document.querySelector("#deca-title").textContent = tab.dataset.title;
  document.querySelector("#deca-copy").textContent = tab.dataset.copy;
}));

const speakerVideos = document.querySelectorAll(".speaker-live video");
if (speakerVideos.length) {
  const speakerVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.35 });
  speakerVideos.forEach((video) => speakerVideoObserver.observe(video));
}

const tactileSelector = [
  "button",
  ".primary-button",
  ".secondary-button",
  ".light-button",
  ".outline-button",
  ".nav-links .join",
  ".cta-actions a",
  ".moments-heading > a",
  ".team-button",
  ".legal-links a"
].join(",");

document.querySelectorAll(tactileSelector).forEach((control) => {
  control.classList.add("tactile-control");
  control.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = control.getBoundingClientRect();
    const ripple = document.createElement("i");
    ripple.className = "tap-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    control.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
});
