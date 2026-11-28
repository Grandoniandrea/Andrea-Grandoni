// Boxer — the neon athlete as an image. Same API the app used for the drawn fighter,
// so a video-based version can later replace this file without touching the screens.
const SRC = 'img/atleta.jpg';
const THUMB = 'img/atleta-thumb.jpg';

export function createFighter(container) {
  container.classList.add('fighter', 'athlete');
  container.innerHTML = `<img src="${SRC}" alt="" draggable="false">`;
  const img = container.firstElementChild;
  let t = 0;
  return {
    pose(name) {
      if (name === 'guard' || name === 'idle') return;
      img.classList.remove('hit');
      void img.offsetWidth; // restart the animation
      img.classList.add('hit');
      clearTimeout(t);
      t = setTimeout(() => img.classList.remove('hit'), 300);
    },
    destroy() { clearTimeout(t); container.innerHTML = ''; },
  };
}

export function poseSVG(_name, extraClass = '') {
  return `<img class="athlete-img ${extraClass}" src="${SRC}" alt="" draggable="false">`;
}

export function fighterThumb() {
  return `<img class="athlete-thumb" src="${THUMB}" alt="" draggable="false" loading="lazy">`;
}
