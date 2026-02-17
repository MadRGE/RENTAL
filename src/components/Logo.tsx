interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", smiley: "text-sm" },
    md: { icon: "w-10 h-10", text: "text-xl", smiley: "text-base" },
    lg: { icon: "w-14 h-14", text: "text-3xl", smiley: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.icon} bg-primary-500 rounded-full flex items-center justify-center`}
      >
        <span className={s.smiley}>&#x263A;</span>
      </div>
      {showText && (
        <span className={`${s.text} font-bold text-white leading-tight`}>
          <span className="text-primary-400">Rental</span>{" "}
          <span className="text-white">
            Des<span className="text-primary-400">⚡</span>Controladoras
          </span>
        </span>
      )}
    </div>
  );
}
