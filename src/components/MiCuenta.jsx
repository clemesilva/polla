import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Importa el contexto de autenticación

function MiCuenta() {
  const { currentUser } = useAuth(); // Obtén el usuario actual
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      </div>
    </div>
  );
}

export default MiCuenta;
