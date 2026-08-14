// ============================================
// pages/Analyzer.js - Engagement Analytics
// Uses Chart.js for data visualisation
// ============================================

import React, { useEffect, useState } from "react";
import { API } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Shared chart options for dark theme
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#8892a4", font: { family: "Inter", size: 11 } },
    },
    tooltip: {
      backgroundColor: "#1a2035",
      titleColor: "#e8eaf0",
      bodyColor: "#8892a4",
      borderColor: "#2a3150",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#555f72", font: { size: 11 } },
      grid: { color: "rgba(42,49,80,0.5)" },
    },
    y: {
      ticks: { color: "#555f72", font: { size: 11 } },
      grid: { color: "rgba(42,49,80,0.5)" },
    },
  },
};

const MetricCard = ({ label, value, icon, color, sub }) => (
  <div className="card">
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: color + "20",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            fontFamily: "'Space Grotesk',sans-serif",
            color,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              marginTop: "0.1rem",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function Analyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/overview")
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          color: "var(--text-muted)",
        }}
      >
        Loading analytics...
      </div>
    );

  const weekly = data?.weeklyData || [];

  // Chart datasets
  const reachChartData = {
    labels: weekly.map((w) => w.day),
    datasets: [
      {
        label: "Reach",
        data: weekly.map((w) => w.reach),
        fill: true,
        backgroundColor: "rgba(13,148,136,0.1)",
        borderColor: "#0d9488",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#0d9488",
      },
    ],
  };

  const likesChartData = {
    labels: weekly.map((w) => w.day),
    datasets: [
      {
        label: "Likes",
        data: weekly.map((w) => w.likes),
        backgroundColor: "rgba(20,184,166,0.7)",
        borderColor: "#14b8a6",
        borderRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const engagementChartData = {
    labels: weekly.map((w) => w.day),
    datasets: [
      {
        label: "Engagement %",
        data: weekly.map((w) => w.engagement),
        fill: true,
        backgroundColor: "rgba(34,197,94,0.1)",
        borderColor: "#22c55e",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#22c55e",
      },
    ],
  };

  const platformData =
    data?.platformBreakdown?.length > 0
      ? {
          labels: data.platformBreakdown.map((p) => p.name),
          datasets: [
            {
              data: data.platformBreakdown.map((p) => p.count),
              backgroundColor: ["#0d9488", "#14b8a6", "#22c55e", "#f59e0b"],
              borderColor: "var(--bg-card)",
              borderWidth: 2,
            },
          ],
        }
      : {
          labels: ["Twitter", "Instagram", "LinkedIn", "Facebook"],
          datasets: [
            {
              data: [40, 30, 20, 10],
              backgroundColor: ["#0d9488", "#14b8a6", "#22c55e", "#f59e0b"],
              borderColor: "var(--bg-card)",
              borderWidth: 2,
            },
          ],
        };

  return (
    <div>
      <div className="page-header">
        <h1>📊 Engagement Analyzer</h1>
        <p>Track your content performance and audience engagement</p>
      </div>

      {data?.isDemo && (
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--yellow)",
          }}
        >
          ⚡ Showing demo data — generate and save some posts to see your real
          analytics!
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <MetricCard
          icon="📝"
          label="Total Posts"
          value={data?.totalPosts ?? 0}
          color="#0d9488"
          sub="All time"
        />
        <MetricCard
          icon="👁️"
          label="Total Reach"
          value={(data?.totalReach ?? 0).toLocaleString()}
          color="#22c55e"
          sub="Unique impressions"
        />
        <MetricCard
          icon="❤️"
          label="Total Likes"
          value={(data?.totalLikes ?? 0).toLocaleString()}
          color="#14b8a6"
          sub="Across all posts"
        />
        <MetricCard
          icon="📈"
          label="Avg Engagement"
          value={`${data?.avgEngagement ?? 0}%`}
          color="#f59e0b"
          sub="Engagement rate"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
        <div className="card">
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Weekly Reach
          </h3>
          <div style={{ height: 220 }}>
            <Line data={reachChartData} options={{ ...chartDefaults }} />
          </div>
        </div>
        <div className="card">
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Daily Likes
          </h3>
          <div style={{ height: 220 }}>
            <Bar data={likesChartData} options={{ ...chartDefaults }} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
        <div className="card">
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Engagement Rate (%)
          </h3>
          <div style={{ height: 220 }}>
            <Line data={engagementChartData} options={{ ...chartDefaults }} />
          </div>
        </div>
        <div className="card">
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Platform Breakdown
          </h3>
          <div
            style={{
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Doughnut
              data={platformData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    labels: { color: "#8892a4", font: { size: 11 } },
                  },
                  tooltip: chartDefaults.plugins.tooltip,
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      {data?.topPerforming?.length > 0 && (
        <div className="card">
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            🏆 Top Performing Posts
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {data.topPerforming.map((post, i) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem",
                  background: "var(--bg-secondary)",
                  borderRadius: 8,
                }}
              >
                <span
                  style={{ fontSize: "1.1rem", width: 28, textAlign: "center" }}
                >
                  {["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}
                </span>
                <div
                  style={{
                    flex: 1,
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.content}
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--accent-light)",
                      fontWeight: 600,
                    }}
                  >
                    {post.engagement}%
                  </span>
                  <span
                    style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
                  >
                    ❤️ {post.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
