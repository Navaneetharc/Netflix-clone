import React,{createContext, useContext, useEffect, useState} from "react";
import { onAuthStateChanged,type User } from "firebase/auth";
import {auth, login, signup, logout} from '../firbase';

interface AuthContextType{
    user: User | null;
    loading : boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    signupUser: (name: string, email: string, password: string) => Promise<void>;
    logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user,setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    },[]);

    const loginUser = async (email: string, password: string) => {
  setLoading(true);
  try {
    await login(email, password);
  } finally {
    setLoading(false);
  }
};

const signupUser = async (name: string, email: string, password: string) => {
  setLoading(true);
  try {
    await signup(name, email, password);
  } finally {
    setLoading(false);
  }
};

const logoutUser = async () => {
  setLoading(true);
  try {
    await logout();
  } finally {
    setLoading(false);
  }
};


    return(
        <AuthContext.Provider value={{user,loading,loginUser,signupUser,logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}