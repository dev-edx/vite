const Avatar = () => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
    >
      <mask
        id=":r2:"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
      </mask>
      <g mask="url(#:r2:)">
        <rect width="36" height="36" fill="#11365E"></rect>
        <rect
          x="0"
          y="0"
          width="36"
          height="36"
          transform="translate(2 2) rotate(42 18 18) scale(1)"
          fill="#73B06F"
          rx="36"
        ></rect>
        <g transform="translate(-2 -5) rotate(-2 18 18)">
          <path
            d="M15 19c2 1 4 1 6 0"
            stroke="#000000"
            fill="none"
            strokeLinecap="round"
          ></path>
          <rect
            x="12"
            y="14"
            width="1.5"
            height="2"
            rx="1"
            stroke="none"
            fill="#000000"
          ></rect>
          <rect
            x="22"
            y="14"
            width="1.5"
            height="2"
            rx="1"
            stroke="none"
            fill="#000000"
          ></rect>
        </g>
      </g>
    </svg>
  );
};

export default Avatar;
