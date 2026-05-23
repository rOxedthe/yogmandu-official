"use client";

import { useState, forwardRef } from "react";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 44px 12px 16px",
  border: "1.5px solid #e8ddf5",
  borderRadius: 10,
  fontSize: 14,
  color: "#2A1208",
  background: "#fafafa",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { style, ...rest }, ref
) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        style={{ ...inputBaseStyle, ...style }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          padding: 4,
          cursor: "pointer",
          color: "#9A7860",
          display: "flex",
          alignItems: "center",
        }}
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
