function CloverIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31 31C20 20 14 9 22 5C30 1 34 10 32 22C36 10 44 1 52 7C60 13 49 24 35 31C49 29 62 33 59 43C56 53 43 48 34 35C36 49 31 61 22 58C12 55 18 42 31 31Z"
        fill="currentColor"
      />
      <path
        d="M33 34C39 44 42 53 45 60"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CloverIcon;