import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the accordion block
 *
 * Each row is an item authored as [summary] [body].
 * Rendered as native <details>/<summary> for built-in accessibility.
 * @param {Element} block The accordion block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const summaryCell = cells[0];
    const bodyCell = cells[1];

    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    if (summaryCell) {
      while (summaryCell.firstChild) summary.append(summaryCell.firstChild);
    }

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (bodyCell) {
      while (bodyCell.firstChild) body.append(bodyCell.firstChild);
    }

    details.append(summary, body);
    row.replaceWith(details);
  });
}
