import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-5xl mx-auto text-center px-4 py-8">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        Polla futbolera
      </h1>

      {/* Bienvenida y botones */}
      <div className="bg-[#f5e1ce] rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          ¡Bienvenido a la Quiniela!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Predice los resultados de los partidos y compite con otros usuarios.
        </p>
        {!currentUser ? (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-[#64c27b] text-white px-6 py-2 rounded-md hover:bg-[#9bfab0] transition-colors"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="bg-[#795548] text-white px-6 py-2 rounded-md hover:bg-[#5D4037] transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        ) : (
          <Link
            to="/predictions"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Ver Predicciones
          </Link>
        )}
      </div>

      {/* Tres pasos para participar */}
      <div>
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          ¡Arma tu polla futbolera en solo{" "}
          <span className="text-brown-600">3 pasos</span>!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Paso 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-5xl font-bold text-green-600 mb-4">1</div>
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Regístrate
            </h3>
            <p className="text-lg text-gray-700">
              Crea tu cuenta fácilmente en nuestro sitio para empezar a jugar.
            </p>
          </div>
          {/* Paso 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-5xl font-bold text-green-600 mb-4">2</div>
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Crea tu grupo
            </h3>
            <p className="text-lg text-gray-700">
              Elige el torneo, equipos y define las condiciones para tu polla.
            </p>
          </div>
          {/* Paso 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-5xl font-bold text-green-600 mb-4">3</div>
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Invita a tus amigos
            </h3>
            <p className="text-lg text-gray-700">
              Comparte tu grupo con amigos y empieza a hacer tus pronósticos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
