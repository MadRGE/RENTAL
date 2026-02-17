import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EquipoCard } from "@/components/EquipoCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredEquipment = await prisma.equipment.findMany({
    where: { featured: true, available: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    equipos: await prisma.equipment.count(),
    reservas: await prisma.reservation.count({
      where: { status: "COMPLETED" },
    }),
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-dark-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-block badge bg-primary-600/20 text-primary-400 mb-6 text-sm px-4 py-1.5">
              Alquiler de equipos profesionales
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Los mejores equipos
              <span className="text-primary-400"> DJ</span> para tu evento
            </h1>
            <p className="text-dark-300 text-lg sm:text-xl mb-8 max-w-2xl">
              Consolas, controladoras, mixers y más. Alquilá equipos
              profesionales por hora o por día para tus fiestas y eventos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/equipos" className="btn-primary text-center text-lg">
                Ver Equipos
              </Link>
              <a href="#como-funciona" className="btn-secondary text-center text-lg">
                Cómo funciona
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 max-w-md">
            <div>
              <p className="text-3xl font-bold text-primary-400">
                {stats.equipos}+
              </p>
              <p className="text-dark-400">Equipos disponibles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-400">
                {stats.reservas}+
              </p>
              <p className="text-dark-400">Eventos realizados</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Cómo funciona
          </h2>
          <p className="text-dark-400 text-center mb-12 max-w-2xl mx-auto">
            Reservar tu equipo es simple y rápido
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Elegí tu equipo",
                description:
                  "Explorá nuestro catálogo y elegí la consola, controladora o mixer que necesitás.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                ),
              },
              {
                step: "2",
                title: "Reservá fecha y hora",
                description:
                  "Seleccioná la fecha y horario que necesitás. Te confirmamos al instante.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                ),
              },
              {
                step: "3",
                title: "Pagá y disfrutá",
                description:
                  "Pagá de forma segura y retirá o recibí tu equipo el día acordado.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-dark-900 border border-dark-700 rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <div className="text-sm text-primary-400 font-medium mb-2">
                  Paso {item.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-dark-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      {featuredEquipment.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Equipos destacados
                </h2>
                <p className="text-dark-400 mt-2">
                  Los más pedidos por nuestros clientes
                </p>
              </div>
              <Link
                href="/equipos"
                className="btn-secondary text-sm hidden sm:block"
              >
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEquipment.map((equipo) => (
                <EquipoCard key={equipo.id} {...equipo} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/equipos" className="btn-secondary">
                Ver todos los equipos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-900/30 to-accent-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Tenés un evento próximo?
          </h2>
          <p className="text-dark-300 text-lg mb-8">
            Reservá ahora y asegurá tu equipo para la fecha que necesitás.
          </p>
          <Link href="/equipos" className="btn-accent text-lg">
            Reservar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
