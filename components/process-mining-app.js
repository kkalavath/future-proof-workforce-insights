// process-mining-app.js - Lovable.dev component for Process Mining with OpenAI O3

import { html, css, LovableElement } from 'lovable';

/**
 * Process Mining Application Component
 * 
 * This component provides an interface for analyzing workforce reskilling data
 * through process mining, knowledge graphs, and causal analysis using OpenAI O3.
 * 
 * It connects to a FastAPI backend hosted on Render.com to fetch data and
 * perform AI-powered reasoning queries.
 */
export class ProcessMiningApp extends LovableElement {
  static properties = {
    loading: { type: Boolean },
    results: { type: Object },
    queryType: { type: String },
    question: { type: String },
    reasoningResults: { type: Object },
    filters: { type: Object },
    graphImage: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    select, input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    button {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    
    button:hover {
      background-color: #0055aa;
    }
    
    .tabs {
      display: flex;
      margin-bottom: 20px;
    }
    
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    
    .tab.active {
      border-bottom: 2px solid #0066cc;
      font-weight: bold;
    }
    
    .results-container {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .loader {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0066cc;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .process-graph {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      display: block;
    }
    
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 14px;
    }
    
    .chart-container {
      height: 400px;
      margin: 20px 0;
    }
    
    h2 {
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-top: 0;
    }
    
    .insights-card {
      background-color: #f0f7ff;
      border-left: 4px solid #0066cc;
    }
    
    .key-metric {
      display: inline-block;
      margin: 10px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
      text-align: center;
    }
    
    .key-metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
    }
    
    .key-metric-label {
      font-size: 14px;
      color: #666;
    }
  `;

  // API endpoints - update these to your Render.com backend URL
  API_BASE_URL = 'https://your-backend-app.onrender.com';

  constructor() {
    super();
    this.loading = false;
    this.results = null;
    this.queryType = 'process_mining';
    this.question = '';
    this.reasoningResults = null;
    this.filters = {};
    this.graphImage = null;
  }

  async fetchProcessMiningData() {
    this.loading = true;
    
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/process-mining`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_type: this.queryType,
          filters: this.filters
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.results = data.data;
      this.graphImage = data.graph_image;
      
      // Initialize visualization if needed
      if (this.graphImage && this.queryType === 'process_mining') {
        this.requestUpdate();
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async sendReasoningQuery() {
    if (!this.results) {
      alert('Please fetch data first');
      return;
    }
    
    if (!this.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    this.loading = true;
    
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/reasoning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: this.results,
          question: this.question
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get AI analysis: ${response.status} ${response.statusText}`);
      }
      
      this.reasoningResults = await response.json();
      
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      alert('Error getting AI analysis: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  handleQueryTypeChange(e) {
    this.queryType = e.target.value;
    this.results = null;
    this.reasoningResults = null;
    this.graphImage = null;
  }

  handleQuestionChange(e) {
    this.question = e.target.value;
  }

  handleFilterChange(e) {
    const { name, value } = e.target;
    this.filters = {
      ...this.filters,
      [name]: value
    };
  }

  getReasoningPrompts() {
    // Suggest relevant questions based on the query type
    const prompts = {
      process_mining: [
        "What are the most common training paths?",
        "Where are the bottlenecks in the training process?",
        "What are the key differences between successful and unsuccessful training journeys?"
      ],
      knowledge_graph: [
        "What job roles have the highest automation risk?",
        "Which training programs are most effective for high-risk roles?",
        "What skills show the strongest relationship with certification success?"
      ],
      causal_graph: [
        "What factors predict training success?",
        "Does automation risk correlate with training difficulties?",
        "Which training interventions are most effective for which employee groups?"
      ]
    };
    
    return prompts[this.queryType] || [];
  }

  renderDataSummary() {
    if (!this.results) return html``;
    
    // Create a simplified data summary based on query type
    if (this.queryType === 'process_mining' && this.results.process_data) {
      const { case_count, event_count } = this.results.process_data;
      
      return html`
        <div class="card">
          <h2>Data Summary</h2>
          <div class="key-metrics">
            <div class="key-metric">
              <div class="key-metric-value">${case_count}</div>
              <div class="key-metric-label">Training Cases</div>
            </div>
            <div class="key-metric">
              <div class="key-metric-value">${event_count}</div>
              <div class="key-metric-label">Training Events</div>
            </div>
          </div>
        </div>
      `;
    }
    
    if (this.queryType === 'knowledge_graph' && this.results.knowledge_graph) {
      const { entities, relationships } = this.results.knowledge_graph;
      
      return html`
        <div class="card">
          <h2>Knowledge Graph Summary</h2>
          <div class="key-metrics">
            <div class="key-metric">
              <div class="key-metric-value">${entities.length}</div>
              <div class="key-metric-label">Entities</div>
            </div>
            <div class="key-metric">
              <div class="key-metric-value">${relationships.length}</div>
              <div class="key-metric-label">Relationships</div>
            </div>
          </div>
        </div>
      `;
    }
    
    if (this.queryType === 'causal_graph' && this.results.causal_data) {
      const { factors, record_count } = this.results.causal_data;
      
      return html`
        <div class="card">
          <h2>Causal Analysis Summary</h2>
          <div class="key-metrics">
            <div class="key-metric">
              <div class="key-metric-value">${record_count}</div>
              <div class="key-metric-label">Data Points</div>
            </div>
            <div class="key-metric">
              <div class="key-metric-value">${Object.keys(factors).length}</div>
              <div class="key-metric-label">Causal Factors</div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Generic fallback for any data type
    return html`
      <div class="card">
        <h2>Data Preview</h2>
        <pre>${JSON.stringify(this.results, null, 2)}</pre>
      </div>
    `;
  }

  render() {
    const reasoningPrompts = this.getReasoningPrompts();
    
    return html`
      <div class="card">
        <h2>Process Mining & Analysis</h2>
        <p>Analyze workforce reskilling data through process mining and AI reasoning</p>
        
        <div class="form-group">
          <label for="query-type">Analysis Type:</label>
          <select id="query-type" @change=${this.handleQueryTypeChange} value=${this.queryType}>
            <option value="process_mining">Process Mining</option>
            <option value="knowledge_graph">Knowledge Graph</option>
            <option value="causal_graph">Causal Graph</option>
          </select>
        </div>
        
        ${this.queryType === 'process_mining' ? html`
          <div class="form-group">
            <label for="date-range">Date Range (Optional):</label>
            <select id="date-range" name="date_range" @change=${this.handleFilterChange}>
              <option value="">All Time</option>
              <option value="last_30">Last 30 Days</option>
              <option value="last_90">Last 90 Days</option>
              <option value="last_365">Last Year</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="training-program">Training Program (Optional):</label>
            <select id="training-program" name="training_program" @change=${this.handleFilterChange}>
              <option value="">All Programs</option>
              <option value="data_science">Data Science</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud_computing">Cloud Computing</option>
              <option value="project_management">Project Management</option>
            </select>
          </div>
        ` : ''}
        
        ${this.queryType === 'knowledge_graph' ? html`
          <div class="form-group">
            <label for="risk-level">Automation Risk Level (Optional):</label>
            <select id="risk-level" name="risk_level" @change=${this.handleFilterChange}>
              <option value="">All Levels</option>
              <option value="high">High Risk (>0.66)</option>
              <option value="medium">Medium Risk (0.33-0.66)</option>
              <option value="low">Low Risk (<0.33)</option>
            </select>
          </div>
        ` : ''}
        
        ${this.queryType === 'causal_graph' ? html`
          <div class="form-group">
            <label for="outcome">Training Outcome (Optional):</label>
            <select id="outcome" name="outcome" @change=${this.handleFilterChange}>
              <option value="">All Outcomes</option>
              <option value="success">Successful Completion</option>
              <option value="failure">Unsuccessful Completion</option>
            </select>
          </div>
        ` : ''}
        
        <button @click=${this.fetchProcessMiningData} ?disabled=${this.loading}>
          ${this.loading ? 'Loading...' : 'Analyze Data'}
        </button>
      </div>
      
      ${this.loading ? html`
        <div class="loader">
          <div class="spinner"></div>
        </div>
      ` : ''}
      
      ${this.results ? html`
        ${this.renderDataSummary()}
        
        ${this.graphImage ? html`
          <div class="card">
            <h2>Process Flow Visualization</h2>
            <img class="process-graph" src="data:image/png;base64,${this.graphImage}" alt="Process flow graph">
          </div>
        ` : ''}
        
        <div class="card">
          <h2>Ask AI for Insights</h2>
          <div class="form-group">
            <label for="question">Enter your question about the data:</label>
            <textarea id="question" rows="3" @input=${this.handleQuestionChange}
              placeholder="What insights can you provide about this data?"
            ></textarea>
          </div>
          
          ${reasoningPrompts.length > 0 ? html`
            <div class="suggested-questions">
              <p><strong>Suggested questions:</strong></p>
              <ul>
                ${reasoningPrompts.map(prompt => html`
                  <li><a href="#" @click=${e => { e.preventDefault(); this.question = prompt; }}>${prompt}</a></li>
                `)}
              </ul>
            </div>
          ` : ''}
          
          <button @click=${this.sendReasoningQuery} ?disabled=${this.loading || !this.question.trim()}>
            ${this.loading ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
        </div>
      ` : ''}
      
      ${this.reasoningResults ? html`
        <div class="card insights-card">
          <h2>AI Insights & Recommendations</h2>
          <div class="results-container">
            ${this.reasoningResults.analysis.split('\n').map(line => html`<p>${line}</p>`)}
          </div>
        </div>
      ` : ''}
    `;
  }
}

// Note: Don't register the component here, let the importing file handle registration
// This allows for custom element naming in different applications