"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { redirect } from "next/navigation";
import Loader from "../common/loader";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleAuth:()=>Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
  require,
}: {
  children: React.ReactNode;
  require?: boolean | null;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (!user && require) {
        redirect("/login");
      }
    });

    return () => unsub();
  }, []);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await signOut(auth);
  };
const googleAuth = async () =>{
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth,provider);
}
if(loading) return (
  <Loader />
)
  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout,googleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};