import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActive(block, slides, dots, index) {
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });
  dots.forEach((dot, i) => {
    dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    dot.setAttribute('tabindex', i === index ? '0' : '-1');
  });
  block.dataset.activeSlide = index;
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('ul');
  track.className = 'carousel-track';

  const slides = rows.map((row, i) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${rows.length}`);
    moveInstrumentation(row, slide);
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      if (cell.querySelector('picture')) cell.className = 'carousel-slide-image';
      else cell.className = 'carousel-slide-body';
      slide.append(cell);
    }
    track.append(slide);
    return slide;
  });

  // optimize images
  track.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  viewport.append(track);
  block.append(viewport);

  // single slide: no controls needed
  if (slides.length <= 1) {
    if (slides[0]) slides[0].setAttribute('aria-hidden', 'false');
    return;
  }

  // dots
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const dotList = document.createElement('div');
  dotList.className = 'carousel-dots';
  dotList.setAttribute('role', 'tablist');
  dotList.setAttribute('aria-label', 'Choose slide to display');
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => {
      updateActive(block, slides, dots, i);
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotList.append(dot);
    return dot;
  });

  const controls = document.createElement('div');
  controls.className = 'carousel-buttons';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-button carousel-button-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-button carousel-button-next';
  next.setAttribute('aria-label', 'Next slide');

  const go = (dir) => {
    const current = Number(block.dataset.activeSlide || 0);
    const target = (current + dir + slides.length) % slides.length;
    updateActive(block, slides, dots, target);
    slides[target].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  controls.append(prev, next);
  nav.append(dotList, controls);
  block.append(nav);

  // keep dots in sync when the user swipes/scrolls the track
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = slides.indexOf(entry.target);
        if (index >= 0) updateActive(block, slides, dots, index);
      }
    });
  }, { root: viewport, threshold: 0.6 });
  slides.forEach((slide) => io.observe(slide));

  updateActive(block, slides, dots, 0);
}
