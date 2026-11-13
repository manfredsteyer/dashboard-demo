import { BasicCatalog, createComponentImplementation } from '@a2ui/angular';

import { DASHBOARD_CATALOG_ID } from '../../../shared/dashboard-protocol';
import { TicketWidget, ticketWidgetApi } from './ticket-widget/ticket-widget';

/**
 * All components the server may use: the A2UI basic catalog plus our
 * TicketWidget.
 */
export const dashboardCatalog = new BasicCatalog({
  id: DASHBOARD_CATALOG_ID,
  extraComponents: [createComponentImplementation(ticketWidgetApi, TicketWidget)],
});
