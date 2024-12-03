import { useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAuth } from "../contexts/AuthContext";

function ResumenGrupo({ formData, onPrevious }) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [invitationLink, setInvitationLink] = useState("");
  const navigate = useNavigate(); // Inicializa useNavigate
  const { currentUser } = useAuth();

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "grupos"), {
        torneo: formData.torneo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        observaciones: formData.observaciones,
        fases: formData.fases,
        equipos: formData.equipos,
        miembros: [currentUser.email],
      });
      console.log("Grupo creado con ID: ", docRef.id);

      // Generar el enlace de invitación
      const inviteUrl = `https://tu-sitio.com/group/invite/${docRef.id}`;
      setInvitationLink(inviteUrl);
      setSuccessMessage(
        `Felicidades, has creado tu Grupo Futbolero ${formData.nombre} con éxito.`
      );

      // Redirigir a GrupoCreado
      setTimeout(() => {
        setLoading(false);
        navigate("/grupo-creado", {
          state: {
            formData: { ...formData, id: docRef.id },
            invitationLink: inviteUrl,
          },
        });
      }, 2000);
    } catch (e) {
      console.error("Error al crear el grupo: ", e);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Creando el grupo...</p>
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-[#2E7D32] mb-6">
            Resumen del Grupo
          </h2>

          {successMessage && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
              <p>{successMessage}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">Torneo:</h3>
            <p>{formData.torneo}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">Grupo:</h3>
            <p>{formData.nombre}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">
              Descripción:
            </h3>
            <p>{formData.descripcion}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">
              Observaciones:
            </h3>
            <p>{formData.observaciones}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">Fases:</h3>
            <ul>
              {formData.fases.map((fase) => (
                <li key={fase}>{fase}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#5D4037]">Equipos:</h3>
            <ul>
              {formData.equipos.map((equipo) => (
                <li key={equipo}>{equipo}</li>
              ))}
            </ul>
          </div>

          {invitationLink && (
            <div className="bg-yellow-100 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-[#5D4037]">
                Enlace de invitación:
              </h3>
              <p>{invitationLink}</p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrevious}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={handleCreateGroup}
              className="bg-[#64c27b] text-white py-2 px-6 rounded-md hover:bg-[#2E7D32] transition-colors"
            >
              Crear Grupo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ResumenGrupo;
