import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReservaForm } from "@/components/ReservaForm";

const categoryLabels: Record<string, string> = {
  CONSOLE: "Consola",
  CONTROLLER: "Controladora",
  MIXER: "Mixer",
  SPEAKER: "Parlante",
  LIGHTING: "Iluminación",
  OTHER: "Otro",
};

export default async function EquipoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const equipo = await prisma.equipment.findUnique({
    where: { id: params.id },
  });

  if (!equipo) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-video bg-dark-900 rounded-xl overflow-hidden border border-dark-700">
          {equipo.image ? (
            <img
              src={equipo.image}
              alt={equipo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-24 h-24 text-dark-600"
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
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="badge bg-primary-600/20 text-primary-400">
              {categoryLabels[equipo.category] || equipo.category}
            </span>
            {equipo.available ? (
              <span className="badge-available">Disponible</span>
            ) : (
              <span className="badge-unavailable">No disponible</span>
            )}
          </div>
          <p className="text-dark-400 text-sm uppercase tracking-wide mb-1">
            {equipo.brand}
          </p>
          <h1 className="text-3xl font-bold text-white mb-4">{equipo.name}</h1>
          <p className="text-dark-300 mb-6 leading-relaxed">
            {equipo.description}
          </p>

          {/* Pricing */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Precios</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-800 rounded-lg p-4 text-center">
                <p className="text-dark-400 text-sm mb-1">Por hora</p>
                <p className="text-primary-400 text-2xl font-bold">
                  ${equipo.pricePerHour.toLocaleString()}
                </p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 text-center">
                <p className="text-dark-400 text-sm mb-1">Por día</p>
                <p className="text-accent-400 text-2xl font-bold">
                  ${equipo.pricePerDay.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          {equipo.available ? (
            <ReservaForm
              equipmentId={equipo.id}
              pricePerHour={equipo.pricePerHour}
              pricePerDay={equipo.pricePerDay}
            />
          ) : (
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 text-center">
              <p className="text-dark-400">
                Este equipo no está disponible actualmente. Volvé a consultar
                más adelante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
