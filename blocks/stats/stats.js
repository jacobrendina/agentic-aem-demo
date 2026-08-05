import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the stats block
 *
 * Each row is a stat authored as [value] [label]. The value is displayed
 * large; the label is the supporting caption.
 * @param {Element} block The stats block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'stats-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('li');
    item.className = 'stats-item';
    moveInstrumentation(row, item);

    const value = document.createElement('span');
    value.className = 'stats-value';
    if (cells[0]) {
      while (cells[0].firstChild) value.append(cells[0].firstChild);
    }

    const label = document.createElement('span');
    label.className = 'stats-label';
    if (cells[1]) {
      while (cells[1].firstChild) label.append(cells[1].firstChild);
    }

    item.append(value, label);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
