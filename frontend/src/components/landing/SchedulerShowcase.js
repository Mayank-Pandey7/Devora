import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const CALENDAR_DAYS = [
  {
    day: "Monday",
    date: "Oct 14",
    post: {
      platform: "LinkedIn",
      icon: "💼",
      title: "🚀 NEYRIX AI Launch Update",
      time: "09:00 AM",
      status: "Scheduled",
      color: "#0A66C2",
    },
  },
  {
    day: "Tuesday",
    date: "Oct 15",
    post: {
      platform: "Instagram",
      icon: "📸",
      title: "✨ 3 Content Habits Carousel",
      time: "02:30 PM",
      status: "Scheduled",
      color: "#E4405F",
    },
  },
  {
    day: "Wednesday",
    date: "Oct 16",
    post: {
      platform: "Twitter / X",
      icon: "𝕏",
      title: "🔥 Tech Dev Hot Take Thread",
      time: "11:15 AM",
      status: "Scheduled",
      color: "#000000",
    },
  },
  {
    day: "Thursday",
    date: "Oct 17",
    post: {
      platform: "Threads",
      icon: "🌀",
      title: "☕ Async Work & Focus Blocks",
      time: "04:00 PM",
      status: "Draft",
      color: "#8B5CF6",
    },
  },
  {
    day: "Friday",
    date: "Oct 18",
    post: {
      platform: "Facebook",
      icon: "🌐",
      title: "🎉 Weekly Founder Recap",
      time: "10:00 AM",
      status: "Scheduled",
      color: "#1877F2",
    },
  },
];

export default function SchedulerShowcase() {
  return (
    <section className="sai-scheduler-showcase-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Plan your content. Stay consistent.</h2>
          <p className="sai-section-sub">
            Organize queues, automate posting schedules, and keep your multi-channel brand active without manual stress.
          </p>
        </div>

        {/* Visual Calendar Grid */}
        <div className="scheduler-calendar-card">
          <div className="calendar-top-bar">
            <div className="bar-title">
              <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#6D5DFB", marginRight: "0.5rem" }} />
              <span>Weekly Queue Calendar — October 2026</span>
            </div>
            <div className="bar-actions">
              <span className="queue-badge">5 Posts Queued</span>
            </div>
          </div>

          <div className="calendar-grid">
            {CALENDAR_DAYS.map((d) => (
              <div key={d.day} className="calendar-day-col">
                <div className="day-header">
                  <span className="day-name">{d.day}</span>
                  <span className="day-date">{d.date}</span>
                </div>

                <div className="day-body">
                  <div className="scheduled-item" style={{ borderLeft: `3px solid ${d.post.color}` }}>
                    <div className="item-top">
                      <span className="plat-icon">{d.post.icon}</span>
                      <span className="time">
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: "0.75rem", marginRight: "0.2rem" }} />
                        {d.post.time}
                      </span>
                    </div>
                    <h4 className="item-title">{d.post.title}</h4>
                    <div className="item-footer">
                      <span className="status-tag">
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.2rem" }} />
                        {d.post.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="calendar-footer-cta">
            <Link to="/register" className="sai-btn-primary">
              Plan your content <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0.4rem" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
