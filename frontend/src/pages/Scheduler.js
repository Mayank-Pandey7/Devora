import React, { useEffect, useState } from "react";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

const PLATFORM_EMOJI = {
  twitter: "🐦",
  instagram: "📸",
  linkedin: "💼",
  facebook: "👍",
};

export default function Scheduler() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    content: "",
    platform: "twitter",
    scheduledAt: "",
    tone: "professional",
    interest: "technology",
  });
  const [charCount, setCharCount] = useState(0);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/scheduler/scheduled");
      setPosts(res.data.data);
    } catch (err) {
      toast.error("Failed to load scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleContentChange = (e) => {
    setForm({ ...form, content: e.target.value });
    setCharCount(e.target.value.length);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }
    setSaving(true);
    try {
      const formToSend = {
        ...form,
        scheduledAt: form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : "",
      };
      await API.post("/scheduler/schedule", formToSend);
      toast.success(
        form.scheduledAt ? "🗓️ Post scheduled!" : "💾 Draft saved!",
      );
      setForm({
        content: "",
        platform: "twitter",
        scheduledAt: "",
        tone: "professional",
        interest: "technology",
      });
      setCharCount(0);
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const cancelSchedule = async (id) => {
    try {
      await API.put(`/scheduler/${id}/cancel`);
      toast.success("Moved to drafts");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  const deletePost = async (id) => {
    try {
      await API.delete(`/content/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // Get min datetime for scheduler
  const now = new Date(Date.now() + 5 * 60000);
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <div>
      <div className="page-header">
        <h1>📅 Post Scheduler</h1>
        <p>Plan and manage your content calendar</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Form */}
        <div className="card">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            Create / Schedule Post
          </h3>
          <form onSubmit={handleSchedule}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Content</label>
              <textarea
                className="textarea"
                rows={5}
                placeholder="Write your post here or paste generated content..."
                value={form.content}
                onChange={handleContentChange}
                required
              />
              <div
                style={{
                  fontSize: "0.72rem",
                  color:
                    charCount > 280 ? "var(--yellow)" : "var(--text-muted)",
                  marginTop: "0.3rem",
                  textAlign: "right",
                }}
              >
                {charCount} characters
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label className="label">Platform</label>
                <select
                  className="select"
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                >
                  <option value="twitter">🐦 Twitter / X</option>
                  <option value="instagram">📸 Instagram</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="facebook">👍 Facebook</option>
                </select>
              </div>
         
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label className="label">
                Schedule Date & Time (leave blank to save as draft)
              </label>
              <input
                className="input"
                type="datetime-local"
                min={minDateTime}
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner" />
                ) : form.scheduledAt ? (
                  "📅 Schedule Post"
                ) : (
                  "💾 Save as Draft"
                )}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setForm({
                    content: "",
                    platform: "twitter",
                    scheduledAt: "",
                    tone: "professional",
                    interest: "technology",
                  });
                  setCharCount(0);
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Scheduled + Drafts */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Scheduled */}
          <div className="card">
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              🗓️ Scheduled{" "}
              <span
                className="badge badge-yellow"
                style={{ marginLeft: "0.5rem" }}
              >
                {scheduled.length}
              </span>
            </h3>
            {loading ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Loading...
              </p>
            ) : scheduled.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: "1rem 0",
                }}
              >
                No scheduled posts yet
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {scheduled.map((post) => (
                  <div
                    key={post._id}
                    style={{
                      background: "var(--bg-secondary)",
                      borderRadius: 10,
                      padding: "0.9rem",
                      border: "1px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--yellow)",
                          fontWeight: 500,
                        }}
                      >
                        {PLATFORM_EMOJI[post.platform]} {post.platform}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        🕐 {new Date(post.scheduledAt).toLocaleString()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.83rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.6rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + "…"
                        : post.content}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.3rem 0.6rem",
                        }}
                        onClick={() => cancelSchedule(post._id)}
                      >
                        Unschedule
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.3rem 0.6rem",
                          color: "var(--red)",
                        }}
                        onClick={() => deletePost(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drafts */}
          <div className="card">
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              📝 Drafts{" "}
              <span
                className="badge badge-purple"
                style={{ marginLeft: "0.5rem" }}
              >
                {drafts.length}
              </span>
            </h3>
            {drafts.length === 0 ? (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: "1rem 0",
                }}
              >
                No drafts saved
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {drafts.map((post) => (
                  <div
                    key={post._id}
                    style={{
                      background: "var(--bg-secondary)",
                      borderRadius: 10,
                      padding: "0.9rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {PLATFORM_EMOJI[post.platform]} {post.platform}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.83rem",
                        color: "var(--text-secondary)",
                        marginBottom: "0.6rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + "…"
                        : post.content}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.3rem 0.6rem",
                          color: "var(--red)",
                        }}
                        onClick={() => deletePost(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
