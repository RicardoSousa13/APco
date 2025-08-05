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

const logoAnimation = lottie.loadAnimation({
  container: logoContainer,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "logos/Scene-1.json", // 👈 update to your actual path
});

// Set initial frame to 0 when loaded
logoAnimation.addEventListener("DOMLoaded", () => {
  logoAnimation.goToAndStop(0, true); // Start from the beginning
});

// Hover expands, leave compresses
logoContainer.addEventListener("mouseenter", () => {
  logoAnimation.setDirection(-1);
  logoAnimation.play();
});
logoContainer.addEventListener("mouseleave", () => {
  logoAnimation.setDirection(1);
  logoAnimation.play();
});

// Nav Mode toggle
// Landing mode toggle
const landingToggle = document.getElementById("mode-toggle-landing");
if (landingToggle) {
  landingToggle.addEventListener("click", () => {
    document.body.classList.toggle("blue-mode");
  });
}

// Regular dark mode toggle
const darkToggle = document.getElementById("mode-toggle-dark");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

// ---------- GSAP Animations ----------

// 1. Text animates on page load
gsap.utils.toArray(".reveal-text").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 25,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 95%", // adjust as needed
      toggleActions: "play none none none",
    },
  });
});

// 2. Image grid animates on scroll, with delay
gsap.utils.toArray(".image-grid img").forEach((img) => {
  gsap.from(img, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: img,
      start: "top 90%", // when the top of the image is near viewport bottom
      toggleActions: "play none none none",
    },
  });
});

//lottie animation for the footer
// Make sure logo is visible
gsap.set("#logo-animation", { opacity: 1 });

// Track scroll direction
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener("scroll", () => {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;

  const isScrollingDown = currentScrollTop > lastScrollTop;
  const direction = isScrollingDown ? 1 : -1;

  logoAnimation.setDirection(direction);
  logoAnimation.play();

  gsap.to("#logo-animation", { opacity: 1, duration: 0.6 });

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});
