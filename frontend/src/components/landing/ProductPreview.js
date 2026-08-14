import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProductPreview() {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Organic Reach",
        data: [12400, 15800, 14200, 19500, 22100, 20800, 24800],
        fill: true,
        borderColor: "#6D5DFB",
        backgroundColor: "rgba(109, 93, 251, 0.12)",
        tension: 0.4,
        pointBackgroundColor: "#6D5DFB",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
      },
      {
        label: "Engagement",
        data: [3200, 4100, 3900, 5400, 6800, 6200, 8400],
        fill: true,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F172A",
        titleColor: "#94A3B8",
        bodyColor: "#FFFFFF",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11 } },
      },
      y: {
        grid: { color: "#1E293B" },
        ticks: { color: "#64748B", font: { size: 11 } },
      },
    },
  };

  return (
    <section id="product-demo" className="sai-product-preview-section">
      <div className="sai-preview-wrapper">
        {/* Main Dashboard Application Frame */}
        <div className="sai-mock-window">
          {/* Top Window Bar */}
          <div className="sai-window-header">
            <div className="sai-window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="sai-window-title">
              <span className="sparkle">✨</span> NEYRIX AI Demo — Workspace & Content Engine
            </div>
            <div className="sai-window-status">
              <span className="live-dot"></span> Live Demo
            </div>
          </div>

          {/* Application Workspace Content */}
          <div className="sai-mock-body">
            {/* Left Generator Panel */}
            <div className="sai-mock-panel generator-panel">
              <div className="panel-header">
                <h3>⚡ Create Your Next Post with AI</h3>
                <span className="panel-badge">Gemini Pro 1.5</span>
              </div>

              <div className="panel-input-group">
                <label>Topic / Prompt</label>
                <div className="mock-input">
                  Launch announcement for our AI social content workspace!
                </div>
              </div>

              <div className="panel-row">
                <div className="panel-col">
                  <label>Platform</label>
                  <div className="mock-chip active">💼 LinkedIn</div>
                </div>
                <div className="panel-col">
                  <label>Tone</label>
                  <div className="mock-chip active">🔥 High Engagement</div>
                </div>
              </div>

              <div className="panel-generated-output">
                <div className="output-header">
                  <span>Generated Post Draft</span>
                  <span className="score">🔥 Viral Index: 98/100</span>
                </div>
                <p className="output-text">
                  🚀 Excited to announce the official launch of NEYRIX AI!<br /><br />
                  Building a brand across 4 platforms shouldn't mean wasting 3 hours a day on manual copywriting.<br /><br />
                  Here is what NEYRIX AI solves:<br />
                  • 1-Click Platform Adaptation (LinkedIn, X, Instagram)<br />
                  • Real-time Virality Score & Engagement Health<br />
                  • Automated Topic Discovery & Smart Calendar<br /><br />
                  Try it 100% free today! #BuildInPublic #AI #SaaS
                </p>
              </div>
            </div>

            {/* Right Analytics Panel */}
            <div className="sai-mock-panel analytics-panel">
              <div className="panel-header">
                <h3>📊 Social Performance Analytics</h3>
                <span className="trend-up">+18.2% Growth</span>
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <div className="metric-box">
                  <span className="label">Total Reach</span>
                  <span className="value">24.8K</span>
                  <span className="sub green">+24.5% vs last week</span>
                </div>
                <div className="metric-box">
                  <span className="label">Engagement Rate</span>
                  <span className="value">8.4%</span>
                  <span className="sub green">+3.1% vs avg</span>
                </div>
                <div className="metric-box">
                  <span className="label">Viral Score</span>
                  <span className="value">98/100</span>
                  <span className="sub purple">Optimal Hook</span>
                </div>
              </div>

              {/* Chart.js Canvas */}
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Accent UI Pills */}
        <div className="sai-floating-pill float-1">
          <span className="icon">🔥</span>
          <span>Viral Index 98/100</span>
        </div>
        <div className="sai-floating-pill float-2">
          <span className="icon">📈</span>
          <span>+24.8K Reach Growth</span>
        </div>
        <div className="sai-floating-pill float-3">
          <span className="icon">⚡</span>
          <span>Post Drafted in 4s</span>
        </div>
      </div>
    </section>
  );
}
