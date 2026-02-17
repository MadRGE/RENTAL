"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-900/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DJ</span>
            </div>
            <span className="text-xl font-bold text-white">
              DJ <span className="text-primary-400">Rental</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/equipos"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Equipos
            </Link>
            <Link
              href="/mis-reservas"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Mis Reservas
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Iniciar Sesión
            </Link>
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
              className="block text-dark-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/equipos"
              className="block text-dark-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Equipos
            </Link>
            <Link
              href="/mis-reservas"
              className="block text-dark-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Mis Reservas
            </Link>
            <Link
              href="/login"
              className="block btn-primary text-sm text-center"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
