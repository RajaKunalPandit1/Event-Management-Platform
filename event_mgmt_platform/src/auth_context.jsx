import { createContext, useContext, useState, useEffect } from "react";

/**
 * Authentication context.
 * 
 * Provides authentication state (`isAuthenticated`) and a method to update it (`setIsAuthenticated`).
 * Used to share authentication status across the application.
 * 
 * @typedef {Object} AuthContextValue
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {function} setIsAuthenticated - Function to update the authentication state.
 */


const AuthContext = createContext();


/**
 * AuthProvider component.
 * 
 * Wraps child components and provides authentication context.
 * Initializes authentication state based on the presence of a token in localStorage.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @returns {JSX.Element} The provider component with authentication context.
 */

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check localStorage for authentication tokens
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the authentication context.
 * 
 * @function useAuth
 * @returns {AuthContextValue} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);