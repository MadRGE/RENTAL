"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalEquipos: number;
  totalReservas: number;
  reservasPendientes: number;
  ingresosMes: number;
}

interface RecentReserva {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  equipment: { name: string; brand: string };
  user: { name: string; email: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recientes, setRecientes] = useState<RecentReserva[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const [equiposRes, reservasRes] = await Promise.all([
      fetch("/api/equipos"),
      fetch("/api/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const equipos = await equiposRes.json();
    const reservas = await reservasRes.json();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    setStats({
      totalEquipos: equipos.length,
      totalReservas: reservas.length,
      reservasPendientes: reservas.filter(
        (r: RecentReserva) => r.status === "PENDING"
      ).length,
      ingresosMes: reservas
        .filter(
          (r: RecentReserva) =>
            (r.status === "CONFIRMED" || r.status === "COMPLETED") &&
            new Date(r.createdAt) >= startOfMonth
        )
        .reduce((sum: number, r: RecentReserva) => sum + r.totalPrice, 0),
    });

    setRecientes(reservas.slice(0, 5));
  }

  const statusLabels: Record<string, { label: string; class: string }> = {
    PENDING: { label: "Pendiente", class: "badge-pending" },
    CONFIRMED: { label: "Confirmada", class: "badge-confirmed" },
    CANCELLED: {
      label: "Cancelada",
      class: "badge bg-red-500/20 text-red-400",
    },
    COMPLETED: {
      label: "Completada",
      class: "badge bg-green-500/20 text-green-400",
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Equipos",
            value: stats?.totalEquipos ?? "-",
            color: "text-primary-400",
            bg: "bg-primary-600/10",
          },
          {
            label: "Total Reservas",
            value: stats?.totalReservas ?? "-",
            color: "text-blue-400",
            bg: "bg-blue-600/10",
          },
          {
            label: "Pendientes",
            value: stats?.reservasPendientes ?? "-",
            color: "text-yellow-400",
            bg: "bg-yellow-600/10",
          },
          {
            label: "Ingresos del mes",
            value: stats
              ? `$${stats.ingresosMes.toLocaleString()}`
              : "-",
            color: "text-green-400",
            bg: "bg-green-600/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-dark-700 rounded-xl p-5`}
          >
            <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
            <p className={`${stat.color} text-2xl font-bold`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-white font-semibold">Reservas recientes</h2>
        </div>
        <div className="divide-y divide-dark-700">
          {recientes.length === 0 ? (
            <div className="p-8 text-center text-dark-400">
              No hay reservas todavía
            </div>
          ) : (
            recientes.map((r) => {
              const info = statusLabels[r.status] || {
                label: r.status,
                class: "badge",
              };
              return (
                <div
                  key={r.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium text-sm">
                      {r.equipment.brand} {r.equipment.name}
                    </p>
                    <p className="text-dark-500 text-xs">{r.user.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={info.class}>{info.label}</span>
                    <span className="text-primary-400 font-semibold text-sm">
                      ${r.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
