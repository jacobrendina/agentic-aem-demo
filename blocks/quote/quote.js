/**
 * loads and decorates the quote block
 *
 * Authored as up to three rows: the quotation, an attribution name,
 * and an optional role/company line.
 * @param {Element} block The quote block element
 */
export default function decorate(block) {
  const rows = [...block.children].map((row) => row.firstElementChild || row);

  const [quoteCell, nameCell, roleCell] = rows;

  block.textContent = '';

  const figure = document.createElement('figure');
  figure.className = 'quote-figure';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-text';
  if (quoteCell) {
    while (quoteCell.firstChild) blockquote.append(quoteCell.firstChild);
  }
  figure.append(blockquote);

  const hasName = nameCell && nameCell.textContent.trim();
  const hasRole = roleCell && roleCell.textContent.trim();
  if (hasName || hasRole) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-attribution';
    if (hasName) {
      const name = document.createElement('span');
      name.className = 'quote-name';
      name.textContent = nameCell.textContent.trim();
      caption.append(name);
    }
    if (hasRole) {
      const role = document.createElement('span');
      role.className = 'quote-role';
      role.textContent = roleCell.textContent.trim();
      caption.append(role);
    }
    figure.append(caption);
  }

  block.append(figure);
}
