import React from "react";

const Spinner: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#3b82f6"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="4">
        <circle stroke="#e0e7ef" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

export default Spinner;