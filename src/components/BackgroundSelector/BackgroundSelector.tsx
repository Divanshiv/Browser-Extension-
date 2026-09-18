import {
  useState,
  useCallback,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSettings } from "../../context/settings-context";
import { getRandomImage } from "../../data/images";
import "./BackgroundSelector.css";

const PRESET_IMAGES = [
  "https://picsum.photos/seed/mountains/1920/1080",
  "https://picsum.photos/seed/ocean/1920/1080",
  "https://picsum.photos/seed/forest/1920/1080",
  "https://picsum.photos/seed/sunset/1920/1080",
  "https://picsum.photos/seed/city/1920/1080",
  "https://picsum.photos/seed/nature/1920/1080",
  "https://picsum.photos/seed/space/1920/1080",
  "https://picsum.photos/seed/abstract/1920/1080",
];

export const BackgroundSelector = ({
  onBackgroundChange,
}: {
  onBackgroundChange: (url: string) => void;
}) => {
  const { settings, dispatch } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = useCallback(
    (url: string) => {
      dispatch({ type: "SET_BACKGROUND_TYPE", payload: "picsum" });
      dispatch({ type: "SET_CUSTOM_BACKGROUND", payload: url });
      onBackgroundChange(url);
      setIsOpen(false);
    },
    [dispatch, onBackgroundChange],
  );

  const handleRandomBackground = useCallback(() => {
    const url = getRandomImage();
    dispatch({ type: "SET_BACKGROUND_TYPE", payload: "picsum" });
    dispatch({ type: "SET_CUSTOM_BACKGROUND", payload: "" });
    onBackgroundChange(url);
  }, [dispatch, onBackgroundChange]);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;

      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPreviewUrl(url);
        dispatch({ type: "SET_BACKGROUND_TYPE", payload: "custom" });
        dispatch({ type: "SET_CUSTOM_BACKGROUND", payload: url });
        onBackgroundChange(url);
        setUploading(false);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    },
    [dispatch, onBackgroundChange],
  );

  const handleUrlSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const url = previewUrl.trim();
      if (!url) return;
      dispatch({ type: "SET_BACKGROUND_TYPE", payload: "custom" });
      dispatch({ type: "SET_CUSTOM_BACKGROUND", payload: url });
      onBackgroundChange(url);
      setIsOpen(false);
    },
    [previewUrl, dispatch, onBackgroundChange],
  );

  const handleRemoveCustom = useCallback(() => {
    dispatch({ type: "SET_BACKGROUND_TYPE", payload: "picsum" });
    dispatch({ type: "SET_CUSTOM_BACKGROUND", payload: "" });
    const url = getRandomImage();
    onBackgroundChange(url);
    setPreviewUrl("");
  }, [dispatch, onBackgroundChange]);

  return (
    <>
      <button
        className="bg-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Change background"
        title="Change background"
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
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="bg-selector-panel"
          role="dialog"
          aria-label="Background selector"
        >
          <div className="bg-selector-header">
            <h3>Background</h3>
            <button
              className="bg-selector-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="bg-selector-section">
            <h4>Random from Picsum</h4>
            <button
              className="bg-random-btn"
              onClick={handleRandomBackground}
              disabled={uploading}
            >
              {uploading ? "Loading..." : "New Random Image"}
            </button>
          </div>

          <div className="bg-selector-section">
            <h4>Presets</h4>
            <div className="bg-preset-grid">
              {PRESET_IMAGES.map((url) => (
                <button
                  key={url}
                  className="bg-preset"
                  onClick={() => handlePresetSelect(url)}
                  style={{ backgroundImage: `url("${url}")` }}
                  aria-label="Select background"
                >
                  {settings.backgroundType === "picsum" &&
                    settings.customBackgroundUrl === url && (
                      <span className="bg-preset-check">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-selector-section">
            <h4>Custom Image</h4>
            {settings.backgroundType === "custom" &&
              settings.customBackgroundUrl && (
                <div className="bg-current-custom">
                  <div
                    className="bg-custom-preview"
                    style={{
                      backgroundImage: `url("${settings.customBackgroundUrl}")`,
                    }}
                  />
                  <button
                    className="bg-remove-btn"
                    onClick={handleRemoveCustom}
                    aria-label="Remove custom background"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            <form onSubmit={handleUrlSubmit} className="bg-url-form">
              <input
                type="url"
                placeholder="Image URL or drag & drop file"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                className="bg-url-input"
                aria-label="Custom image URL"
              />
              <label className="bg-file-label">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  hidden
                />
              </label>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundSelector;
