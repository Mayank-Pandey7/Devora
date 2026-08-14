import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "how-it-works", label: "How It Works" },
  { id: "content-generator", label: "Content" },
  { id: "platforms", label: "Platforms" },
  { id: "analytics", label: "Analytics" },
  { id: "ai-features", label: "AI Features" },
  { id: "faq", label: "FAQ" },
];

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState("how-it-works");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const elem = document.getElementById(NAV_ITEMS[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -120;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sai-sticky-section-nav">
      <div className="section-nav-container">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => scrollToSection(e, item.id)}
            className={`section-nav-item ${activeSection === item.id ? "active" : ""}`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
