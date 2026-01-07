export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Brain/memory shape with connected nodes representing relationships */}
        <path
          d="M16 4C12.5 4 9 6.5 9 10C9 11 9.2 11.9 9.6 12.7C8.6 13.5 8 14.7 8 16C8 17.3 8.6 18.5 9.6 19.3C9.2 20.1 9 21 9 22C9 25.5 12.5 28 16 28C19.5 28 23 25.5 23 22C23 21 22.8 20.1 22.4 19.3C23.4 18.5 24 17.3 24 16C24 14.7 23.4 13.5 22.4 12.7C22.8 11.9 23 11 23 10C23 6.5 19.5 4 16 4Z"
          fill="currentColor"
          className="text-primary"
          opacity="0.15"
        />

        {/* Connection nodes */}
        <circle cx="16" cy="10" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="11" cy="16" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="21" cy="16" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="16" cy="22" r="2.5" fill="currentColor" className="text-primary" />

        {/* Connection lines */}
        <line
          x1="16"
          y1="10"
          x2="11"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.6"
        />
        <line
          x1="16"
          y1="10"
          x2="21"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.6"
        />
        <line
          x1="11"
          y1="16"
          x2="16"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.6"
        />
        <line
          x1="21"
          y1="16"
          x2="16"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
          opacity="0.6"
        />

        {/* Heart accent in the center */}
        <path
          d="M16 18C16 18 14 16.5 14 15.5C14 14.7 14.4 14 15.2 14C15.7 14 16 14.3 16 14.3C16 14.3 16.3 14 16.8 14C17.6 14 18 14.7 18 15.5C18 16.5 16 18 16 18Z"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
      <span className="text-2xl font-semibold text-foreground">Remember</span>
    </div>
  )
}
