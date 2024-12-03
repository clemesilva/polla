import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

function GrupoCreado() {
  const location = useLocation();
  const { formData, invitationLink } = location.state || {};

  // Verifica que formData y formData.id no sean undefined
  if (!formData || !formData.id) {
    console.error("formData o formData.id es undefined");
    return <p>Error: No se pudo cargar la información del grupo.</p>;
  }

  const [emails, setEmails] = useState("");

  const handleSendInvitations = async () => {
    const emailList = emails.split(",").map((email) => email.trim());
    const groupRef = doc(db, "grupos", formData.id); // Asegúrate de tener el ID del grupo

    try {
      await updateDoc(groupRef, {
        miembros: arrayUnion(...emailList), // Agrega los correos electrónicos a la lista de miembros
      });
      setEmails(""); // Limpiar el campo de entrada
      alert("Invitaciones enviadas!"); // Mostrar el alert
    } catch (error) {
      console.error("Error al enviar invitaciones: ", error);
      alert("Hubo un error al enviar las invitaciones.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    alert("Enlace copiado al portapapeles!");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
        <p>
          Felicidades, has creado tu Grupo Futbolero {formData?.nombre} con
          éxito.
        </p>
      </div>
      <p>A continuación puedes invitar a tus amigos a que participen en él.</p>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Enviar invitaciones:</h3>
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Ingresa los correos separados por comas"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b]"
        />
        <button
          onClick={handleSendInvitations}
          className="bg-[#64c27b] text-white py-2 px-4 rounded-md hover:bg-[#2E7D32] transition-colors mt-2"
        >
          Enviar Invitaciones
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Enlace de invitación:</h3>
        <p>{invitationLink}</p>
        <button
          onClick={handleCopyLink}
          className="bg-[#64c27b] text-white py-2 px-4 rounded-md hover:bg-[#2E7D32] transition-colors mt-2"
        >
          Copiar enlace
        </button>
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
