import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firebase
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function JoinGroup(userID, groupID) {
  try {
    // Referencia a la colección users_groups
    const userGroupRef = doc(db, "users_groups", groupID);

    // Agregar el userID al array de miembros
    await updateDoc(userGroupRef, {
      miembros: arrayUnion(userID),
    });

    alert("Te has unido al grupo con éxito!");
  } catch (error) {
    console.error("Error al unirse al grupo: ", error);
    alert("Hubo un error al unirse al grupo.");
  }
}
