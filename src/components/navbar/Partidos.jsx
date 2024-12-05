import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

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
                <span className="text-xl font-bold text-gray-700">
                  {partido.Local} vs {partido.visita}
                </span>

                <span className="text-gray-500 flex justify-between items-center mr-8">
                  {partido.fechaCompleta.toLocaleDateString()}{" "}
                  {partido.fechaCompleta.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              {/* Aqui en adelante son las 3 weas que tengo que ordenar el ordeeennnn */}
              <div className="flex justify-between items-center mb-6 space-x-8">
                {/* Pronóstico */}
                <div className="flex flex-col items-center bg-gradient-to-br from-green-600 to-green-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
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
                      className="w-20 h-16 text-center mx-2 p-2 text-3xl font-bold text-white bg-green-700 border-2 border-green-400 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
                    />
                    <span className="mx-2 text-3xl font-bold text-white">
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
                      className="w-20 h-16 text-center mx-2 p-2 text-3xl font-bold text-white bg-green-700 border-2 border-green-400 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
                    />
                  </div>
                </div>

                {/* Resultado Real */}
                <div className="flex flex-col items-center bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                  <span className="text-lg font-bold text-amber-300 mb-4 uppercase tracking-wide">
                    Resultado Real
                  </span>
                  <div className="w-32 h-16 flex items-center justify-center bg-gray-900 border-2 border-gray-600 rounded-lg text-3xl font-bold text-white shadow-inner">
                    {realScore}
                  </div>
                </div>

                {/* Puntajes Obtenidos */}
                <div className="flex flex-col items-center bg-gradient-to-br from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg">
                  <span className="text-lg font-semibold text-amber-400 mb-4">
                    Puntaje Obtenido
                  </span>
                  <div className="w-24 h-12 flex items-center justify-center bg-gray-900 text-2xl font-bold text-white border border-gray-600 rounded-lg">
                    {calculateScore(
                      homeScore,
                      awayScore,
                      partido.golesAFavor,
                      partido.golesEnContra
                    )}
                  </div>
                </div>
              </div>

              {/* aqui termina la wras que tengo que ordenar */}
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-700">
                  Jornada {partido.jornada}
                </span>
                <div>
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
                    partido
                  );
                }}
                className={`mt-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300 ${
                  matchStatus === "En Vivo" || matchStatus === "Finalizado"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  matchStatus === "En Vivo" || matchStatus === "Finalizado"
                } // Deshabilitar el botón si aplica
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
