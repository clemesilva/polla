import React from "react";
import { Link, useLocation } from "react-router-dom";

function GrupoCreado() {
  const location = useLocation();
  const { formData, invitationLink } = location.state || {};

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
        <p>
          Felicidades, has creado tu Grupo Futbolero {formData?.nombre} con
          éxito.
        </p>
      </div>
      <p>
        A continuación puedes invitar a tus amigos a que participen en él. Solo
        toma nota del enlace de invitación generado y envíalo por correo
        electrónico o compártelo utilizando tus redes sociales.
      </p>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Enlace de invitación:</h3>
        <p>{invitationLink}</p>
      </div>
      <Link
        to="/mi-cuenta"
        className="bg-[#64c27b] text-white py-2 px-6 rounded-md hover:bg-[#2E7D32] transition-colors"
      >
        Mi Cuenta
      </Link>
    </div>
  );
}

export default GrupoCreado;
