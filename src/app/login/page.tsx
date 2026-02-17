"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/mis-reservas");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p className="text-dark-400">
            Ingresá a tu cuenta para gestionar tus reservas
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-900 border border-dark-700 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-dark-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-dark-300 text-sm mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-center text-dark-400 text-sm">
            ¿No tenés cuenta?{" "}
            <Link
              href="/registro"
              className="text-primary-400 hover:text-primary-300"
            >
              Registrate
            </Link>
          </p>
        </form>

        <div className="mt-6 bg-dark-900/50 border border-dark-700 rounded-xl p-4">
          <p className="text-dark-400 text-xs text-center mb-2">
            Cuentas de prueba:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-dark-800 rounded-lg p-2">
              <p className="text-primary-400 font-medium">Admin</p>
              <p className="text-dark-400">admin@djrental.com</p>
              <p className="text-dark-500">admin123</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-2">
              <p className="text-primary-400 font-medium">Cliente</p>
              <p className="text-dark-400">cliente@test.com</p>
              <p className="text-dark-500">cliente123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
