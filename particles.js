const canvas = document.getElementById("particle-bg");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 160
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  const particleCount = window.innerWidth < 700 ? 35 : 75;
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 0.8
    });
  }
}

function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(248, 250, 252, 0.55)";
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, opacity, color = "47, 143, 234") {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${color}, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function updateParticles() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    drawParticle(p);

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 130) {
        const opacity = (1 - distance / 130) * 0.16;
        drawLine(p.x, p.y, p2.x, p2.y, opacity);
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      const dxMouse = p.x - mouse.x;
      const dyMouse = p.y - mouse.y;
      const mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (mouseDistance < mouse.radius) {
        const opacity = (1 - mouseDistance / mouse.radius) * 0.42;
        drawLine(p.x, p.y, mouse.x, mouse.y, opacity, "229, 168, 35");

        const force = (mouse.radius - mouseDistance) / mouse.radius;
        p.x += dxMouse * force * 0.004;
        p.y += dyMouse * force * 0.004;
      }
    }
  }

  requestAnimationFrame(updateParticles);
}

window.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mouseleave", function () {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (!prefersReducedMotion) {
  updateParticles();
}

// Subtle click ripple animation
document.addEventListener("click", function (event) {
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";

  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 700);
});

// Scroll progress bar
const scrollProgress = document.querySelector(".scroll-progress");

window.addEventListener("scroll", function () {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
});

// Section fade-in on scroll
document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll("main section");

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
});
// Copy email button with floating confirmation
document.querySelectorAll(".copy-email").forEach((button) => {
  button.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = button.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      showCopyToast("Copied Email");
    } catch {
      showCopyToast("Copy Failed");
    }
  });
});

function showCopyToast(message) {
  const existingToast = document.querySelector(".copy-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1300);
}

// Scroll-triggered fade-in animations
document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(
    "main section, .project-card, .card, .skills-grid > div"
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");

    if (item.classList.contains("project-card")) {
      item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    }
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
});

// Hero typewriter animation
document.addEventListener("DOMContentLoaded", function () {
  const typeTarget = document.getElementById("typewriter");

  if (!typeTarget) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const phrases = [
  "applications engineering.",
  "hardware validation.",
  "sensor systems.",
  "technical documentation.",
  "hardware debugging."
];
  
  if (prefersReducedMotion) {
    typeTarget.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      letterIndex--;
    } else {
      letterIndex++;
    }

    typeTarget.textContent = currentPhrase.substring(0, letterIndex);

    let delay = isDeleting ? 45 : 75;

    if (!isDeleting && letterIndex === currentPhrase.length) {
      delay = 1300;
      isDeleting = true;
    }

    if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
});
