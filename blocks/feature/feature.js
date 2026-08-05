import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the feature block
 *
 * Each row is a feature authored as [image] [text]. Rows alternate the
 * media between left and right for a zig-zag layout.
 * @param {Element} block The feature block element
 */
export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    row.classList.add('feature-row');
    if (i % 2 === 1) row.classList.add('feature-row-reverse');

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.className = 'feature-media';
      } else {
        cell.className = 'feature-body';
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });
}
