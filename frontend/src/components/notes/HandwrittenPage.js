import React, { useRef, useEffect } from 'react';
import '../../pages/Notes.css';

// Seeded deterministic jitter calculation to keep organic character variations consistent & readable
function getDeterministicVariation(char, charIndex, wordIndex, lineIndex, intensity = 1) {
  if (!char || char === ' ' || char === '\n') return { rot: 0, dy: 0, dx: 0, opacity: 1 };
  
  const seed = (char.charCodeAt(0) * 17 + charIndex * 31 + wordIndex * 53 + lineIndex * 101) % 1000;
  
  // Subtle rotation: -1.2deg to +1.2deg
  const rot = (((seed % 200) - 100) / 100) * 1.2 * intensity;
  
  // Baseline waver: -1.5px to +1.5px
  const dy = ((((seed * 3) % 200) - 100) / 100) * 1.5 * intensity;
  
  // Slight tracking variation: -0.3px to +0.3px
  const dx = ((((seed * 7) % 200) - 100) / 100) * 0.3 * intensity;
  
  // Natural ink opacity variation: 0.94 to 1.0
  const opacity = 0.94 + (((seed * 11) % 60) / 1000);

  return { rot, dy, dx, opacity };
}

export default function HandwrittenPage({
  page,
  pageIndex = 0,
  isEditing = true,
  onChange,
  onFocus,
  readOnly = false,
  customScale = 1,
  id
}) {
  const textareaRef = useRef(null);

  const {
    content = '',
    font = 'Kalam',
    fontSize = 20,
    textColor = '#1e293b',
    lineSpacing = 1.8,
    letterSpacing = 0.5,
    paperStyle = 'ruled',
    handwritingJitter = 1
  } = page;

  // Auto-resize textarea to fit content seamlessly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(900, textareaRef.current.scrollHeight)}px`;
    }
  }, [content, fontSize, lineSpacing, font]);

  const handleContentChange = (e) => {
    if (onChange) {
      onChange(pageIndex, { ...page, content: e.target.value });
    }
  };

  const computedLineHeight = `${fontSize * lineSpacing}px`;

  // Render organic handwritten character variation spans for realistic preview / PDF export
  const renderHandwrittenFormatted = () => {
    if (!content) {
      return (
        <span style={{ color: '#94a3b8', fontStyle: 'italic', opacity: 0.6 }}>
          Start typing your notes here... (Use handwriting toolbar above to customize fonts, colors, and paper)
        </span>
      );
    }

    const lines = content.split('\n');

    return lines.map((line, lineIdx) => {
      const words = line.split(/(\s+)/);
      let globalCharOffset = 0;

      return (
        <div
          key={`line-${lineIdx}`}
          style={{
            minHeight: computedLineHeight,
            lineHeight: computedLineHeight,
            marginBottom: '1px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {words.map((word, wordIdx) => {
            if (/^\s+$/.test(word)) {
              globalCharOffset += word.length;
              return <span key={`space-${wordIdx}`}>{word}</span>;
            }

            const chars = word.split('');
            return (
              <span key={`word-${wordIdx}`} className="hw-word">
                {chars.map((ch, chIdx) => {
                  const currentGlobalCharIdx = globalCharOffset + chIdx;
                  const { rot, dy, dx, opacity } = getDeterministicVariation(
                    ch,
                    currentGlobalCharIdx,
                    wordIdx,
                    lineIdx,
                    handwritingJitter
                  );

                  return (
                    <span
                      key={`ch-${currentGlobalCharIdx}`}
                      className="hw-char"
                      style={{
                        display: 'inline-block',
                        transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                        opacity: opacity,
                        letterSpacing: `${letterSpacing}px`
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      id={id || `a4-page-${pageIndex}`}
      className={`a4-paper-canvas paper-${paperStyle}`}
      style={{
        transform: customScale !== 1 ? `scale(${customScale})` : undefined,
        transformOrigin: 'top center',
        fontFamily: `'${font}', cursive, sans-serif`,
        fontSize: `${fontSize}px`,
        color: textColor,
        lineHeight: computedLineHeight,
        letterSpacing: `${letterSpacing}px`
      }}
      onClick={() => {
        if (!readOnly && textareaRef.current) {
          textareaRef.current.focus();
        }
      }}
    >
      {readOnly ? (
        <div className="handwritten-content-display">
          {renderHandwrittenFormatted()}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className="handwriting-textarea"
          value={content}
          onChange={handleContentChange}
          onFocus={onFocus}
          placeholder="Start typing your notes here in handwriting... (Supports auto-save & PDF export)"
          style={{
            fontFamily: `'${font}', cursive, sans-serif`,
            fontSize: `${fontSize}px`,
            color: textColor,
            lineHeight: computedLineHeight,
            letterSpacing: `${letterSpacing}px`
          }}
          spellCheck={false}
        />
      )}
    </div>
  );
}
