import Link from "next/link";

interface EquipoCardProps {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string | null;
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
}

const categoryLabels: Record<string, string> = {
  CONSOLE: "Consola",
  CONTROLLER: "Controladora",
  MIXER: "Mixer",
  SPEAKER: "Parlante",
  LIGHTING: "Iluminación",
  OTHER: "Otro",
};

export function EquipoCard({
  id,
  name,
  brand,
  category,
  image,
  pricePerHour,
  pricePerDay,
  available,
}: EquipoCardProps) {
  return (
    <Link href={`/equipos/${id}`} className="card group block">
      <div className="aspect-video bg-dark-800 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-dark-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge bg-dark-900/80 text-primary-400 backdrop-blur-sm">
            {categoryLabels[category] || category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {available ? (
            <span className="badge-available">Disponible</span>
          ) : (
            <span className="badge-unavailable">No disponible</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-dark-400 text-xs uppercase tracking-wide mb-1">
          {brand}
        </p>
        <h3 className="text-white font-semibold text-lg mb-3">{name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-400 font-bold text-lg">
              ${pricePerHour.toLocaleString()}
              <span className="text-dark-400 text-sm font-normal">/hora</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-dark-400 text-sm">
              ${pricePerDay.toLocaleString()}/día
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
