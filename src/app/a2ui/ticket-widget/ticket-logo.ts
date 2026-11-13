import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-logo',
  template: `
    <svg viewBox="0 0 140 28" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flight42">
      <g fill="currentColor">
        <path d="M6 14 L20 4 L22 6 L14 14 L22 22 L20 24 Z" />
        <text x="30" y="19" font-size="16" font-weight="800" letter-spacing="0.5">Flight42</text>
      </g>
    </svg>
  `,
  styles: `
    :host {
      color: var(--ticket-accent);
      display: inline-block;
    }

    svg {
      display: block;
      height: 1.6rem;
      width: 7rem;
    }
  `,
})
export class TicketLogo {}
