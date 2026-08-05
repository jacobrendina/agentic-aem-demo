import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the hero block
 *
 * Authored (model "hero") as a stack of field rows: an image, an optional alt,
 * and a richtext body. Fields may be omitted, so discover them by content.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  let picture;
  const contentNodes = [];

  cells.forEach((cell) => {
    const pic = cell.querySelector('picture');
    if (pic && !picture) {
      picture = pic;
    } else if (cell.textContent.trim() || cell.querySelector('a, img')) {
      contentNodes.push(...cell.childNodes);
    }
  });

  block.textContent = '';

  const media = document.createElement('div');
  media.className = 'hero-media';
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.alt,
        true,
        [{ width: '2000' }, { media: '(max-width: 600px)', width: '750' }],
      );
      media.append(optimized);
    } else {
      media.append(picture);
    }
    block.classList.add('hero-has-media');
  }

  const body = document.createElement('div');
  body.className = 'hero-body';
  const inner = document.createElement('div');
  inner.className = 'hero-content';
  inner.append(...contentNodes);
  body.append(inner);

  block.append(media, body);
}
