import { CatalogComponent } from '@a2ui/angular';
import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
// The A2UI renderer is built on zod 3; zod3 is an alias for that version.
import { z } from 'zod3';

import { TicketLogo } from './ticket-logo';

const BOARDING_MINUTES_BEFORE_DEPARTURE = 30;

const ticketSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delay: z.number(),
});

type Ticket = z.infer<typeof ticketSchema>;

/**
 * Describes the component for the A2UI catalog: its name and props.
 */
export const ticketWidgetApi = {
  name: 'TicketWidget',
  schema: z.object({
    // The ticket itself or a data binding to it
    ticket: z.union([ticketSchema, z.object({ '@path': z.string() })]),
  }),
};

/**
 * A boarding pass. The server uses it via the dashboard catalog.
 */
@Component({
  selector: 'app-ticket-widget',
  imports: [DatePipe, TicketLogo],
  templateUrl: './ticket-widget.html',
  styleUrl: './ticket-widget.css',
})
export class TicketWidget extends CatalogComponent<typeof ticketWidgetApi> {
  // The renderer has already resolved the data binding. (Its typings only
  // know the bindings of A2UI 0.9, so TypeScript still offers both.)
  protected readonly ticket = computed(() => this.props().ticket.value() as Ticket);
  protected readonly departure = computed(() => new Date(this.ticket().date));
  protected readonly boarding = computed(
    () => new Date(this.departure().getTime() - BOARDING_MINUTES_BEFORE_DEPARTURE * 60_000),
  );

  // The demo has no seat reservation.
  protected readonly gate = 'B7';
  protected readonly seat = '14A';
}
