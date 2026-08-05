/**
 * loads and decorates the button group block
 *
 * Collects all authored links/buttons into a single flex row. The boilerplate
 * button decoration (decorateButtons) turns formatted links into .button
 * elements before this runs.
 * @param {Element} block The buttongroup block element
 */
export default function decorate(block) {
  const group = document.createElement('div');
  group.className = 'button-group-items';

  block.querySelectorAll('a').forEach((a) => {
    // ensure every link in the group renders as a button
    if (!a.classList.contains('button')) {
      a.classList.add('button', 'secondary');
    }
    group.append(a);
  });

  block.textContent = '';
  block.append(group);
}
