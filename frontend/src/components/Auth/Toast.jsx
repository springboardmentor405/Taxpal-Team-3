import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`tp-toast ${toast.type || "info"}`} role="status">
      <div className="tp-toast-body">
        <span className="tp-toast-text">{toast.text}</span>
        <button className="tp-toast-close" onClick={() => onClose && onClose()} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
