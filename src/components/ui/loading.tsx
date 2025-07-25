import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-16 w-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-6 border-muted opacity-25" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-6 border-t-primary animate-spin" />
        </div>
      </div>
    </div>
  );
}
