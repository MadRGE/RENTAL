"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
  equipment: {
    name: string;
    brand: string;
    image: string | null;
    category: string;
  };
  payment: {
    status: string;
    method: string | null;
  } | null;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Pendiente", class: "badge-pending" },
  CONFIRMED: { label: "Confirmada", class: "badge-confirmed" },
  CANCELLED: { label: "Cancelada", class: "badge bg-red-500/20 text-red-400" },
  COMPLETED: {
    label: "Completada",
    class: "badge bg-green-500/20 text-green-400",
  },
};

export default function MisReservasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchReservas(token);
  }, [router]);

  async function fetchReservas(token: string) {
    try {
      const res = await fetch("/api/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      const data = await res.json();
      setReservas(data);
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }

  async function cancelReserva(id: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/reservas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    fetchReservas(token);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-dark-900 border border-dark-700 rounded-xl p-6 h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Reservas</h1>
          <p className="text-dark-400">Historial y estado de tus reservas</p>
        </div>
        <Link href="/equipos" className="btn-primary text-sm">
          Nueva reserva
        </Link>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-700 rounded-xl">
          <svg
            className="w-16 h-16 text-dark-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <p className="text-dark-400 text-lg mb-4">
            Todavía no tenés reservas
          </p>
          <Link href="/equipos" className="btn-primary">
            Explorar equipos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const statusInfo = statusLabels[reserva.status] || {
              label: reserva.status,
              class: "badge",
            };
            return (
              <div
                key={reserva.id}
                className="bg-dark-900 border border-dark-700 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Equipment image */}
                  <div className="w-20 h-20 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                    {reserva.equipment.image ? (
                      <img
                        src={reserva.equipment.image}
                        alt={reserva.equipment.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-dark-600"
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {reserva.equipment.brand} {reserva.equipment.name}
                      </h3>
                      <span className={statusInfo.class}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-dark-400 text-sm">
                      {formatDate(reserva.startDate)} -{" "}
                      {formatDate(reserva.endDate)}
                    </p>
                    {reserva.notes && (
                      <p className="text-dark-500 text-sm mt-1">
                        {reserva.notes}
                      </p>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-primary-400 font-bold text-lg">
                      ${reserva.totalPrice.toLocaleString()}
                    </p>
                    {reserva.payment && (
                      <p className="text-dark-500 text-xs">
                        Pago: {reserva.payment.status === "COMPLETED" ? "Pagado" : "Pendiente"}
                      </p>
                    )}
                    {reserva.status === "PENDING" && (
                      <button
                        onClick={() => cancelReserva(reserva.id)}
                        className="text-red-400 hover:text-red-300 text-sm mt-2"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
