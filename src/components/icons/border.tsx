export function Border (props: React.SVGAttributes<{}>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path
          d="M23.6395 14.9029C22.0368 21.3315 15.5257 25.2438 9.09643 23.6407C2.66976 22.038 -1.24259 15.5266 0.360877 9.09839C1.96285 2.66908 8.47392 -1.24363 14.9014 0.359089C21.3303 1.96184 25.2423 8.47401 23.6395 14.9029Z"
          fill="#F7931A"
        />
        
        <path transform="translate(4,4)"
          d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
          fill="currentColor"
        />
    </svg>
  );
}
