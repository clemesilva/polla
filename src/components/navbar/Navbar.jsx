import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Reglas", href: "/reglas" },
  { name: "Crear Grupo", href: "/crear-grupo" },
  { name: "Partidos", href: "/partidos" },
  { name: "Tabla", href: "/tablaPosiciones" },
];

export default function NavbarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full bg-gradient-to-r from-neutral-600 to-neutral-900 text-white shadow-lg">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">TocaLaPolla</span>
            <h1 className="text-lg font-bold text-green-100">TocaLaPolla</h1>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-green-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 text-green-100 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {currentUser ? (
            <>
              <span className="text-sm font-semibold leading-6 text-green-100 mr-4">
                Bienvenido, {currentUser.displayName}{" "}
                {/* Mostrar el nombre del usuario */}
              </span>
              <Link
                to="/mi-cuenta"
                className="text-sm font-semibold leading-6 text-green-100 hover:text-white transition-colors mr-4"
              >
                Mi Cuenta
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold leading-6 text-green-100 hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-green-100 hover:text-white transition-colors"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <DialogPanel className="fixed inset-0 z-50 w-full bg-neutral-800 px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={handleCloseMenu}>
              <span className="sr-only">TocaLaPolla</span>
              <h1 className="text-lg font-bold text-green-100">TocaLaPolla</h1>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-green-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-base font-semibold leading-7 text-green-100 hover:bg-gray-700 rounded-lg px-3 py-2"
                onClick={handleCloseMenu}
              >
                {item.name}
              </Link>
            ))}
            {currentUser ? (
              <>
                <Link
                  to="/mi-cuenta"
                  className="block text-base font-semibold leading-7 text-green-100 hover:bg-gray-700 rounded-lg px-3 py-2"
                  onClick={handleCloseMenu}
                >
                  Mi Cuenta
                </Link>
                <button
                  onClick={() => {
                    logout();
                    handleCloseMenu();
                  }}
                  className="block text-left w-full text-base font-semibold leading-7 text-green-100 hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-base font-semibold leading-7 text-green-100 hover:bg-gray-700 rounded-lg px-3 py-2"
                onClick={handleCloseMenu}
              >
                Log In
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
