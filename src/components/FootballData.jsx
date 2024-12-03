import React, { useEffect, useState } from "react";

const API_KEY = "ymrtlNcpXSm47LRZ";
const API_SECRET = "NX2vrd8ySTzzn3kVpLpLyBawuxACisB5";
const COMPETITION_ID = 2;

function FootballData() {
  const [liveScores, setLiveScores] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [history, setHistory] = useState([]);
  const [standings, setStandings] = useState([]);

  const FIXTURES_API_URL =
    "https://livescore-api.com/api-client/fixtures/matches.json?&key=ymrtlNcpXSm47LRZ&secret=NX2vrd8ySTzzn3kVpLpLyBawuxACisB5";
  const HISTORY_API_URL =
    "https://livescore-api.com/api-client/matches/history.json?&key=ymrtlNcpXSm47LRZ&secret=NX2vrd8ySTzzn3kVpLpLyBawuxACisB5";

  useEffect(() => {
    const fetchFixtures = async () => {
      const response = await fetch(
        `${FIXTURES_API_URL}&competition_id=${COMPETITION_ID}`
      );
      const data = await response.json();
      console.log("data", data);
      setFixtures(data.data.fixtures);
    };
    

    /* const fetchFixtures = async () => {
      const response = await fetch(
        `${API_URL}&competition_id=${COMPETITION_ID}`
      );
      const data = await response.json();
      setFixtures(data.data);
    }; */

    /* const fetchHistory = async () => {
      const response = await fetch(
        `https://livescore-api.com/api-client/scores/history.json?competition_id=${COMPETITION_ID}&key=${API_KEY}&secret=${API_SECRET}`
      );
      const data = await response.json();
      setHistory(data.data);
    };

    const fetchStandings = async () => {
      const response = await fetch(
        `https://livescore-api.com/api-client/leagues/table.json?competition_id=${COMPETITION_ID}&key=${API_KEY}&secret=${API_SECRET}`
      );
      const data = await response.json();
      setStandings(data.data);
    }; */

    fetchFixtures();
    /* fetchFixtures();
    fetchHistory();
    fetchStandings(); */
  }, []);

  return (
    <div>
      {fixtures.length > 0 && (
        <>
          <h2>Fixtures</h2>
          <ul>
            {fixtures.map((match) => (
              <li key={match.id}>
                {match.home_name} vs {match.away_name} - {match.date}:{" "}
                {match.time}
              </li>
            ))}
          </ul>
        </>
      )}

      {/*  <h2>Fixtures</h2>
      <ul>
        {fixtures.map((match) => (
          <li key={match.id}>
            {match.home_team} vs {match.away_team} - {match.date}
          </li>
        ))}
      </ul>

      <h2>Historial</h2>
      <ul>
        {history.map((match) => (
          <li key={match.id}>
            {match.home_team} vs {match.away_team} - {match.score} (Fecha:{" "}
            {match.date})
          </li>
        ))}
      </ul>

      <h2>Tabla de Posiciones</h2>
      <ul>
        {standings.map((team) => (
          <li key={team.team_id}>
            {team.team_name} - Puntos: {team.points}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default FootballData;
