// This file demonstrates how to integrate the ProcessMiningApp component
// into your existing Lovable.dev application

import { html, css, LovableElement } from 'lovable';
import { ProcessMiningApp } from './components/process-mining-app.js';

// Register the custom element - only needs to be done once in your application
customElements.define('process-mining-app', ProcessMiningApp);

// Example of a dashboard page component that includes the process mining app
export class WorkforceInsightsDashboard extends LovableElement {
  static properties = {
    activeTab: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .dashboard-header {
      background-color: #0066cc;
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    .dashboard-nav {
      display: flex;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    
    .nav-tab {
      padding: 15px 20px;
      cursor: pointer;
    }
    
    .nav-tab.active {
      background-color: white;
      border-bottom: 3px solid #0066cc;
      font-weight: bold;
    }
    
    .tab-content {
      padding: 20px;
    }
  `;

  constructor() {
    super();
    this.activeTab = 'process-mining';
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  render() {
    return html`
      <div class="dashboard-header">
        <h1>Future-Proof Workforce Insights</h1>
      </div>
      
      <div class="dashboard-nav">
        <div class="nav-tab ${this.activeTab === 'training-effectiveness' ? 'active' : ''}"
             @click=${() => this.setActiveTab('training-effectiveness')}>
          Training Effectiveness
        </div>
        <div class="nav-tab ${this.activeTab === 'process-mining' ? 'active' : ''}"
             @click=${() => this.setActiveTab('process-mining')}>
          Process Mining
        </div>
        <div class="nav-tab ${this.activeTab === 'skills-gap' ? 'active' : ''}"
             @click=${() => this.setActiveTab('skills-gap')}>
          Skills Gap Analysis
        </div>
      </div>
      
      <div class="tab-content">
        ${this.activeTab === 'training-effectiveness' ? html`
          <!-- Your existing Training Effectiveness content -->
          <p>Training effectiveness dashboard content goes here</p>
        ` : ''}
        
        ${this.activeTab === 'process-mining' ? html`
          <!-- Process Mining tab content -->
          <process-mining-app></process-mining-app>
        ` : ''}
        
        ${this.activeTab === 'skills-gap' ? html`
          <!-- Skills Gap Analysis content -->
          <p>Skills gap analysis dashboard content goes here</p>
        ` : ''}
      </div>
    `;
  }
}

// Register the dashboard component
customElements.define('workforce-insights-dashboard', WorkforceInsightsDashboard);