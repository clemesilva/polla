import React, { useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import FasesTorneo from "./FasesTorneo";
import SeleccionEquipos from "./SeleccionEquipos";
import ResumenGrupo from "./ResumenGrupo";
import GrupoCreado from "./GrupoCreado";

function CrearGrupo() {
  const { currentUser } = useAuth();
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    torneo: "",
    nombre: "",
    descripcion: "",
    observaciones: "",
    fases: [],
    equipos: [],
    predicciones: {},
  });
  const [invitationLink, setInvitationLink] = useState("");

  const torneos = [
    "Primera división de Chile",
    "Champions League 2024/25",
    "Copa Libertadores 2024",
    "Mundial 2026",
  ];

  const handleNext = (e) => {
    e.preventDefault();
    setPaso(paso + 1);
  };

  const handlePrevious = () => {
    setPaso(paso - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateGroup = async () => {
    try {
      // Crear el grupo en la colección "grupos"
      const docRef = await addDoc(collection(db, "grupos"), {
        torneo: formData.torneo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        observaciones: formData.observaciones,
        fases: formData.fases,
        equipos: formData.equipos,
        miembros: [currentUser.email], // Agregar el creador como miembro
      });

      // Crear el documento en la colección "users_groups"
      await setDoc(doc(db, "users_groups", docRef.id), {
        groupID: formData.nombre, // Nombre del grupo
        miembros: [currentUser.uid], // Agregar el creador como miembro
      });

      alert("Grupo creado con éxito!");
    } catch (error) {
      console.error("Error al crear el grupo: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e1ce] py-8">
      <div className="max-w-3xl mx-auto">
        {/* Indicador de pasos */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paso === 1
                  ? "bg-[#64c27b] text-white"
                  : "bg-white text-[#64c27b]"
              }`}
            >
              1
            </div>
            <div className="w-16 h-1 bg-white mx-2"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paso === 2
                  ? "bg-[#64c27b] text-white"
                  : "bg-white text-[#64c27b]"
              }`}
            >
              2
            </div>
            <div className="w-16 h-1 bg-white mx-2"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paso === 3
                  ? "bg-[#64c27b] text-white"
                  : "bg-white text-[#64c27b]"
              }`}
            >
              3
            </div>
            <div className="w-16 h-1 bg-white mx-2"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paso === 4
                  ? "bg-[#64c27b] text-white"
                  : "bg-white text-[#64c27b]"
              }`}
            >
              4
            </div>
          </div>
        </div>

        {paso === 1 ? (
          <form onSubmit={handleNext}>
            {/* Información General */}
            <div>
              <label className="block text-[#5D4037] font-semibold mb-2">
                Torneo:
              </label>
              <select
                name="torneo"
                value={formData.torneo}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b]"
              >
                <option value="">Selecciona un torneo</option>
                {torneos.map((torneo) => (
                  <option key={torneo} value={torneo}>
                    {torneo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#5D4037] font-semibold mb-2">
                Grupo:
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b]"
                placeholder="Nombre del grupo..."
              />
            </div>

            <div>
              <label className="block text-[#5D4037] font-semibold mb-2">
                Descripción:
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b]"
                placeholder="Describe tu grupo..."
              />
            </div>

            <div>
              <label className="block text-[#5D4037] font-semibold mb-2">
                Observaciones:
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#64c27b] focus:border-[#64c27b]"
                placeholder="Agrega observaciones o reglas especiales..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#64c27b] text-white py-2 px-6 rounded-md hover:bg-[#2E7D32] transition-colors"
              >
                Siguiente
              </button>
            </div>
          </form>
        ) : paso === 2 ? (
          <FasesTorneo
            formData={formData}
            setFormData={setFormData}
            onPrevious={handlePrevious}
            onNext={() => setPaso(3)}
          />
        ) : paso === 3 ? (
          <SeleccionEquipos
            formData={formData}
            setFormData={setFormData}
            onPrevious={() => setPaso(2)}
            onNext={() => setPaso(4)}
          />
        ) : paso === 4 ? (
          <ResumenGrupo
            formData={formData}
            onPrevious={() => setPaso(3)}
            onCreateGroup={handleCreateGroup}
          />
        ) : (
          <GrupoCreado formData={formData} invitationLink={invitationLink} />
        )}
      </div>
    </div>
  );
}

export default CrearGrupo;
