const iconPaths = {
  activity: "M4 12h4l2-7 4 14 2-7h4",
  gauge: "M5 17a8 8 0 1 1 14 0M12 14l4-4",
  ruler: "M4 16 16 4l4 4L8 20l-4-4Zm4-4 2 2m2-6 2 2",
  search: "m21 21-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  shuffle: "M16 3h5v5m0-5-6 6M4 7h4l8 10h5m0 0h-5v-5M4 17h4l2.5-3.1",
  sparkles: "M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z",
  weight: "M8 8a4 4 0 0 1 8 0m-9 0h10l2 12H5L7 8Zm5-2v3",
  zap: "M13 2 4 14h7l-1 8 9-12h-7l1-8"
};

export default function Icon({ name, size = 18, strokeWidth = 2.4, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={iconPaths[name] || iconPaths.gauge} />
    </svg>
  );
}
