import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { DashboardView } from './dashboard/dashboard-view';
import { PromptCard } from './dashboard/prompt-card';
import { Inspector } from './inspector/inspector';
import { LlmSettingsCard } from './llm-settings/llm-settings-card';

@Component({
  selector: 'app-root',
  imports: [NgOptimizedImage, LlmSettingsCard, PromptCard, DashboardView, Inspector],
  template: `
    <header class="navbar">
      <img
        ngSrc="angular-architects-white.svg"
        alt="Angular Architects"
        width="150"
        height="46"
        priority
      />
    </header>

    <div class="layout">
      <main class="main">
        <h1>Dynamic Dashboard</h1>
        <app-llm-settings-card />
        <app-prompt-card />
        <app-dashboard-view />
      </main>

      <aside class="inspector" aria-label="Generated code">
        <app-inspector />
      </aside>
    </div>
  `,
})
export class App {}
