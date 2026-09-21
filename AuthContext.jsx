import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

// Friendly copies for Firebase auth error codes — never surface raw
// Firebase error strings to normal users (spec section 3).
const FRIENDLY_ERRORS = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account already exists with that email.",
  "auth/weak-password": "Please choose a stronger password (6+ characters).",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again."
};

function friendlyError(err) {
  return FRIENDLY_ERRORS[err?.code] || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Server-side admin verification: the backend sets a custom
        // claim (role: "admin") via Firebase Admin SDK. The client
        // only *reads* that claim from the ID token — it never
        // decides admin status on its own (spec section 2).
        const tokenResult = await u.getIdTokenResult();
        setIsAdmin(tokenResult.claims?.role === "admin");
      } else {
        setIsAdmin(false);
      }
      setAdminChecked(true);
    });
    return unsub;
  }, []);

  async function signIn(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: friendlyError(err) };
    }
  }

  async function signUp(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: friendlyError(err) };
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      return { ok: true };
    } catch (err) {
      return { ok: false, message: friendlyError(err) };
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: friendlyError(err) };
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, adminChecked, signIn, signUp, signInWithGoogle, resetPassword, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
