import React from "react";

const ChartUpIndicator = ({ color = "#045684" }) => {
  return (
    <svg
      width="161"
      height="130"
      viewBox="0 0 161 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_217_1150)">
        <path
          d="M1 112C38.8667 97.8023 120.28 55.7256 143 1"
          stroke={color}
          strokeWidth="5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_217_1150"
          x="0.122314"
          y="0.0414124"
          width="160.187"
          height="129.299"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="8" dy="8" />
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_217_1150"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_217_1150"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ChartUpIndicator;
