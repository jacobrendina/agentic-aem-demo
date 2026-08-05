/**
 * loads and decorates the callout block
 *
 * A promotional band: optional eyebrow/heading/text on one side and
 * call-to-action button(s) that the boilerplate button decoration produces.
 * Authored as a single richtext cell (plus optional icon row).
 * @param {Element} block The callout block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const content = document.createElement('div');
  content.className = 'callout-content';
  const actions = document.createElement('div');
  actions.className = 'callout-actions';

  cells.forEach((cell) => {
    const buttons = cell.querySelectorAll('.button-wrapper, a.button');
    if (buttons.length && cell.children.length === buttons.length) {
      // this cell holds only buttons — treat as the actions area
      while (cell.firstChild) actions.append(cell.firstChild);
    } else {
      while (cell.firstChild) content.append(cell.firstChild);
    }
  });

  block.textContent = '';
  block.append(content);
  // pull any button wrappers that ended up inside content into the actions area
  content.querySelectorAll('.button-wrapper').forEach((bw) => actions.append(bw));
  if (actions.childElementCount) block.append(actions);
}
