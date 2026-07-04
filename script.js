const year = document.querySelector("#current-year");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const carousel = document.querySelector("[data-carousel]");
const prevButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const docCarousel = document.querySelector("[data-doc-carousel]");
const docPrevButton = document.querySelector("[data-doc-carousel-prev]");
const docNextButton = document.querySelector("[data-doc-carousel-next]");
const careerItems = Array.from(document.querySelectorAll(".career-item"));
const careerTotal = document.querySelector("[data-career-total]");
const careerAsOf = document.querySelector("[data-career-asof]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const parseDate = (value) => {
  const [yearValue, monthValue, dayValue] = value.split("-").map(Number);
  return new Date(yearValue, monthValue - 1, dayValue);
};

const formatDate = (date) => {
  const yearValue = date.getFullYear();
  const monthValue = String(date.getMonth() + 1).padStart(2, "0");
  const dayValue = String(date.getDate()).padStart(2, "0");
  return `${yearValue}.${monthValue}.${dayValue}`;
};

const diffInclusiveMonths = (start, end) => {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1
  );
};

const formatCareerMonths = (totalMonths) => {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}년 ${months}개월`;
};

const updateCareerDurations = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let totalMonths = 0;

  careerItems.forEach((item) => {
    const start = parseDate(item.dataset.careerStart);
    const end =
      item.dataset.careerEnd === "present"
        ? today
        : parseDate(item.dataset.careerEnd);
    const months = Math.max(0, diffInclusiveMonths(start, end));
    totalMonths += months;

    const duration = item.querySelector("[data-career-duration]");
    if (duration) {
      duration.textContent = formatCareerMonths(months);
    }
  });

  if (careerTotal) {
    careerTotal.textContent = formatCareerMonths(totalMonths);
  }

  if (careerAsOf) {
    careerAsOf.textContent = formatDate(today);
  }
};

const setActiveNav = () => {
  const marker = window.scrollY + 140;
  const current = sections.reduce((active, section) => {
    return section.offsetTop <= marker ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.getAttribute("href") === `#${current.id}`,
    );
  });
};

const scrollToCurrentHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;

  if (target) {
    target.scrollIntoView({ block: "start" });
    window.requestAnimationFrame(setActiveNav);
  }
};

const moveScrollableCarousel = (target, direction) => {
  if (!target) {
    return;
  }

  target.scrollBy({
    left: direction * target.clientWidth,
    behavior: "smooth",
  });
};

const moveCarousel = (direction) => moveScrollableCarousel(carousel, direction);
const moveDocCarousel = (direction) => moveScrollableCarousel(docCarousel, direction);

prevButton?.addEventListener("click", () => moveCarousel(-1));
nextButton?.addEventListener("click", () => moveCarousel(1));
docPrevButton?.addEventListener("click", () => moveDocCarousel(-1));
docNextButton?.addEventListener("click", () => moveDocCarousel(1));

window.addEventListener("scroll", setActiveNav, { passive: true });
window.addEventListener("hashchange", () => {
  scrollToCurrentHash();
  setActiveNav();
});
window.addEventListener("load", () => {
  scrollToCurrentHash();
  window.setTimeout(scrollToCurrentHash, 250);
  setActiveNav();
});
updateCareerDurations();
setActiveNav();
