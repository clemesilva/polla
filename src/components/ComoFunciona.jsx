import { Link } from "react-router-dom";

function ComoFunciona() {
  return (
    <div className="flex min-h-screen bg-[#f5e1ce]">
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 bg-[#f5e1ce]">
        <h1 className="text-4xl font-bold text-[#64c27b] mb-8">
          ¿Cómo funciona TocaLaPolla?
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <p className="text-lg text-[#5D4037] font-semibold">
            TocaLaPolla NO se hace responsable de la entrega de algún premio una
            vez finalizado el juego. Nuestro sitio es una PLATAFORMA
            estrictamente para ENTRETENIMIENTO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Paso 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#64c27b]">1</span>
              <h2 className="text-2xl font-bold text-[#2E7D32]">
                Regístrate en nuestro sitio
              </h2>
            </div>
            <p className="text-lg text-[#5D4037] ml-14">
              Regístrate en nuestro sitio llenando un simple formulario.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#64c27b]">2</span>
              <h2 className="text-2xl font-bold text-[#2E7D32]">
                Crea tu grupo o juego
              </h2>
            </div>
            <div className="text-lg text-[#5D4037] ml-14 space-y-2">
              <p>
                Al crear un grupo quedas configurado como administrador del
                mismo. Podrás definir un nombre, descripción y condiciones
                especiales.
              </p>
              <p>
                Si te han invitado a participar, solo debes dar clic en el
                enlace de invitación.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#64c27b]">3</span>
              <h2 className="text-2xl font-bold text-[#2E7D32]">
                Invita a tus amigos
              </h2>
            </div>
            <p className="text-lg text-[#5D4037] ml-14">
              Define el grupo de amigos con los que quieres jugar. El grupo
              genera un URL de invitación para compartir. Límite de 100
              participantes por grupo.
            </p>
          </div>

          {/* Paso 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-[#64c27b]">4</span>
              <h2 className="text-2xl font-bold text-[#2E7D32]">¡A jugar!</h2>
            </div>
            <div className="text-lg text-[#5D4037] ml-14 space-y-2">
              <p>
                TocaLaPolla funciona por acumulación de puntos. Los resultados
                son solo para los 90 minutos reglamentarios.
              </p>
              <p>
                Actualizamos los resultados y mostramos la tabla de puntuación
                ¡totalmente gratis!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-1/4 bg-[#2E7D32] p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Guía Rápida</h3>
        <ul className="space-y-4">
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/register" className="block">
              1. Regístrate
            </Link>
          </li>
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/reglas" className="block">
              2. Revisa las reglas
            </Link>
          </li>
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/predictions" className="block">
              3. Haz tus predicciones
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ComoFunciona;
