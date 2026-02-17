"use client";

import { useState } from "react";

interface ReservaFormProps {
  equipmentId: string;
  pricePerHour: number;
  pricePerDay: number;
}

export function ReservaForm({
  equipmentId,
  pricePerHour,
  pricePerDay,
}: ReservaFormProps) {
  const [mode, setMode] = useState<"hour" | "day">("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(4);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const calculateTotal = () => {
    if (mode === "hour") {
      return pricePerHour * hours;
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(
        1,
        Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return pricePerDay * days;
    }
    return pricePerDay;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Tenés que iniciar sesión para reservar");
      setLoading(false);
      return;
    }

    let start: Date;
    let end: Date;

    if (mode === "hour") {
      start = new Date(`${startDate}T${startTime}`);
      end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    } else {
      start = new Date(`${startDate}T10:00`);
      end = new Date(`${endDate}T10:00`);
    }

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipmentId,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          notes,
          totalPrice: calculateTotal(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear la reserva");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
        <svg
          className="w-12 h-12 text-green-400 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-green-400 font-semibold text-lg mb-1">
          Reserva creada
        </h3>
        <p className="text-dark-300 text-sm">
          Te confirmaremos tu reserva a la brevedad. Podés ver el estado en
          &quot;Mis Reservas&quot;.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-900 border border-dark-700 rounded-xl p-6"
    >
      <h3 className="text-white font-semibold text-lg mb-4">
        Hacer una reserva
      </h3>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("hour")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "hour"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-300 border border-dark-600"
          }`}
        >
          Por hora
        </button>
        <button
          type="button"
          onClick={() => setMode("day")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "day"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-300 border border-dark-600"
          }`}
        >
          Por día
        </button>
      </div>

      <div className="space-y-4">
        {mode === "hour" ? (
          <>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Fecha</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-300 text-sm mb-1">
                  Hora inicio
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-1">
                  Cantidad de horas
                </label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                    <option key={h} value={h}>
                      {h} hora{h > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-dark-300 text-sm mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field resize-none"
            rows={2}
            placeholder="Ej: Necesito delivery a zona norte..."
          />
        </div>

        {/* Total */}
        <div className="bg-dark-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-dark-300">Total estimado</span>
          <span className="text-2xl font-bold text-primary-400">
            ${calculateTotal().toLocaleString()}
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Procesando..." : "Confirmar reserva"}
        </button>
      </div>
    </form>
  );
}
