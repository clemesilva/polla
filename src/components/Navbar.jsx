import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-green-100">
            TocaLaPolla
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="hover:bg-neutral-700 px-3 py-2 rounded transition"
            >
              Inicio
            </Link>
            <Link
              to="/reglas"
              className="hover:bg-neutral-700 px-3 py-2 rounded transition"
            >
              Reglas
            </Link>
            <Link
              to="/predictions"
              className="hover:bg-neutral-700 px-3 py-2 rounded transition"
            >
              Predicciones
            </Link>
            <Link
              to="/crear-grupo"
              className="hover:bg-neutral-700 px-3 py-2 rounded transition"
            >
              Crear Grupo
            </Link>
            <Link
              to="/partidos"
              className="hover:bg-neutral-700 px-3 py-2 rounded transition"
            >
              Partidos
            </Link>
          </div>
          <div className="flex space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/mi-cuenta"
                  className="bg-green-700 text-white hover:bg-green-600 px-3 py-2 rounded transition duration-200"
                >
                  Mi Cuenta
                </Link>
                <button
                  onClick={logout}
                  className="bg-green-700 text-white hover:bg-green-600 px-3 py-2 rounded transition duration-200"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-green-100 text-neutral-800 hover:bg-green-200 px-3 py-2 rounded transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-green-100 text-neutral-800 hover:bg-green-200 px-3 py-2 rounded transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
