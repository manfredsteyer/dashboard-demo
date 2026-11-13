import { randomUUID } from 'node:crypto';

import { registerApiRoute } from '@mastra/core/server';

// Charts are kept in memory for the lifetime of the demo server.
const charts = new Map<string, string>();

/**
 * Stores an SVG chart and returns a short URL for an A2UI Image.
 * The URL is relative because the server also delivers the client.
 */
export function publishChart(svg: string): string {
  const id = randomUUID();
  charts.set(id, svg);
  return `/charts/${id}.svg`;
}

export const chartsRoute = registerApiRoute('/charts/:file', {
  method: 'GET',
  handler: (c) => {
    const id = c.req.param('file').replace(/\.svg$/, '');
    const svg = charts.get(id);
    if (!svg) {
      return c.text('Chart not found', 404);
    }
    return c.body(svg, 200, { 'Content-Type': 'image/svg+xml' });
  },
});
