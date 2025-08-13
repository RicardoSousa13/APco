// ---------- Custom Cursor ----------
const customCursor = document.querySelector(".custom-cursor");
const links = document.querySelectorAll("a, button");

document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1.4)";
  });
  link.addEventListener("mouseleave", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1)";
  });
});

// ---------- Lottie Animation ----------
const logoContainer = document.getElementById("logo-animation");

const logoPaths = {
  light: "logos/logo-dark.json", // Light mode animation
  dark: "logos/logo-light.json", // Dark mode animation
};

let logoAnimation;

function loadLogoAnimation(path) {
  if (logoAnimation) {
    logoAnimation.destroy();
  }

  logoAnimation = lottie.loadAnimation({
    container: logoContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: path,
  });

  logoAnimation.addEventListener("DOMLoaded", () => {
    logoAnimation.goToAndStop(0, true);
  });

  logoContainer.addEventListener("mouseenter", () => {
    logoAnimation.setDirection(-1);
    logoAnimation.play();
  });

  logoContainer.addEventListener("mouseleave", () => {
    logoAnimation.setDirection(1);
    logoAnimation.play();
  });
}

// Load default logo animation (light mode)
loadLogoAnimation(logoPaths.light);

// ---------- Dark Mode Toggle ----------
const darkToggle = document.getElementById("mode-toggle-dark");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    const newPath = isDark ? logoPaths.dark : logoPaths.light;
    loadLogoAnimation(newPath);
    // Update button text
    darkToggle.textContent = isDark ? "#ffffff" : "#000000";
  });
}

// ---------- Optional Landing Mode Toggle ----------
const landingToggle = document.getElementById("mode-toggle-landing");
if (landingToggle) {
  landingToggle.addEventListener("click", () => {
    const isBlue = document.body.classList.toggle("blue-mode");

    // Update button text
    landingToggle.textContent = isBlue ? "#000000" : "#0000ff";
  });
}

// ---------- GSAP Animations ----------

// 1. Text animates on page load
gsap.utils.toArray(".reveal-text").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 25,
    duration: 1.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 92%",
      toggleActions: "play none none none",
    },
  });
});

// 2. Image grid animates on scroll, with delay
gsap.utils.toArray(".image-grid img").forEach((img) => {
  gsap.from(img, {
    opacity: 0,
    y: 40,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: img,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
});

// ---------- Logo Scroll Interaction ----------
gsap.set("#logo-animation", { opacity: 1 });

let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener("scroll", () => {
  if (!logoAnimation) return;

  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;

  const isScrollingDown = currentScrollTop > lastScrollTop;
  const direction = isScrollingDown ? 1 : -1;

  logoAnimation.setDirection(direction);
  logoAnimation.play();

  gsap.to("#logo-animation", { opacity: 1, duration: 0.6 });

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});
