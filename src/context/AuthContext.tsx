
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, login, signup, logout } from '../firbase'; 
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  signupUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use": return "This email is already in use.";
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/user-not-found": return "No account found with this email.";
    case "auth/wrong-password": return "Incorrect password.";
    case "auth/too-many-requests": return "Too many attempts. Please try again later.";
    default: return "Something went wrong. Please try again.";
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      return true;
    } catch (error) {
     const firebaseError = error as { code: string };
      const msg = getAuthErrorMessage(firebaseError.code);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signupUser = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      const firebaseError = error as { code: string };
      const msg = getAuthErrorMessage(firebaseError.code);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      toast.info("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}