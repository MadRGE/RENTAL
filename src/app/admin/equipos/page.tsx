"use client";

import { useEffect, useState } from "react";

interface Equipment {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  image: string | null;
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
  featured: boolean;
}

const categoryOptions = [
  { value: "CONSOLE", label: "Consola" },
  { value: "CONTROLLER", label: "Controladora" },
  { value: "MIXER", label: "Mixer" },
  { value: "SPEAKER", label: "Parlante" },
  { value: "LIGHTING", label: "Iluminación" },
  { value: "OTHER", label: "Otro" },
];

const emptyForm = {
  name: "",
  brand: "",
  description: "",
  category: "CONTROLLER",
  image: "",
  pricePerHour: 0,
  pricePerDay: 0,
  available: true,
  featured: false,
};

export default function AdminEquiposPage() {
  const [equipos, setEquipos] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipos();
  }, []);

  async function fetchEquipos() {
    const res = await fetch("/api/equipos");
    const data = await res.json();
    setEquipos(data);
  }

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(equipo: Equipment) {
    setEditingId(equipo.id);
    setForm({
      name: equipo.name,
      brand: equipo.brand,
      description: equipo.description,
      category: equipo.category,
      image: equipo.image || "",
      pricePerHour: equipo.pricePerHour,
      pricePerDay: equipo.pricePerDay,
      available: equipo.available,
      featured: equipo.featured,
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const url = editingId ? `/api/equipos/${editingId}` : "/api/equipos";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        image: form.image || null,
        pricePerHour: Number(form.pricePerHour),
        pricePerDay: Number(form.pricePerDay),
      }),
    });

    resetForm();
    fetchEquipos();
    setLoading(false);
  }

  async function deleteEquipo(id: string) {
    if (!confirm("¿Estás seguro de eliminar este equipo?")) return;

    const token = localStorage.getItem("token");
    await fetch(`/api/equipos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEquipos();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Equipos</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary text-sm"
        >
          {showForm ? "Cancelar" : "+ Agregar equipo"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-dark-900 border border-dark-700 rounded-xl p-6 mb-6 space-y-4"
        >
          <h2 className="text-white font-semibold">
            {editingId ? "Editar equipo" : "Nuevo equipo"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input-field"
                placeholder="Ej: DDJ-1000"
                required
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">Marca</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                className="input-field"
                placeholder="Ej: Pioneer DJ"
                required
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="input-field"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                URL de imagen (opcional)
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                Precio por hora ($)
              </label>
              <input
                type="number"
                value={form.pricePerHour}
                onChange={(e) => updateField("pricePerHour", e.target.value)}
                className="input-field"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1">
                Precio por día ($)
              </label>
              <input
                type="number"
                value={form.pricePerDay}
                onChange={(e) => updateField("pricePerDay", e.target.value)}
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-1">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Descripción del equipo..."
              required
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => updateField("available", e.target.checked)}
                className="rounded border-dark-600 bg-dark-800"
              />
              Disponible
            </label>
            <label className="flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="rounded border-dark-600 bg-dark-800"
              />
              Destacado
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : editingId
              ? "Actualizar"
              : "Crear equipo"}
          </button>
        </form>
      )}

      {/* Equipment List */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700 text-left">
                <th className="px-4 py-3 text-dark-400 text-sm font-medium">
                  Equipo
                </th>
                <th className="px-4 py-3 text-dark-400 text-sm font-medium hidden sm:table-cell">
                  Categoría
                </th>
                <th className="px-4 py-3 text-dark-400 text-sm font-medium">
                  Precio/hora
                </th>
                <th className="px-4 py-3 text-dark-400 text-sm font-medium hidden sm:table-cell">
                  Precio/día
                </th>
                <th className="px-4 py-3 text-dark-400 text-sm font-medium">
                  Estado
                </th>
                <th className="px-4 py-3 text-dark-400 text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {equipos.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-dark-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0">
                        {equipo.image ? (
                          <img
                            src={equipo.image}
                            alt={equipo.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-dark-600 text-xs">
                            DJ
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {equipo.name}
                        </p>
                        <p className="text-dark-500 text-xs">{equipo.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-dark-300 text-sm">
                      {categoryOptions.find((c) => c.value === equipo.category)
                        ?.label || equipo.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-primary-400 text-sm font-medium">
                    ${equipo.pricePerHour.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-dark-300 text-sm hidden sm:table-cell">
                    ${equipo.pricePerDay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {equipo.available ? (
                      <span className="badge-available">Disponible</span>
                    ) : (
                      <span className="badge-unavailable">No disponible</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(equipo)}
                        className="text-primary-400 hover:text-primary-300 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteEquipo(equipo.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {equipos.length === 0 && (
          <div className="p-8 text-center text-dark-400">
            No hay equipos cargados
          </div>
        )}
      </div>
    </div>
  );
}
