import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { db } from "../../firebase"; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function TablaPosiciones() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false);
  const [tabla, setTabla] = React.useState([]);

  const list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false);
      }

      // Cargar datos de la base de datos
      if (!currentUser) return { items: [], cursor: null };

      try {
        const userPredictionsRef = doc(db, "usersPredictions", currentUser.uid);
        const userDoc = await getDoc(userPredictionsRef);

        if (userDoc.exists()) {
          const predictions = userDoc.data().predictions || {};
          const puntosPorUsuario = {};

          // Calcular puntos y jornadas
          Object.keys(predictions).forEach((matchId) => {
            const { homeScore, awayScore } = predictions[matchId];
            const puntos = calculateScore(homeScore, awayScore); // Implementa esta función según tu lógica
            const jornada = predictions[matchId].jornada || 0;

            if (!puntosPorUsuario[currentUser.uid]) {
              puntosPorUsuario[currentUser.uid] = { puntos: 0, jornadas: 0 };
            }

            puntosPorUsuario[currentUser.uid].puntos += puntos;
            puntosPorUsuario[currentUser.uid].jornadas += jornada;
          });

          // Convertir a array y ordenar
          const tablaArray = Object.entries(puntosPorUsuario).map(
            ([usuario, data]) => ({
              usuario,
              ...data,
            })
          );

          // Ordenar por puntos
          tablaArray.sort((a, b) => b.puntos - a.puntos);
          setTabla(tablaArray);
          setHasMore(false); // Cambia esto si necesitas más paginación
        }
      } catch (error) {
        console.error("Error al obtener la tabla de posiciones:", error);
      }

      return {
        items: tabla,
        cursor: null, // Cambia esto si necesitas más paginación
      };
    },
  });

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });

  return (
    <Table
      isHeaderSticky
      aria-label="Tabla de Posiciones"
      baseRef={scrollerRef}
      bottomContent={
        hasMore ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[520px] overflow-scroll",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader>
        <TableColumn key="position">Posición</TableColumn>
        <TableColumn key="usuario">Usuario</TableColumn>
        <TableColumn key="puntos">Puntos</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={list.items}
        loadingContent={<Spinner color="white" />}
      >
        {(item) => (
          <TableRow key={item.usuario}>
            <TableCell>{list.items.indexOf(item) + 1}</TableCell>
            <TableCell>{item.usuario}</TableCell>
            <TableCell>{item.puntos}</TableCell>
            <TableCell>{item.jornadas}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const calculateScore = (homeScore, awayScore) => {
  // Implementa tu lógica para calcular los puntos
  return 0; // Cambia esto por la lógica real
};
