import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBolt, faCopy, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PRESETS = [
  { label: "🚀 Product Launch", prompt: "We just launched our new AI analytics dashboard today after 6 months of work!", platform: "LinkedIn", tone: "Professional" },
  { label: "💡 Dev Hot Take", prompt: "AI isn't taking developer jobs, it's raising the bar for what one developer can build.", platform: "Twitter", tone: "Viral" },
  { label: "🔥 Growth Hack", prompt: "3 simple content habits that doubled our organic reach in 30 days without ads.", platform: "Instagram", tone: "Motivational" },
  { label: "☕ Remote Work", prompt: "Why async communication and documentation matter more than 8 daily video calls.", platform: "Threads", tone: "Casual" },
];

const PLATFORMS = [
  { id: "LinkedIn", label: "LinkedIn", icon: "💼" },
  { id: "Twitter", label: "Twitter / X", icon: "𝕏" },
  { id: "Instagram", label: "Instagram", icon: "📸" },
  { id: "Threads", label: "Threads", icon: "🌀" },
];

const TONES = [
  { id: "Professional", label: "Professional" },
  { id: "Casual", label: "Casual" },
  { id: "Viral", label: "Viral / Bold" },
  { id: "Motivational", label: "Inspiring" },
];

const GENERATE_OUTPUT = (platform, tone, prompt) => {
  const hashtags = {
    LinkedIn: "#BuildInPublic #AI #Leadership #StartupGrowth #Innovation",
    Twitter: "#BuildInPublic #DevCommunity #SaaS #Tech",
    Instagram: "#CreatorEconomy #GrowthMindset #Productivity #DigitalStrategy",
    Threads: "#TechThoughts #Solopreneur #WorkLife #AI",
  }[platform] || "#NEYRIX AI #ContentStrategy";

  if (prompt.includes("analytics dashboard") || prompt.includes("launched")) {
    if (platform === "LinkedIn") {
      return `🚀 After 6 months of intense building, debugging, and user testing — we just launched our new AI Analytics Dashboard!\n\nWhat it solves:\n• Eliminates manual data exports across 5+ channels\n• Predicts content performance before you publish\n• Gives actionable insights in plain English\n\nA massive thank you to our beta testers who helped shape every feature.\n\nTry it free today and let me know your thoughts!\n\n${hashtags}`;
    } else if (platform === "Twitter") {
      return `Big news: We just launched our AI Analytics Dashboard live today! 🚀\n\n6 months of building condensed into a 1-click dashboard that predicts post virality in real time.\n\nTry it 100% free (link in bio) 👇\n\n${hashtags}`;
    } else {
      return `WE ARE LIVE! 🚀✨\n\n6 months ago, we set out to build the simplest AI analytics dashboard for creators. Today, it's officially open to everyone!\n\nLink in bio to test it free! 💡\n\n${hashtags}`;
    }
  }

  if (prompt.includes("developer jobs")) {
    return `AI isn't taking developer jobs.\n\nIt's raising the bar for what ONE developer can build.\n\nA single engineer with AI tools can now launch products that used to require a 10-person agency.\n\nThe real skill of 2026 isn't syntax — it's system architecture & problem framing.\n\nAgree or disagree? 👇\n\n${hashtags}`;
  }

  if (prompt.includes("organic reach")) {
    return `3 content habits that doubled our organic reach in 30 days (without spending $1 on ads) 📈✨\n\n1. Strong Hook in the first 3 seconds\n2. Mobile-optimized line breaks (no wall of text!)\n3. Clear CTA asking for a save or share\n\nSave this post for your next content batch! 📌\n\n${hashtags}`;
  }

  return `Key Insight: ${prompt || "AI is transforming how creators publish content."}\n\nThree core takeaways:\n1. Focus on strategic positioning\n2. Automate repetitive formatting\n3. Maintain high output quality consistently\n\nHow are you tackling this in your workflow?\n\n${hashtags}`;
};

export default function GeneratorShowcase() {
  const [selectedPlatform, setSelectedPlatform] = useState("LinkedIn");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [customPrompt, setCustomPrompt] = useState(PRESETS[0].prompt);
  const [activePreset, setActivePreset] = useState(PRESETS[0].label);
  const [displayedText, setDisplayedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const startTypewriter = useCallback((text) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText("");
    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx <= text.length) {
        setDisplayedText(text.slice(0, idx));
        idx += 3;
      } else {
        setDisplayedText(text);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 12);
  }, []);

  const handleGenerate = useCallback((plat = selectedPlatform, tne = selectedTone, prmpt = customPrompt) => {
    setIsGenerating(true);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      const result = GENERATE_OUTPUT(plat, tne, prmpt);
      setIsGenerating(false);
      startTypewriter(result);
    }, 200);
  }, [selectedPlatform, selectedTone, customPrompt, startTypewriter]);

  useEffect(() => {
    handleGenerate("LinkedIn", "Professional", PRESETS[0].prompt);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(displayedText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const applyPreset = (preset) => {
    setSelectedPlatform(preset.platform);
    setSelectedTone(preset.tone);
    setCustomPrompt(preset.prompt);
    setActivePreset(preset.label);
    handleGenerate(preset.platform, preset.tone, preset.prompt);
  };

  return (
    <section id="content-generator" className="sai-generator-showcase-section">
      <div className="sai-section-container">
        <div className="sai-generator-grid">
          {/* LEFT: Text & Editorial Features */}
          <div className="generator-text-col">

            <h2 className="sai-section-title text-left">Turn ideas into content with AI.</h2>
            <p className="sai-section-sub text-left">
              Describe what you want to say and NEYRIX AI creates platform-ready content in seconds.
            </p>

            <ul className="sai-feature-bullets">
              <li>
                <FontAwesomeIcon icon={faCheck} className="bullet-check" />
                <span><strong>Choose your platform:</strong> LinkedIn, X, Instagram & Threads.</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="bullet-check" />
                <span><strong>Choose your tone:</strong> Professional, Casual, Viral, or Inspiring.</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="bullet-check" />
                <span><strong>Generate multiple variations:</strong> Instant hooks and bullet lists.</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="bullet-check" />
                <span><strong>Refine the result:</strong> Adjust line breaks and auto-generate hashtags.</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} className="bullet-check" />
                <span><strong>Copy or schedule:</strong> Send directly to your content calendar.</span>
              </li>
            </ul>

            <div className="generator-cta-row">
              <Link to="/register" className="sai-btn-primary">
                Try AI Generator <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0.4rem" }} />
              </Link>
            </div>
          </div>

          {/* RIGHT: Huge Interactive Generator App Window */}
          <div className="generator-ui-col">
            <div className="sai-interactive-app-window">
              <div className="app-window-header">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="window-title">NEYRIX AI Studio • Live Copilot</span>
                <span className="window-badge">Gemini Pro 1.5</span>
              </div>

              {/* Presets Row */}
              <div className="app-presets-row">
                <span className="preset-label">Ideas:</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={`preset-chip ${activePreset === p.label ? "active" : ""}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="app-controls">
                <div className="control-group">
                  <label>Platform</label>
                  <div className="chip-row">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPlatform(p.id); handleGenerate(p.id, selectedTone, customPrompt); }}
                        className={`chip-btn ${selectedPlatform === p.id ? "active" : ""}`}
                      >
                        <span>{p.icon}</span> {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Tone</label>
                  <div className="chip-row">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTone(t.id); handleGenerate(selectedPlatform, t.id, customPrompt); }}
                        className={`chip-btn ${selectedTone === t.id ? "active" : ""}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Bar */}
              <div className="app-input-bar">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="Type a topic or prompt..."
                  className="prompt-input"
                />
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="generate-btn"
                >
                  {isGenerating ? "Synthesizing..." : "⚡ Generate"}
                </button>
              </div>

              {/* Output Display */}
              <div className="app-output-screen">
                <div className="output-top-bar">
                  <div className="tags">
                    <span className="tag plat">{selectedPlatform}</span>
                    <span className="tag tone">{selectedTone}</span>
                  </div>
                  <span className="score">🔥 Virality Score: 98/100</span>
                </div>

                <pre className="output-pre">
                  {displayedText}
                  <span className="blinking-cursor">|</span>
                </pre>

                <div className="output-footer">
                  <button onClick={handleCopy} className="action-btn">
                    {copied ? "✓ Copied!" : "📋 Copy Post"}
                  </button>
                  <Link to="/register" className="action-btn highlight">
                    🚀 Schedule & Publish &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
