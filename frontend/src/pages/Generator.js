import React, { useState } from "react";
import { API } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

const INTERESTS = [
  "technology",
  "sports",
  "business",
  "entertainment",
  "health",
  "science",
  "travel",
  "food",
];
const TONES = [
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "funny", label: "Funny", emoji: "😄" },
  { value: "motivational", label: "Motivational", emoji: "💪" },
  { value: "casual", label: "Casual", emoji: "😊" },
  { value: "inspirational", label: "Inspirational", emoji: "✨" },
];
const PLATFORMS = [
  { value: "twitter", label: "Twitter / X", emoji: "🐦", limit: 280 },
  { value: "instagram", label: "Instagram", emoji: "📸", limit: 2200 },
  { value: "linkedin", label: "LinkedIn", emoji: "💼", limit: 3000 },
  { value: "facebook", label: "Facebook", emoji: "👍", limit: 63206 },
];

export default function Generator() {
  const { user } = useAuth();
  const [interest, setInterest] = useState(
    user?.interests?.[0] || "technology",
  );
  const [tone, setTone] = useState(user?.defaultTone || "professional");
  const [platform, setPlatform] = useState("twitter");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  const generate = async (saveNow = false) => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await API.post("/content/generate", {
        interest,
        tone,
        platform,
        customPrompt: prompt
          ? `Write a ${tone} ${platform} post specifically about "${prompt}". Topic: ${prompt}. Interest category: ${interest}. Make it 100% about "${prompt}" only.`
          : undefined,
        save: saveNow,
      });
      setResult(res.data.data);
      if (saveNow) setSaved(true);
      // Add to local history
      setHistory((h) => [
        { ...res.data.data, generatedAt: new Date() },
        ...h.slice(0, 4),
      ]);
      toast.success(
        saveNow ? "Content generated & saved! ✅" : "Content generated! ✨",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.content);
    toast.success("Copied to clipboard!");
  };

  const charLimit = PLATFORMS.find((p) => p.value === platform)?.limit || 280;
  const charCount = result?.content?.length || 0;

  return (
    <div>
      <div className="page-header">
        <h1>✨ AI Content Generator</h1>
        <p>Generate engaging social media posts powered by AI</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Left: Controls */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Platform */}
          <div className="card">
            <label className="label">Platform</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPlatform(p.value)}
                  style={{
                    padding: "0.6rem 0.75rem",
                    borderRadius: 8,
                    border: "1px solid",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    transition: "all 0.15s",
                    textAlign: "left",
                    borderColor:
                      platform === p.value ? "var(--accent)" : "var(--border)",
                    background:
                      platform === p.value
                        ? "rgba(13,148,136,0.12)"
                        : "var(--bg-secondary)",
                    color:
                      platform === p.value
                        ? "var(--accent-light)"
                        : "var(--text-secondary)",
                  }}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interest */}
          <div className="card">
            <label className="label">Topic / Interest</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                marginTop: "0.5rem",
              }}
            >
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInterest(i)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    borderRadius: 20,
                    border: "1px solid",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    transition: "all 0.15s",
                    borderColor:
                      interest === i ? "var(--accent)" : "var(--border)",
                    background:
                      interest === i
                        ? "rgba(13,148,136,0.15)"
                        : "var(--bg-secondary)",
                    color:
                      interest === i
                        ? "var(--accent-light)"
                        : "var(--text-secondary)",
                  }}
                >
                  {i.charAt(0).toUpperCase() + i.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="card">
            <label className="label">Tone</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                marginTop: "0.5rem",
              }}
            >
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  style={{
                    padding: "0.35rem 0.8rem",
                    borderRadius: 20,
                    border: "1px solid",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    transition: "all 0.15s",
                    borderColor:
                      tone === t.value ? "var(--accent)" : "var(--border)",
                    background:
                      tone === t.value
                        ? "rgba(13,148,136,0.15)"
                        : "var(--bg-secondary)",
                    color:
                      tone === t.value
                        ? "var(--accent-light)"
                        : "var(--text-secondary)",
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt (optional) */}
          <div className="card">
            <label className="label">Custom keywords (optional)</label>
            <textarea
              className="textarea"
              style={{ marginTop: "0.5rem" }}
              placeholder="e.g. MS Dhoni, Football, IPL, Japan ..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* Generate Buttons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}
              onClick={() => generate(false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Generating...
                </>
              ) : (
                "✨ Generate"
              )}
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: "center", padding: "0.75rem" }}
              onClick={() => generate(true)}
              disabled={loading}
            >
              💾 Generate & Save
            </button>
          </div>
        </div>

        {/* Right: Result */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {result ? (
            <>
              {/* Generated Content */}
              <div className="card fade-in">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                    Generated Content
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {saved && (
                      <span className="badge badge-green">Saved ✓</span>
                    )}
                    <span className="badge badge-purple">
                      {result.source === "ai" ? "🤖 AI" : "📝 Template"}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    borderRadius: 10,
                    padding: "1rem",
                    marginBottom: "1rem",
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                    minHeight: 100,
                    border: "1px solid var(--border)",
                  }}
                >
                  {result.content}
                </div>

                {/* Char count */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color:
                        charCount > charLimit
                          ? "var(--red)"
                          : "var(--text-muted)",
                    }}
                  >
                    {charCount} / {charLimit} characters
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={copyToClipboard}
                    >
                      📋 Copy
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => generate(false)}
                      disabled={loading}
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                </div>

                {/* Hashtags */}
                {result.hashtags?.length > 0 && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                  >
                    {result.hashtags.map((h) => (
                      <span
                        key={h}
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: 20,
                          background: "rgba(13,148,136,0.1)",
                          color: "var(--accent-light)",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(13,148,136,0.2)",
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Prediction */}
              <div className="card fade-in">
                <h3
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  📈 Engagement Prediction
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
                  {[
                    {
                      label: "Engagement Score",
                      value: `${result.engagementPrediction?.score}%`,
                      color: "var(--accent)",
                    },
                    {
                      label: "Predicted Reach",
                      value: (
                        result.engagementPrediction?.reach || 0
                      ).toLocaleString(),
                      color: "var(--green)",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        background: "var(--bg-secondary)",
                        borderRadius: 8,
                        padding: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          color: m.color,
                          fontFamily: "'Space Grotesk',sans-serif",
                        }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.2rem",
                        }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✨</p>
              <p style={{ fontWeight: 500 }}>
                Your generated content will appear here
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                Select options on the left and click Generate
              </p>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                Recent Generations
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.6rem 0.75rem",
                      background: "var(--bg-secondary)",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      border: "1px solid var(--border)",
                    }}
                    onClick={() => setResult(h)}
                  >
                    {h.content.substring(0, 80)}…
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
