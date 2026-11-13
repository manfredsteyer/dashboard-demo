import type { A2uiComponent } from '../../dsl/macro';

/*
 * Small building blocks for A2UI 1.0 basic catalog components.
 * Each one returns a subtree whose first component is its root and
 * uses the given id. All other ids are derived from it.
 */

/**
 * Binds a property to the data model. Inside a template, paths without
 * a leading slash are relative to the current list entry.
 */
export function bind(path: string) {
  return { '@path': path };
}

/**
 * A card with a markdown heading followed by the given children.
 */
export function card(id: string, title: string, children: string[]): A2uiComponent[] {
  return [
    { id, component: 'Card', child: `${id}_body` },
    { id: `${id}_body`, component: 'Column', children: [`${id}_title`, ...children] },
    { id: `${id}_title`, component: 'Text', text: `### ${title}` },
  ];
}

/**
 * One entry per item of the list at listPath in the data model. Each
 * entry shows the item's title and subtitle, followed by extra children.
 */
export function itemList(id: string, listPath: string, extraChildren: string[] = []) {
  const itemId = `${id}_item`;
  return [
    // A template: the item component is repeated for every list entry.
    { id, component: 'Column', children: { componentId: itemId, path: listPath } },
    {
      id: itemId,
      component: 'Column',
      children: [`${itemId}_title`, `${itemId}_subtitle`, ...extraChildren],
    },
    { id: `${itemId}_title`, component: 'Text', text: bind('title') },
    { id: `${itemId}_subtitle`, component: 'Text', text: bind('subtitle'), variant: 'caption' },
  ];
}

/**
 * Like itemList, but with the item's image in front of the texts.
 */
export function imageList(id: string, listPath: string): A2uiComponent[] {
  const itemId = `${id}_item`;
  return [
    { id, component: 'Column', children: { componentId: itemId, path: listPath } },
    {
      id: itemId,
      component: 'Row',
      align: 'center',
      children: [`${itemId}_image`, `${itemId}_text`],
    },
    {
      id: `${itemId}_image`,
      component: 'Image',
      url: bind('image'),
      description: bind('title'),
      variant: 'smallFeature',
      fit: 'cover',
    },
    {
      id: `${itemId}_text`,
      component: 'Column',
      weight: 1,
      children: [`${itemId}_title`, `${itemId}_subtitle`],
    },
    { id: `${itemId}_title`, component: 'Text', text: bind('title') },
    { id: `${itemId}_subtitle`, component: 'Text', text: bind('subtitle'), variant: 'caption' },
  ];
}

/**
 * A button that sends an action with the given context. Context values
 * can be literals or data bindings.
 */
export function button(
  id: string,
  label: string,
  action: { name: string; context: Record<string, unknown> },
  variant: 'default' | 'primary' = 'default',
): A2uiComponent[] {
  return [
    { id, component: 'Button', child: `${id}_label`, variant, action: { event: action } },
    { id: `${id}_label`, component: 'Text', text: label },
  ];
}

export interface TableColumn {
  header: string;
  field: string;
}

/**
 * A header row plus one row per item of the list at listPath.
 */
export function table(id: string, listPath: string, columns: TableColumn[]): A2uiComponent[] {
  const headerId = `${id}_header`;
  const rowsId = `${id}_rows`;
  const rowId = `${id}_row`;

  return [
    { id, component: 'Column', children: [headerId, rowsId] },
    { id: headerId, component: 'Row', children: columns.map((c) => `${headerId}_${c.field}`) },
    ...columns.map((c) => ({
      id: `${headerId}_${c.field}`,
      component: 'Text',
      text: c.header,
      variant: 'caption',
      weight: 1,
    })),
    { id: rowsId, component: 'Column', children: { componentId: rowId, path: listPath } },
    { id: rowId, component: 'Row', children: columns.map((c) => `${rowId}_${c.field}`) },
    ...columns.map((c) => ({
      id: `${rowId}_${c.field}`,
      component: 'Text',
      text: bind(c.field),
      weight: 1,
    })),
  ];
}
