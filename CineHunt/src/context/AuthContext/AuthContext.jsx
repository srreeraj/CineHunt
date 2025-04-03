import { 
    onAuthStateChanged, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut 
  } from "firebase/auth";
  import { useState, createContext, useContext, useEffect } from "react";
  import { auth, provider } from "../../../firebase";
  
  const AuthContext = createContext();
  
  export const AuthProvider = ({children}) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  
      // Google Sign In
      const loginWithGoogle = async () => {
          try {
              const result = await signInWithPopup(auth, provider);
              setUser(result.user);
              setError(null);
          } catch (error) {
              setError(error.message);
              console.log('Google login error', error);
          }
      };
  
      // Email/Password Sign In
      const loginWithEmail = async (email, password) => {
          try {
              const result = await signInWithEmailAndPassword(auth, email, password);
              setUser(result.user);
              setError(null);
              return result.user;
          } catch (error) {
              setError(error.message);
              throw error;
          }
      };
  
      // Email/Password Sign Up
      const signUpWithEmail = async (email, password) => {
          try {
              const result = await createUserWithEmailAndPassword(auth, email, password);
              setUser(result.user);
              setError(null);
              return result.user;
          } catch (error) {
              setError(error.message);
              throw error;
          }
      };
  
      // Logout
      const logout = async () => {
          try {
              await signOut(auth);
              setUser(null);
              setError(null);
          } catch (error) {
              setError(error.message);
              console.log("Logout error:", error);
          }
      };
  
      useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
              setUser(currentUser);
              setLoading(false);
          });
          
          return () => unsubscribe();
      }, []);
  
      const value = {
          user,
          loading,
          error,
          loginWithGoogle,
          loginWithEmail,
          signUpWithEmail,
          logout
      };
  
      return (
          <AuthContext.Provider value={value}>
              {!loading && children}
          </AuthContext.Provider>
      );
  };
  
  export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
  };