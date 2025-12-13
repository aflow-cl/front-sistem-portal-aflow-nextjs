interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: "default" | "orange" | "blue";
}

export function LoadingOverlay({
  isLoading,
  message = "Cargando...",
  variant = "orange",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const colorClass = {
    default: "bg-gray-500",
    orange: "bg-[#F97316]",
    blue: "bg-aflow-blue",
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative">
        {/* Animated waves */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 0.1, 0.2, 0.3, 0.4].map((delay, index) => (
            <div
              key={index}
              className={`w-4 h-4 ${colorClass} rounded-full animate-wave`}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <p className="mt-4 text-white text-center font-medium">{message}</p>
      </div>
    </div>
  );
}
