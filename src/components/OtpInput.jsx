import React, { useRef, useState, useEffect } from "react";

const OtpInput = ({ value, onChange, error }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  // Sync digits when value is updated externally (e.g. cleared)
  useEffect(() => {
    if (!value) {
      setDigits(["", "", "", "", "", ""]);
    } else if (value.length === 6 && value !== digits.join("")) {
      setDigits(value.split(""));
    }
  }, [value]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newDigits = [...digits];
    // Only take the last digit if multiple characters are entered
    newDigits[index] = val.substring(val.length - 1);
    setDigits(newDigits);
    onChange(newDigits.join(""));

    // Move focus forward
    if (val && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus backward on backspace
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newDigits = [...digits];

    pasteData.forEach((char, i) => {
      if (!isNaN(char) && i < 6) {
        newDigits[i] = char;
      }
    });

    setDigits(newDigits);
    onChange(newDigits.join(""));

    // Focus last filled box or next empty box
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs[nextIndex].current.focus();
  };

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <div
        className="d-flex justify-content-between gap-2 w-100 mb-2 mt-2"
        onPaste={handlePaste}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="text-center fw-bold"
            style={{
              width: "46px",
              height: "56px",
              fontSize: "24px",
              borderRadius: "10px",
              border: `2px solid ${error ? "#dc3545" : digit ? "#82ca6c" : "#e2e8f0"}`,
              backgroundColor: "#f8fafc",
              color: "#1e293b",
              transition: "all 0.2s ease-in-out",
              outline: "none",
              padding: "0",
              lineHeight: "56px", // Matches height for vertical centering
              display: "block",
              boxShadow: "none",
              appearance: "none", // Remove mobile defaults
              MozAppearance: "none",
              WebkitAppearance: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#82ca6c")}
            onBlur={(e) =>
              (e.target.style.borderColor = error
                ? "#dc3545"
                : digit
                  ? "#82ca6c"
                  : "#e2e8f0")
            }
          />
        ))}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default OtpInput;
