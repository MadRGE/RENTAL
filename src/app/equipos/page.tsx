"use client";

import { useEffect, useState } from "react";
import { EquipoCard } from "@/components/EquipoCard";

interface Equipment {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string | null;
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
}

const categories = [
  { value: "", label: "Todos" },
  { value: "CONSOLE", label: "Consolas" },
  { value: "CONTROLLER", label: "Controladoras" },
  { value: "MIXER", label: "Mixers" },
  { value: "SPEAKER", label: "Parlantes" },
  { value: "LIGHTING", label: "Iluminación" },
  { value: "OTHER", label: "Otros" },
];

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipment[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipos();
  }, [category]);

  async function fetchEquipos() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    const res = await fetch(`/api/equipos?${params}`);
    const data = await res.json();
    setEquipos(data);
    setLoading(false);
  }

  const filtered = equipos.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Nuestros Equipos
        </h1>
        <p className="text-dark-400">
          Encontrá el equipo perfecto para tu evento
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-primary-600 text-white"
                  : "bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-dark-800" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-dark-800 rounded w-1/4" />
                <div className="h-5 bg-dark-800 rounded w-3/4" />
                <div className="h-4 bg-dark-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((equipo) => (
            <EquipoCard key={equipo.id} {...equipo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="text-dark-400 text-lg">
            No se encontraron equipos con esos filtros
          </p>
        </div>
      )}
    </div>
  );
}
