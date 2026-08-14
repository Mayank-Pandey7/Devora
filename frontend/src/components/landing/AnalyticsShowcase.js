import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsShowcase() {
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Current"],
    datasets: [
      {
        label: "Total Impressions",
        data: [4200, 7800, 11400, 15900, 19200, 21800, 24800],
        borderColor: "#6D5DFB",
        backgroundColor: "rgba(109, 93, 251, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6D5DFB",
        pointRadius: 5,
      },
      {
        label: "Engagements",
        data: [1100, 2300, 3800, 5200, 6400, 7100, 8400],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointRadius: 5,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#64748B", font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: "#0F172A",
        padding: 12,
        titleColor: "#94A3B8",
        bodyColor: "#FFFFFF",
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748B" } },
      y: { grid: { color: "#1E293B" }, ticks: { color: "#64748B" } },
    },
  };

  return (
    <section id="analytics" className="sai-analytics-showcase-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Know what's working.</h2>
          <p className="sai-section-sub">
            Turn your social data into clear insights so you can create more of what your audience actually responds to.
          </p>
        </div>

        {/* Large Analytics Card Container */}
        <div className="sai-analytics-big-card">
          {/* Top Key Metrics Row */}
          <div className="analytics-metrics-grid">
            <div className="metric-tile">
              <span className="m-title">Total Reach</span>
              <span className="m-value">24.8K</span>
              <span className="m-badge green">+18.2% vs last month</span>
            </div>

            <div className="metric-tile">
              <span className="m-title">Engagement Rate</span>
              <span className="m-value">8.4%</span>
              <span className="m-badge green">+3.1% industry avg</span>
            </div>

            <div className="metric-tile">
              <span className="m-title">Total Likes</span>
              <span className="m-value">1,842</span>
              <span className="m-badge purple">High Viral Engagement</span>
            </div>

            <div className="metric-tile">
              <span className="m-title">Comments & Shares</span>
              <span className="m-value">363</span>
              <span className="m-badge blue">+42% conversation rate</span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="analytics-chart-wrap">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
