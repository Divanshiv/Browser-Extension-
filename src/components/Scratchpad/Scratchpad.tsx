import { useState, useEffect, useRef, useCallback } from "react";
import "./Scratchpad.css";

const STORAGE_KEY = "scratchpad";

function loadScratchpad(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export const Scratchpad = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(loadScratchpad);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Auto-save every 2 seconds
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, content);
      } catch {
        // Storage full or unavailable — silently ignore
      }
    }, 2000);
    return () => {
      if (saveTimerRef.current !== undefined) {
        clearInterval(saveTimerRef.current);
      }
    };
  }, [content]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Auto-bullet: if user presses Enter after a line starting with "- " or "* "
      if (e.key === "Enter") {
        const textarea = e.currentTarget;
        const cursorPos = textarea.selectionStart;
        const lines = content.slice(0, cursorPos).split("\n");
        const currentLine = lines[lines.length - 1];

        const bulletMatch = currentLine.match(/^(\s*)[-*]\s/);
        if (bulletMatch) {
          e.preventDefault();
          const indent = bulletMatch[1];
          const insertion = `\n${indent}- `;
          const newCursor = cursorPos + insertion.length;
          setContent(
            (prev) =>
              prev.slice(0, cursorPos) + insertion + prev.slice(cursorPos),
          );
          // Restore cursor position after React re-render
          requestAnimationFrame(() => {
            textarea.selectionStart = newCursor;
            textarea.selectionEnd = newCursor;
          });
        }
      }
    },
    [content],
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <button
        className={`scratchpad-toggle${isOpen ? " scratchpad-toggle--active" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Close scratchpad" : "Open scratchpad"}
        aria-expanded={isOpen}
        title="Quick Notes"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="scratchpad-panel">
          <div className="scratchpad-header">
            <span className="scratchpad-title">Quick Notes</span>
            <span className="scratchpad-hint">Auto-saved</span>
          </div>
          <textarea
            ref={textareaRef}
            className="scratchpad-textarea"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type anything...&#10;&#10;Tip: start a line with &#39;- &#39; for quick bullets"
            spellCheck={false}
            aria-label="Scratchpad notes"
          />
        </div>
      )}
    </>
  );
};
