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

//GSAP Animation
// 1. Text animates on page load
gsap.from(".reveal-text", {
  opacity: 0,
  y: 20,
  duration: 1.5,
  stagger: 0.2,
  ease: "power2.out",
});

// 2. Image grid animates on scroll, with delay
gsap.from(".image-grid img", {
  opacity: 0,
  y: 30,
  stagger: {
    amount: 1.2,
    from: "random",
  },
  duration: 1,
  ease: "power3.out",
  delay: 0.5,
  scrollTrigger: {
    trigger: ".image-grid",
    start: "top 85%",
    toggleActions: "play none none none",
  },
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
