import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function Partidos() {
  const { currentUser } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    const fetchPartidos = async () => {
      const response = await fetch("public/SOFACL_partidos.csv");
      if (!response.ok) {
        throw new Error("Error al cargar el archivo CSV");
      }
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (results) => {
          const parsedPartidos = results.data.map((partido) => {
            const fechaCompleta = new Date(
              `${partido["dia"]}T${partido["hora"]}`
            );
            return {
              ...partido,
              fechaCompleta,
              golesAFavor: partido.GF,
              golesEnContra: partido.GC,
            };
          });
          setPartidos(parsedPartidos);
        },
        error: (error) => {
          console.error("Error al leer el archivo CSV:", error);
        },
      });
    };

    const fetchUserPredictions = async () => {
      if (!currentUser) return;

      try {
        const userPredictionsRef = doc(db, "usersPredictions", currentUser.uid);
        const userDoc = await getDoc(userPredictionsRef);

        if (userDoc.exists()) {
          setPredictions(userDoc.data().predictions || {});
        }
      } catch (error) {
        console.error("Error al obtener las predicciones del usuario:", error);
      }
    };

    fetchPartidos();
    fetchUserPredictions();
  }, [currentUser]);

  const getMatchStatus = (matchDate) => {
    const now = new Date();
    if (matchDate < now) {
      return "Finalizado";
    } else if (matchDate - now < 10 * 60 * 1000) {
      return "En Vivo";
    } else {
      return "Por Jugar";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-center">
        Predicciones y Resultados
      </h2>
      <div className="space-y-6">
        {partidos.map((partido) => {
          const homeScore = predictions[partido.matchID]?.homeScore ?? "";
          const awayScore = predictions[partido.matchID]?.awayScore ?? "";
          const realScore = `${partido.golesAFavor} - ${partido.golesEnContra}`;
          const matchStatus = getMatchStatus(partido.fechaCompleta);

          return (
            <div
              key={partido.matchID}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium text-lg">
                  {partido.Local} vs {partido.visita}
                </span>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    {partido.fechaCompleta.toLocaleDateString()}{" "}
                    {partido.fechaCompleta.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <div className="flex items-center">
                    {matchStatus === "En Vivo" && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        En Vivo
                      </span>
                    )}
                    {matchStatus === "Por Jugar" && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Por Jugar
                      </span>
                    )}
                    {matchStatus === "Finalizado" && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Finalizado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold">Pronóstico</span>
                  <div className="flex items-center mt-2">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={homeScore}
                      onChange={(e) =>
                        handlePredictionChange(
                          partido.matchID,
                          e.target.value,
                          awayScore
                        )
                      }
                      className="w-16 text-center mx-2 p-2 border rounded-md"
                    />
                    <span className="mx-2 text-xl font-bold text-gray-400">
                      -
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={awayScore}
                      onChange={(e) =>
                        handlePredictionChange(
                          partido.matchID,
                          homeScore,
                          e.target.value
                        )
                      }
                      className="w-16 text-center mx-2 p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center mx-4">
                  <span className="text-lg font-bold">Resultado Real</span>
                  <span className="text-xl font-bold text-gray-800">
                    {realScore}
                  </span>
                </div>
                <div className="flex flex-col items-center mx-4">
                  <span className="text-lg font-bold">Puntajes Obtenidos</span>
                  <span className="text-xl font-bold text-gray-800">
                    {calculateScore(
                      homeScore,
                      awayScore,
                      partido.golesAFavor,
                      partido.golesEnContra
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleSavePrediction(partido.matchID, partido.fechaCompleta)
                }
                className="mt-4 bg-[#64c27b] text-white py-2 px-4 rounded-md hover:bg-[#2E7D32] transition-colors"
              >
                Guardar Predicción
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const calculateScore = (homeScore, awayScore, realHomeScore, realAwayScore) => {
  let score = 0;
  if (homeScore == realHomeScore && awayScore == realAwayScore) {
    score += 5; // Puntos por resultado exacto
  } else if (homeScore == realHomeScore || awayScore == realAwayScore) {
    score += 2; // Puntos por acertar goles de un equipo
  }
  if (
    Math.abs(realHomeScore - realAwayScore) === Math.abs(homeScore - awayScore)
  ) {
    score += 1; // Puntos por acertar la diferencia de goles
  }
  return score;
};

export default Partidos;
