import { useState } from "react";

function SeleccionEquipos({ formData, setFormData, onPrevious, onNext }) {
  const equiposDisponibles = [
    { id: "arsenal", nombre: "Arsenal" },
    { id: "barcelona", nombre: "Barcelona" },
    { id: "bayern", nombre: "Bayern Munich" },
    { id: "benfica", nombre: "Benfica" },
    { id: "zagreb", nombre: "Dinamo Zagreb" },
    { id: "dortmund", nombre: "Borussia Dortmund" },
    { id: "inter", nombre: "Internazionale" },
    { id: "lille", nombre: "Lille" },
    { id: "city", nombre: "Manchester City" },
    { id: "milan", nombre: "AC Milan" },
    { id: "madrid", nombre: "Real Madrid" },
    { id: "shakhtar", nombre: "Shakhtar Donetsk" },
  ];

  const handleEquipoChange = (equipoId) => {
    const nuevosEquipos = formData.equipos.includes(equipoId)
      ? formData.equipos.filter((id) => id !== equipoId)
      : [...formData.equipos, equipoId];

    setFormData({
      ...formData,
      equipos: nuevosEquipos,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-[#2E7D32] mb-6">
        Selecciona los Equipos
      </h2>

      <div className="bg-yellow-100 p-4 rounded-lg mb-6">
        <p className="text-[#5D4037]">
          Selecciona los equipos que participarán en tu grupo. Los partidos se
          generarán automáticamente según los equipos seleccionados.
        </p>
      </div>

      <div className="space-y-2">
        {equiposDisponibles.map((equipo) => (
          <label
            key={equipo.id}
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
              formData.equipos.includes(equipo.id) ? "bg-green-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={formData.equipos.includes(equipo.id)}
              onChange={() => handleEquipoChange(equipo.id)}
              className="form-checkbox h-5 w-5 text-[#64c27b] rounded border-gray-300 focus:ring-[#64c27b]"
            />
            <span className="ml-3 text-[#5D4037]">{equipo.nombre}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-6 mt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-[#64c27b] text-white py-2 px-6 rounded-md hover:bg-[#2E7D32] transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default SeleccionEquipos;
