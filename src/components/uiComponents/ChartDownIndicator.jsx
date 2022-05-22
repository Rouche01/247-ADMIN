import React from "react";

const ChartDownIndicator = ({ color = "#035524" }) => {
  return (
    <svg
      width="163"
      height="112"
      viewBox="0 0 163 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_217_1170)">
        <path
          d="M1 3C45.3333 6.33333 136.2 29.6 145 96"
          stroke={color}
          strokeWidth="5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_217_1170"
          x="0.8125"
          y="0.50705"
          width="161.666"
          height="110.821"
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
            result="effect1_dropShadow_217_1170"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_217_1170"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ChartDownIndicator;
