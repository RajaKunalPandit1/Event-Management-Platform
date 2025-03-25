// import { createContext, useContext, useState, useEffect } from "react";

// // Create AuthContext
// const AuthContext = createContext();

// // AuthProvider Component
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [role, setRole] = useState(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem("username");
//         const storedRole = localStorage.getItem("role");

//         if (storedUser) setUser(storedUser);
//         if (storedRole) setRole(storedRole);
//     }, []);

//     const login = (username, role) => {
//         localStorage.setItem("username", username);
//         localStorage.setItem("role", role);
//         setUser(username);
//         setRole(role);
//     };

//     const logout = () => {
//         localStorage.removeItem("username");
//         localStorage.removeItem("role");
//         setUser(null);
//         setRole(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, role, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom Hook to use Auth Context
// export const useAuth = () => {
//     return useContext(AuthContext);
// };

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

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

export const useAuth = () => useContext(AuthContext);