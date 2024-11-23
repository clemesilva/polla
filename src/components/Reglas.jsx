import React from "react";
import { Link } from "react-router-dom";

function Reglas() {
  return (
    <div className="flex min-h-screen bg-[#f5e1ce]">
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 bg-[#f5e1ce]">
        <h1 className="text-4xl font-bold text-[#64c27b] mb-6">
          Reglas de la Polla
        </h1>
        <p className="text-lg text-[#5D4037] mb-6">
          En las Pollas, cada usuario podrá hacer su pronóstico de los
          resultados de los partidos. Aquí te explicamos cómo funciona la
          puntuación:
        </p>
        <h2 className="text-2xl font-bold text-[#9bfab0] mb-4">Puntuación</h2>
        <p className="text-lg text-[#5D4037] mb-4">
          Para cada partido, podrás acumular puntos según las siguientes reglas:
        </p>
        <ul className="list-disc pl-6 text-[#5D4037] space-y-4">
          <li>
            <strong className="text-[#64c27b]">
              Por acertar el resultado exacto (ganador o empate):
            </strong>
            <br />
            Obtendrás <span className="font-bold text-[#64c27b]">
              5 puntos
            </span>{" "}
            si aciertas el resultado exacto (por ejemplo, pronosticaste 2-1 y el
            resultado fue 2-1).
          </li>
          <li>
            <strong className="text-[#64c27b]">
              Por acertar la cantidad de goles de cada equipo:
            </strong>
            <br />
            Obtendrás <span className="font-bold text-[#64c27b]">
              2 puntos
            </span>{" "}
            por cada equipo cuyo número de goles acertaste (por ejemplo, si el
            partido termina 3-1 y tu pronóstico fue 0-1, obtienes 2 puntos por
            acertar los goles del visitante).
          </li>
          <li>
            <strong className="text-[#64c27b]">
              Por acertar la diferencia de goles:
            </strong>
            <br />
            Obtendrás <span className="font-bold text-[#64c27b]">
              1 punto
            </span>{" "}
            si aciertas la diferencia de goles entre ambos equipos (por ejemplo,
            si el partido termina 3-1 y tu pronóstico fue 2-0, aciertas la
            diferencia de +2).
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-[#9bfab0] mt-6 mb-4">Ejemplo</h2>
        <p className="text-lg text-[#5D4037] mb-4">
          Imagina que el partido termina{" "}
          <span className="font-bold text-[#64c27b]">3-1</span> y tu pronóstico
          fue <span className="font-bold text-[#64c27b]">2-0</span>:
        </p>
        <ul className="list-disc pl-6 text-[#5D4037] space-y-4">
          <li>
            No obtienes puntos por acertar el resultado exacto porque no
            coincide.
          </li>
          <li>
            No obtienes puntos por acertar el número de goles del equipo local
            porque pronosticaste 2 goles y el equipo local anotó 3.
          </li>
          <li>
            Obtienes <span className="font-bold text-[#64c27b]">1 punto</span>{" "}
            por acertar la diferencia de goles (+2 en ambos casos).
          </li>
        </ul>
        <p className="text-lg text-[#5D4037] mt-6">
          ¡Anímate a participar y demuestra tus conocimientos sobre el fútbol
          chileno!
        </p>
      </div>
      {/* Sidebar */}
      <div className="w-1/4 bg-[#2E7D32] p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Guía del Usuario</h3>
        <ul className="space-y-4">
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/register" className="block">
              1. Regístrate en nuestro sitio
            </Link>
          </li>
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/invitacion" className="block">
              2. Accede mediante URL de invitación
            </Link>
          </li>
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/cuenta" className="block">
              3. Revisa tus grupos en Mi Cuenta
            </Link>
          </li>
          <li className="hover:bg-[#1B5E20] p-3 rounded cursor-pointer transition-colors">
            <Link to="/predictions" className="block">
              4. Haz tus pronósticos
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Reglas;
