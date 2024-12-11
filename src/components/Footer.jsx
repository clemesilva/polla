import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-neutral-600 to-neutral-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 - Logo y descripción */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Primera división de Chilena
            </h3>
            <p className="text-green-100">
              La mejor plataforma para predecir resultados de la Primera
              división de Chile.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/reglas" className="text-green-100 hover:text-white">
                  Reglas del Juego
                </Link>
              </li>
              <li>
                <Link
                  to="/predictions"
                  className="text-green-100 hover:text-white"
                >
                  Hacer Predicciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Redes sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-green-100 hover:text-white">
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="#" className="text-green-100 hover:text-white">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 pt-4 text-center text-green-100">
          <p>&copy; Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
