import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

function Predictions() {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const { currentUser, savePrediction, getUserPredictions } = useAuth();

  const updateMatchesStatus = (matchesList) => {
    const now = new Date();
    return matchesList.map((match) => {
      const matchTime = new Date(match.date);
      const timeDiff = matchTime.getTime() - now.getTime();
      const minutesBefore = timeDiff / (1000 * 60);

      return {
        ...match,
        status: minutesBefore < 10 ? "finalizado" : "por_jugar",
      };
    });
  };

  useEffect(() => {
    const initialMatches = [
      {
        id: "1",
        date: new Date("2025-03-20T15:00:00"),
        homeTeam: "U. de Chile",
        awayTeam: "Colo-Colo",
        status: "por_jugar",
      },
      {
        id: "2",
        date: new Date("2025-03-21T15:00:00"),
        homeTeam: "Católica",
        awayTeam: "Palestino",
        status: "por_jugar",
      },
      {
        id: "3",
        date: new Date("2024-03-21T15:00:00"),
        homeTeam: "Magallanes",
        awayTeam: "Palestino",
        status: "por_jugar",
      },
    ];

    setMatches(updateMatchesStatus(initialMatches));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) => updateMatchesStatus(prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [currentUser]);

  async function loadPredictions() {
    if (!currentUser) return;
    try {
      const userPredictions = await getUserPredictions();
      setPredictions(userPredictions);
    } catch (error) {
      console.error("Error cargando predicciones:", error);
    }
  }

  async function handlePredictionSave(matchId, homeScore, awayScore) {
    if (!currentUser) {
      alert("Debes iniciar sesión para guardar predicciones");
      return;
    }

    if (homeScore === "" || awayScore === "") {
      alert("Por favor ingresa valores válidos");
      return;
    }

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (match.status === "finalizado") {
      alert("Las predicciones se cerraron para este partido");
      return;
    }

    try {
      await savePrediction(matchId, homeScore, awayScore, match.date);
      setPredictions((prev) => ({
        ...prev,
        [matchId]: {
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
          matchDate: match.date,
        },
      }));
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la predicción");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#2E7D32]">Predicciones</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">
                {format(new Date(match.date), "d 'de' MMMM, HH:mm")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match.status === "por_jugar"
                    ? "bg-[#A5D6A7] text-[#2E7D32]"
                    : "bg-[#795548] text-white"
                }`}
              >
                {match.status === "por_jugar" ? "Por Jugar" : "Finalizado"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 text-right font-medium text-gray-800">
                {match.homeTeam}
              </div>
              <div className="flex items-center mx-4">
                <input
                  type="number"
                  min="0"
                  max="99"
                  disabled={match.status === "finalizado"}
                  value={predictions[match.id]?.homeScore ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (parseInt(value) >= 0 && parseInt(value) <= 99)
                    ) {
                      handlePredictionSave(
                        match.id,
                        value,
                        predictions[match.id]?.awayScore ?? 0
                      );
                    }
                  }}
                  className="w-16 text-center mx-2 p-2 border rounded-md focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto disabled:bg-gray-100"
                />
                <span className="mx-2 text-xl font-bold text-gray-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  disabled={match.status === "finalizado"}
                  value={predictions[match.id]?.awayScore ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (parseInt(value) >= 0 && parseInt(value) <= 99)
                    ) {
                      handlePredictionSave(
                        match.id,
                        predictions[match.id]?.homeScore ?? 0,
                        value
                      );
                    }
                  }}
                  className="w-16 text-center mx-2 p-2 border rounded-md focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto disabled:bg-gray-100"
                />
              </div>
              <div className="flex-1 font-medium text-gray-800">
                {match.awayTeam}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Predictions;
