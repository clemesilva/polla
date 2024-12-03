import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Importa el contexto de autenticación
import { v4 as uuidv4 } from "uuid";

function MiCuenta() {
  const { currentUser } = useAuth(); // Obtén el usuario actual
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupID, setGroupID] = useState(""); // Estado para el groupID a unirse

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const gruposCollection = collection(db, "grupos");
        const gruposSnapshot = await getDocs(gruposCollection);
        const gruposList = gruposSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtrar grupos donde el usuario actual es miembro
        const misGrupos = gruposList.filter((grupo) =>
          grupo.miembros.includes(currentUser.email)
        );
        setGrupos(misGrupos);
      } catch (error) {
        console.error("Error al obtener los grupos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, [currentUser]);

  const handleJoinGroup = async () => {
    if (groupID) {
      // Verificar si el grupo existe
      const gruposCollection = collection(db, "grupos");
      const gruposSnapshot = await getDocs(gruposCollection);
      const gruposList = gruposSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const grupoExistente = gruposList.find((grupo) => grupo.id === groupID);

      if (grupoExistente) {
        const userID = uuidv4(); // Generar un ID único para el usuario

        // Agregar el usuario a la colección users_groups
        await addDoc(collection(db, "users_groups"), {
          groupID: groupID, // ID del grupo
          userID: userID, // ID del usuario
          email: currentUser.email, // Correo del usuario
        });
        alert("Te has unido al grupo con éxito!");
        setGroupID(""); // Limpiar el campo de entrada
      } else {
        alert("El ID de grupo ingresado no existe.");
      }
    } else {
      alert("Por favor, ingresa un ID de grupo válido.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e1ce] py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-6">Mis Grupos</h2>
        {loading ? (
          <p>Cargando grupos...</p>
        ) : (
          <ul>
            {grupos.map((grupo) => (
              <li
                key={grupo.id}
                className="bg-white rounded-lg shadow-lg p-4 mb-4"
              >
                <h3 className="text-lg font-semibold text-[#5D4037]">
                  {grupo.nombre}
                </h3>
                <p>
                  <strong>Torneo:</strong> {grupo.torneo}
                </p>
                <p>
                  <strong>Descripción:</strong> {grupo.descripcion}
                </p>
                <p>
                  <strong>Observaciones:</strong> {grupo.observaciones}
                </p>
                <p>
                  <strong>Fases:</strong> {grupo.fases.join(", ")}
                </p>
                <p>
                  <strong>Equipos:</strong> {grupo.equipos.join(", ")}
                </p>
                <p>
                  <strong>Enlace de invitación:</strong>{" "}
                  <a
                    href={`https://tinyurl.com/${grupo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{`https://tinyurl.com/${grupo.id}`}</a>
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Unirse a un Grupo</h3>
          <input
            type="text"
            value={groupID}
            onChange={(e) => setGroupID(e.target.value)}
            placeholder="Ingresa el ID del grupo"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b] mb-2"
          />
          <button
            onClick={handleJoinGroup}
            className="bg-[#64c27b] text-white py-2 px-4 rounded-md hover:bg-[#2E7D32] transition-colors"
          >
            Unirse al Grupo
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiCuenta;
