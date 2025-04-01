import { onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { useState } from "react";
import { createContext } from "react";
import { auth, provider } from "../../../firebase";
import { useEffect } from "react";
import { useCallback } from "react";
import { useContext } from "react";


const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user , setUser] = useState(null);

    const login = async () => {
        try{
            await signInWithRedirect(auth, provider);

        } catch (error) {
            console.log('login error', error);
        }
    };

    const logout = () =>{
        signOut(auth);
    }


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    },[]);

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);