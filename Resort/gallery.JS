const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let current = 0;
let timerId;

function showSlide(index) {
  if (!slides.length || !dots.length) {
    return;
  }

  slides[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

function nextSlide() {
  showSlide(current + 1);
}

function prevSlide() {
  showSlide(current - 1);
}

function restartTimer() {
  if (!slides.length) {
    return;
  }

  clearInterval(timerId);
  timerId = setInterval(nextSlide, 3500);
}

if (slides.length && dots.length && prevBtn && nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartTimer();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });
  });

  restartTimer();
}