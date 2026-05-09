import { useState, useRef } from "react";
import { Camera, X, Image as ImageIcon } from "lucide-react";

/**
 * Image file picker for proof of eco-actions.
 * Converts the selected image to a base64 data URL for local storage
 * and passes it back via onChange(dataUrl).
 */
export default function ImageProofInput({ value, onChange, label = "Proof Image" }) {
  const [preview, setPreview] = useState(value || "");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onChange?.(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function clearImage(e) {
    e.stopPropagation();
    setPreview("");
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
        <Camera size={13} className="text-primary" />
        {label}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="sr-only"
        id="proof-image-input"
      />

      {preview ? (
        <div className="proof-upload has-image relative group">
          <img
            src={preview}
            alt="Proof preview"
            className="w-full h-40 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-danger shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
          <p className="mt-2 text-xs text-accent-dark font-semibold text-center">
            Image attached ✓
          </p>
        </div>
      ) : (
        <label
          htmlFor="proof-image-input"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`proof-upload cursor-pointer ${dragOver ? "border-primary bg-primary-dim" : ""}`}
        >
          <ImageIcon size={28} className="mx-auto text-faint mb-2" />
          <p className="text-sm font-semibold text-ink">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-muted mt-1">
            PNG, JPG, WEBP up to 2MB
          </p>
        </label>
      )}
    </div>
  );
}
