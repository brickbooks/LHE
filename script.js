const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const parallax = document.querySelector("[data-parallax]");
const reveals = document.querySelectorAll(".reveal");
const testimonials = [...document.querySelectorAll(".testimonial")];
const nextButton = document.querySelector("[data-testimonial-next]");
const prevButton = document.querySelector("[data-testimonial-prev]");
const calculator = document.querySelector("[data-calculator]");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", () => {
  setHeaderState();
  if (parallax && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    parallax.style.transform = `scale(1.04) translateY(${window.scrollY * 0.08}px)`;
  }
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  header.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => revealObserver.observe(item));

let testimonialIndex = 0;

const showTestimonial = (nextIndex) => {
  testimonials[testimonialIndex].classList.remove("active");
  testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
  testimonials[testimonialIndex].classList.add("active");
};

nextButton?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
prevButton?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));

window.setInterval(() => {
  if (document.hidden) return;
  showTestimonial(testimonialIndex + 1);
}, 6500);

const hairOptions = {
  "4A": {
    "Micro Rings": ["18in", "22in"],
    "Nano Rings": ["18in", "22in"],
  },
  "5A": {
    "Micro Rings": ["18in"],
    "Nano Rings": ["18in", "20in", "22in", "24in"],
  },
  "7A": {
    "Micro Rings": ["18in"],
    "Nano Rings": ["18in", "22in", "24in"],
  },
};

const hairPricesPer50g = {
  "4A": {
    "Micro Rings": {
      "18in": 45,
      "22in": 50,
    },
    "Nano Rings": {
      "18in": 50,
      "22in": 55,
    },
  },
  "5A": {
    "Micro Rings": {
      "18in": 75,
    },
    "Nano Rings": {
      "18in": 80,
      "20in": 85,
      "22in": 90,
      "24in": 95,
    },
  },
  "7A": {
    "Micro Rings": {
      "18in": 95,
    },
    "Nano Rings": {
      "18in": 100,
      "22in": 145,
      "24in": 150,
    },
  },
};

const fittingPricesPerStrand = {
  "50": 1.6,
  "100": 1.4,
  "150": 1.2,
  "200": 1,
};

if (calculator) {
  const hairTypeSelect = calculator.querySelector("[data-hair-type]");
  const fittingTypeSelect = calculator.querySelector("[data-fitting-type]");
  const amountTypeSelect = calculator.querySelector("[data-amount-type]");
  const lengthSelect = calculator.querySelector("[data-hair-length]");
  const totalOutput = calculator.querySelector("[data-calculator-total]");

  const renderFittingOptions = () => {
    const currentHairType = hairTypeSelect.value;
    const currentFittingType = fittingTypeSelect.value;
    const fittings = Object.keys(hairOptions[currentHairType]);
    fittingTypeSelect.innerHTML = fittings.map((fitting) => `<option value="${fitting}">${fitting}</option>`).join("");
    fittingTypeSelect.value = fittings.includes(currentFittingType) ? currentFittingType : fittings[0];
  };

  const renderLengthOptions = () => {
    const currentHairType = hairTypeSelect.value;
    const currentFittingType = fittingTypeSelect.value;
    const lengths = hairOptions[currentHairType][currentFittingType] || [];
    const currentLength = lengthSelect.value;
    lengthSelect.innerHTML = lengths.map((option) => `<option value="${option}">${option}</option>`).join("");
    lengthSelect.value = lengths.includes(currentLength) ? currentLength : lengths[0];
  };

  const updateTotal = () => {
    const grams = Number(amountTypeSelect.value);
    const hairType = hairTypeSelect.value;
    const fittingType = fittingTypeSelect.value;
    const length = lengthSelect.value;
    const hairCost = (grams / 50) * (hairPricesPer50g[hairType][fittingType][length] || 0);
    const fittingCost = grams * (fittingPricesPerStrand[amountTypeSelect.value] || 0);
    const total = hairCost + fittingCost;

    totalOutput.textContent = `£${Number.isFinite(total) ? total.toFixed(2) : "0.00"}`;
  };

  const syncCalculator = () => {
    renderFittingOptions();
    renderLengthOptions();
    updateTotal();
  };

  [hairTypeSelect, fittingTypeSelect, amountTypeSelect, lengthSelect].forEach((input) => {
    input.addEventListener("input", updateTotal);
    input.addEventListener("change", syncCalculator);
  });

  syncCalculator();
}
