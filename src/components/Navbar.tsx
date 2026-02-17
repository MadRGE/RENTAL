"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <nav className="bg-dark-900/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Logo size="sm" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-dark-300 hover:text-primary-400 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/equipos"
              className="text-dark-300 hover:text-primary-400 transition-colors"
            >
              Equipos
            </Link>
            {user ? (
              <>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    Panel Admin
                  </Link>
                ) : (
                  <Link
                    href="/mis-reservas"
                    className="text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    Mis Reservas
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-dark-400 text-sm">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-dark-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-300 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-dark-700 py-4 space-y-3">
            <Link
              href="/"
              className="block text-dark-300 hover:text-primary-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/equipos"
              className="block text-dark-300 hover:text-primary-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Equipos
            </Link>
            {user ? (
              <>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="block text-dark-300 hover:text-primary-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Panel Admin
                  </Link>
                ) : (
                  <Link
                    href="/mis-reservas"
                    className="block text-dark-300 hover:text-primary-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Mis Reservas
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-red-400 text-sm"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block btn-primary text-sm text-center"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
