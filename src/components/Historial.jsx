import React, { useEffect, useState } from "react";

const API_KEY = "ymrtlNcpXSm47LRZ";
const API_SECRET = "NX2vrd8ySTzzn3kVpLpLyBawuxACisB5";
const COMPETITION_ID = 25;

function Historial() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(
        `https://livescore-api.com/api-client/matches/history.json?competition_id=${COMPETITION_ID}&key=${API_KEY}&secret=${API_SECRET}`
      );
      const data = await response.json();
      setHistory(data.data);
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Historial de Partidos</h2>
      <ul>
        {history.map((match) => (
          <li key={match.id}>
            {match.home_team} vs {match.away_team} - {match.score} (Fecha:{" "}
            {match.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Historial;
