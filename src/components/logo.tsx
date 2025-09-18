import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EduResult Pro Logo"
    >
      <g>
        <path
          d="M20,80 L20,30 C20,20 30,20 30,30 L30,70 C30,60 40,60 40,70 L40,80"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60,20 L60,70 C60,80 70,80 70,70 L70,30 C70,40 80,40 80,30 L80,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="10" className="fill-accent" />
      </g>
    </svg>
  );
}
