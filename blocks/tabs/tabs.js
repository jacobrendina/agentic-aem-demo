import { moveInstrumentation } from '../../scripts/scripts.js';

// unique-ish id per block instance without relying on Math.random/Date
let tabsInstance = 0;

/**
 * loads and decorates the tabs block
 *
 * Each row is a tab authored as [label] [panel content].
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  tabsInstance += 1;
  const uid = `tabs-${tabsInstance}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  const tabs = [];

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const panelCell = cells[1];
    const label = labelCell ? labelCell.textContent.trim() : `Tab ${i + 1}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-tab';
    tab.id = `${uid}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${uid}-panel-${i}`);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    tab.textContent = label;

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = `${uid}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    if (i !== 0) panel.hidden = true;
    moveInstrumentation(row, panel);
    if (panelCell) {
      while (panelCell.firstChild) panel.append(panelCell.firstChild);
    }

    const activate = () => {
      tabs.forEach(({ tab: t, panel: p }) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');
        p.hidden = !selected;
      });
    };
    tab.addEventListener('click', activate);

    tablist.append(tab);
    panels.append(panel);
    tabs.push({ tab, panel, activate });
  });

  // arrow-key navigation between tabs
  tablist.addEventListener('keydown', (e) => {
    const current = tabs.findIndex(({ tab }) => tab === document.activeElement);
    if (current < 0) return;
    let target = current;
    if (e.key === 'ArrowRight') target = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') target = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = tabs.length - 1;
    else return;
    e.preventDefault();
    tabs[target].tab.focus();
    tabs[target].activate();
  });

  block.textContent = '';
  block.append(tablist, panels);
}
