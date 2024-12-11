import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { db } from "../../firebase"; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from "firebase/firestore";

const TablaPosiciones = () => {
  const [tabla, setTabla] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTabla = async () => {
      try {
        const usersPredictionsRef = collection(db, "usersPredictions");
        const snapshot = await getDocs(usersPredictionsRef);
        const puntosPorUsuario = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const predictions = data.predictions || {};
          const displayName = data.displayName || "Usuario Anónimo"; // Obtener el displayName

          // Sumar puntos por cada predicción
          Object.keys(predictions).forEach((matchId) => {
            const { puntajeObtenido } = predictions[matchId];
            if (!puntosPorUsuario[displayName]) {
              puntosPorUsuario[displayName] = { puntos: 0 };
            }
            puntosPorUsuario[displayName].puntos += puntajeObtenido || 0; // Sumar puntos
          });
        });

        // Convertir a array y ordenar
        const tablaArray = Object.entries(puntosPorUsuario).map(
          ([usuario, data]) => ({
            displayName: usuario, // Cambiar a displayName
            puntos: data.puntos,
          })
        );

        // Ordenar por puntos
        tablaArray.sort((a, b) => b.puntos - a.puntos);
        setTabla(tablaArray);
      } catch (error) {
        console.error("Error al obtener la tabla de posiciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabla();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Tabla de Posiciones
      </h2>
      {isLoading ? (
        <Spinner color="white" />
      ) : (
        <Table aria-label="Tabla de Posiciones">
          <TableHeader>
            <TableColumn key="posicion">Posición</TableColumn>
            <TableColumn key="displayName">Nombre de Usuario</TableColumn>
            <TableColumn key="puntos">Puntos</TableColumn>
          </TableHeader>
          <TableBody>
            {tabla.map((row, index) => (
              <TableRow key={row.displayName}>
                <TableCell key={`posicion-${index}`}>{index + 1}</TableCell>
                <TableCell key={`displayName-${index}`}>
                  {row.displayName}
                </TableCell>
                <TableCell key={`puntos-${index}`}>{row.puntos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaPosiciones;
