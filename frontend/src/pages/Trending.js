import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = [
  "all",
  "technology",
  "sports",
  "business",
  "health",
  "entertainment",
];

export default function Trending() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchTrending = async (cat) => {
    setLoading(true);
    try {
      const params = cat !== "all" ? `?interest=${cat}` : "";
      const res = await API.get(`/trending${params}`);
      setTopics(res.data.data);
      setLastUpdate(new Date(res.data.updatedAt).toLocaleTimeString());
    } catch (err) {
      toast.error("Failed to fetch trending topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(category);
  }, [category]);

  const generateForTopic = (topic) => {
    // Navigate to generator with topic pre-filled
    navigate(`/generator`);
    toast.success(`Generating content for ${topic}...`);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            🔥 Trending Topics
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Discover what's popular • Updated {lastUpdate || "just now"}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => fetchTrending(category)}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 20,
              border: "1px solid",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 500,
              transition: "all 0.15s",
              borderColor: category === cat ? "var(--accent)" : "var(--border)",
              background:
                category === cat
                  ? "rgba(13,148,136,0.15)"
                  : "var(--bg-secondary)",
              color:
                category === cat
                  ? "var(--accent-light)"
                  : "var(--text-secondary)",
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                height: 120,
                background:
                  "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-hover) 50%, var(--bg-card) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="card fade-in"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* Hot badge */}
              {topic.hot && (
                <span
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 20,
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                  }}
                >
                  🔥 HOT
                </span>
              )}

              {/* Rank */}
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                #{idx + 1} Trending
              </div>

              {/* Topic name */}
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--accent-light)",
                  marginBottom: "0.25rem",
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                {topic.topic}
              </div>

              {/* Stats row */}
              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {topic.posts}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      marginLeft: "0.25rem",
                    }}
                  >
                    posts
                  </span>
                </div>
                <div
                  style={{
                    color: topic.change?.startsWith("+")
                      ? "var(--green)"
                      : "var(--red)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {topic.change}
                </div>
              </div>

              {/* Action */}
              <button
                className="btn btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "0.78rem",
                }}
                onClick={() => generateForTopic(topic.topic)}
              >
                ✨ Generate Post for This
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  );
}
