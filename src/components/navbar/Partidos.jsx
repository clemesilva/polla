import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

function Partidos() {
  const { currentUser } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const savePrediction = async (
    matchId,
    homeScore,
    awayScore,
    matchDate,
    partido
  ) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para guardar predicciones");
      return;
    }

    try {
      // Calcular el puntaje antes de guardar
      const puntosObtenidos = calculateScore(
        homeScore,
        awayScore,
        partido.golesAFavor,
        partido.golesEnContra
      );

      // Guardar predicción junto con el puntaje en Firebase
      const userPredictionsRef = doc(db, "usersPredictions", currentUser.uid);
      await setDoc(
        userPredictionsRef,
        {
          predictions: {
            [matchId]: {
              homeScore: parseInt(homeScore),
              awayScore: parseInt(awayScore),
              matchDate,
              puntajeObtenido: puntosObtenidos, // Guardar el puntaje calculado
            },
          },
        },
        { merge: true }
      );

      // Mostrar alerta de éxito
      alert("Predicción guardada con éxito");
      console.log("Predicción y puntaje guardados con éxito", puntosObtenidos);
    } catch (error) {
      console.error("Error al guardar la predicción:", error);
      alert("Error al guardar la predicción");
    }
  };
  const handleSavePrediction = (matchId, matchDate) => {
    const homeScore = predictions[matchId]?.homeScore ?? "";
    const awayScore = predictions[matchId]?.awayScore ?? "";

    const now = new Date();
    const matchTime = new Date(matchDate);
    const timeDiff = (matchTime - now) / (1000 * 60); // Diferencia en minutos

    if (matchTime < now) {
      alert("No puedes hacer predicciones para partidos que ya han pasado.");
      return;
    }

    if (timeDiff < 10) {
      alert(
        "No puedes hacer predicciones para partidos que comienzan en menos de 10 minutos."
      );
      return;
    }

    savePrediction(matchId, homeScore, awayScore, matchDate);
  };

  const handlePredictionChange = (matchId, homeScore, awayScore) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      },
    }));
  };

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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredPartidos = partidos.filter((partido) => {
    const localTeam = partido.Local ? partido.Local.toLowerCase() : "";
    const visitingTeam = partido.visita ? partido.visita.toLowerCase() : "";
    return (
      localTeam.includes(searchTerm.toLowerCase()) ||
      visitingTeam.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br bg-neutral-600 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        Predicciones y Resultados
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar por equipo..."
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {filteredPartidos.map((partido) => {
          const homeScore = predictions[partido.matchID]?.homeScore ?? "";
          const awayScore = predictions[partido.matchID]?.awayScore ?? "";
          const realScore = `${partido.golesAFavor} - ${partido.golesEnContra}`;
          const matchStatus = getMatchStatus(partido.fechaCompleta);

          return (
            <div
              key={partido.matchID}
              className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-gray-700">
                  {partido.Local} vs {partido.visita}
                </span>

                <span className="text-sm text-gray-500 flex items-center">
                  {partido.fechaCompleta.toLocaleDateString()}{" "}
                  {partido.fechaCompleta.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4 space-x-4">
                {/* Pronóstico */}
                <div className="flex flex-col items-center bg-gradient-to-br from-white to-gray-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span className="text-sm font-bold text-gray-700 mb-2">
                    Pronóstico
                  </span>
                  <div className="flex items-center">
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
                      className="w-16 h-12 text-center mx-1 text-lg font-bold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    />
                    <span className="mx-1 text-lg font-bold text-gray-700">
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
                      className="w-16 h-12 text-center mx-1 text-lg font-bold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    />
                  </div>
                </div>

                {/* Resultado Real */}
                <div className="flex flex-col items-center bg-gradient-to-br from-green-600 to-green-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span className="text-sm font-bold text-white mb-2">
                    Resultado Real
                  </span>
                  <div className="w-24 h-12 flex items-center justify-center text-lg font-bold text-white bg-green-700 border border-green-400 rounded-lg shadow-inner">
                    {realScore}
                  </div>
                </div>

                {/* Puntajes Obtenidos */}
                <div className="flex flex-col items-center bg-gradient-to-br from-neutral-600 to-neutral-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span className="text-sm font-bold text-white mb-2">
                    Puntaje Obtenido
                  </span>
                  <div className="w-16 h-8 flex items-center justify-center bg-neutral-700 text-lg font-bold text-white border border-neutral-400 rounded-lg shadow-inner">
                    {calculateScore(
                      homeScore,
                      awayScore,
                      partido.golesAFavor,
                      partido.golesEnContra
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-gray-700">
                  Jornada {partido.jornada}
                </span>
                <div>
                  {matchStatus === "En Vivo" && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      En Vivo
                    </span>
                  )}
                  {matchStatus === "Por Jugar" && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Por Jugar
                    </span>
                  )}
                  {matchStatus === "Finalizado" && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Finalizado
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (
                    matchStatus === "En Vivo" ||
                    matchStatus === "Finalizado"
                  ) {
                    alert(
                      "No se pueden guardar predicciones para partidos En Vivo o Finalizados."
                    );
                    return;
                  }
                  savePrediction(
                    partido.matchID,
                    homeScore,
                    awayScore,
                    partido.fechaCompleta,
                    partido // Pasar el objeto partido completo con jornada
                  );
                }}
                className={`mt-2 bg-gradient-to-br from-green-500 to-green-700 text-white font-bold py-1 px-4 rounded-lg hover:from-green-800 hover:to-green-900 shadow-md hover:shadow-lg transition-all duration-300 ${
                  matchStatus === "En Vivo" || matchStatus === "Finalizado"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  matchStatus === "En Vivo" || matchStatus === "Finalizado"
                }
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
  console.log(score);
  return score;
};

export default Partidos;
