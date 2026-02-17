"use client";

import { useEffect, useState } from "react";

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
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  payment: {
    id: string;
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

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  async function fetchReservas() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/reservas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReservas(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/reservas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchReservas();
  }

  async function registerPayment(reservationId: string, method: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch("/api/pagos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reservationId, method }),
    });

    fetchReservas();
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

  const filtered = filter
    ? reservas.filter((r) => r.status === filter)
    : reservas;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-dark-900 border border-dark-700 rounded-xl p-6 h-24"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Gestión de Reservas
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "", label: "Todas" },
          { value: "PENDING", label: "Pendientes" },
          { value: "CONFIRMED", label: "Confirmadas" },
          { value: "COMPLETED", label: "Completadas" },
          { value: "CANCELLED", label: "Canceladas" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary-600 text-white"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600"
            }`}
          >
            {tab.label}
            {tab.value === "" && ` (${reservas.length})`}
            {tab.value && ` (${reservas.filter((r) => r.status === tab.value).length})`}
          </button>
        ))}
      </div>

      {/* Reservations */}
      {filtered.length === 0 ? (
        <div className="bg-dark-900 border border-dark-700 rounded-xl p-8 text-center text-dark-400">
          No hay reservas con ese filtro
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reserva) => {
            const info = statusLabels[reserva.status] || {
              label: reserva.status,
              class: "badge",
            };
            return (
              <div
                key={reserva.id}
                className="bg-dark-900 border border-dark-700 rounded-xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Equipment Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                      {reserva.equipment.image ? (
                        <img
                          src={reserva.equipment.image}
                          alt={reserva.equipment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-dark-600 text-xs">
                          DJ
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {reserva.equipment.brand} {reserva.equipment.name}
                      </p>
                      <p className="text-dark-500 text-xs">
                        {formatDate(reserva.startDate)} -{" "}
                        {formatDate(reserva.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1">
                    <p className="text-dark-300 text-sm">{reserva.user.name}</p>
                    <p className="text-dark-500 text-xs">
                      {reserva.user.email}
                    </p>
                    {reserva.user.phone && (
                      <p className="text-dark-500 text-xs">
                        {reserva.user.phone}
                      </p>
                    )}
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center gap-4">
                    <span className={info.class}>{info.label}</span>
                    <span className="text-primary-400 font-bold">
                      ${reserva.totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {reserva.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(reserva.id, "CONFIRMED")
                          }
                          className="bg-green-600/20 text-green-400 hover:bg-green-600/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(reserva.id, "CANCELLED")
                          }
                          className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {reserva.status === "CONFIRMED" && (
                      <>
                        {!reserva.payment && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                registerPayment(reserva.id, e.target.value);
                              }
                            }}
                            className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1.5 text-xs text-dark-300"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Registrar pago
                            </option>
                            <option value="CASH">Efectivo</option>
                            <option value="TRANSFER">Transferencia</option>
                            <option value="CARD">Tarjeta</option>
                          </select>
                        )}
                        <button
                          onClick={() =>
                            updateStatus(reserva.id, "COMPLETED")
                          }
                          className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Completar
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {reserva.notes && (
                  <p className="text-dark-500 text-xs mt-2 border-t border-dark-800 pt-2">
                    Nota: {reserva.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
