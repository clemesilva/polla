function FasesTorneo({ formData, setFormData, onPrevious, onNext }) {
  const fases = [
    { id: "fase_liga", nombre: "Fase de Liga" },
    { id: "playoffs", nombre: "Play-Offs" },
    { id: "octavos", nombre: "Octavos de Final" },
    { id: "cuartos", nombre: "Cuartos de Final" },
    { id: "semifinal", nombre: "Semifinal" },
    { id: "final", nombre: "Final" },
  ];

  const handleFaseChange = (faseId) => {
    const nuevasFases = formData.fases.includes(faseId)
      ? formData.fases.filter((id) => id !== faseId)
      : [...formData.fases, faseId];

    setFormData({
      ...formData,
      fases: nuevasFases,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-[#2E7D32] mb-6">
        Fases del Torneo
      </h2>

      <div className="bg-yellow-100 p-4 rounded-lg mb-6">
        <p className="text-[#5D4037]">
          Selecciona las fases que deseas incluir en tu torneo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {fases.map((fase) => (
            <label key={fase.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.fases.includes(fase.id)}
                onChange={() => handleFaseChange(fase.id)}
                className="form-checkbox h-5 w-5 text-[#64c27b] rounded border-gray-300 focus:ring-[#64c27b]"
              />
              <span className="text-[#5D4037]">{fase.nombre}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>
          <button
            type="submit"
            className="bg-[#64c27b] text-white py-2 px-6 rounded-md hover:bg-[#2E7D32] transition-colors"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}

export default FasesTorneo;
