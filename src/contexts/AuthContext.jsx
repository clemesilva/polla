import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Crear documento de usuario
  async function createUserDocument(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      try {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
          predictions: {},
        });
      } catch (error) {
        console.error("Error creando usuario:", error);
        throw error;
      }
    }
    return userRef;
  }

  // Guardar predicción
  async function savePrediction(matchId, homeScore, awayScore, matchDate) {
    if (!currentUser) throw new Error("No hay usuario autenticado");

    const userRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userRef, {
        [`predictions.${matchId}`]: {
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
          matchDate,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error guardando predicción:", error);
      throw error;
    }
  }

  // Obtener predicciones del usuario
  async function getUserPredictions() {
    if (!currentUser) return {};

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().predictions || {};
      }
      return {};
    } catch (error) {
      console.error("Error obteniendo predicciones:", error);
      throw error;
    }
  }

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserDocument(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      return result;
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserDocument(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    savePrediction,
    getUserPredictions,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
