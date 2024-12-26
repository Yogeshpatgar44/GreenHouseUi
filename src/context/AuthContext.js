import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, pass) => {
    try {
      // Basic validation
      if (!email || !pass) {
        console.error("Email or password cannot be empty.");
        return { success: false, message: "Email and password are required." };
      }
  
      if (pass.length < 8) {
        console.error("Password must be at least 8 characters long.");
        return { success: false, message: "Password must be at least 8 characters." };
      }
  
      // Firebase authentication
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true, message: "Login successful." };
  
    } catch (error) {
      console.error("Error during login:", error);
  
      // Handle specific Firebase error codes
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        default:
          errorMessage = "Login failed. Please try again.";
      }
  
      return { success: false, message: errorMessage };
    }
  };
  

  const logout = () => {
    signOut(auth)
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser,logout,login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
