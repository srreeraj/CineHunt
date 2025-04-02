import { onAuthStateChanged, signInWithPopup, getRedirectResult, signOut } from "firebase/auth";
import { useState } from "react";
import { createContext } from "react";
import { auth, provider } from "../../../firebase";
import { useEffect } from "react";
import { useContext } from "react";


const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user , setUser] = useState(null);

    const login = async () => {
        try{
            const result = await signInWithPopup(auth, provider);
            setUser(result.user)
        } catch (error) {
            console.log('login error', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.log("Logout error:", error);
        }
    };
    


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        getRedirectResult(auth).then((result) => {
            if(result?.user){
                setUser(result.user);
            }
        }).catch(error => {
            console.log("Redirect login error", error)
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