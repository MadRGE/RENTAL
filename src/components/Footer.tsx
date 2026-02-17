import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DJ</span>
              </div>
              <span className="text-xl font-bold text-white">
                DJ <span className="text-primary-400">Rental</span>
              </span>
            </div>
            <p className="text-dark-400 text-sm">
              Los mejores equipos DJ para tus eventos. Consolas, controladoras,
              mixers y más.
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
              <li>WhatsApp: +54 11 1234-5678</li>
              <li>Email: info@djrental.com</li>
              <li>Instagram: @djrental</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500 text-sm">
          &copy; {new Date().getFullYear()} DJ Rental. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
