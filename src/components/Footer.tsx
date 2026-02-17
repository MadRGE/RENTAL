import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-dark-400 text-sm">
              Alquiler de consolas, controladoras y equipos DJ para tus eventos
              y fiestas.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/equipos"
                  className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Equipos
                </Link>
              </li>
              <li>
                <Link
                  href="/mis-reservas"
                  className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Mis Reservas
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-dark-400 text-sm">
              <li>
                <a
                  href="https://wa.me/541131929239"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  WhatsApp: 11 3192-9239
                </a>
              </li>
              <li>Instagram: @rental.descontroladoras</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500 text-sm">
          &copy; {new Date().getFullYear()} Rental Des⚡Controladoras. Todos
          los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
