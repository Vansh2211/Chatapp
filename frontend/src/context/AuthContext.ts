// import React, { createContext, useContext, useState, ReactNode } from 'react';


// // Define types for the user and context
// interface AuthUser {
//   id: string;
//   name: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   isAuthenticated: boolean;
//   login: (user: AuthUser) => void;
//   logout: () => void;
// }

// interface AuthProviderProps {
//   children: ReactNode; 
// }

// // Create the context
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define the AuthProvider
// export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
// // Define types for the user and context
// interface AuthUser {
//     id: string;
//     name: string;
// }

// interface AuthContextType {
//     user: AuthUser | null;
//     isAuthenticated: boolean;
//     login: (user: AuthUser) => void;
//     logout: () => void;
// }

// interface AuthProviderProps {
//     children: ReactNode; 
// }

// // Create the context
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define the AuthProvider
// export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
//     const [user, setUser] = useState<AuthUser | null>(null);

//     const login = (authUser: AuthUser) => {
//         setUser(authUser);
//     };

//     const logout = () => {
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 isAuthenticated: !!user,
//                 login,
//                 logout,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom hook to use the AuthContext
// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);

//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }

//     return context;
// };

// export default AuthContext;

//   const login = (authUser: AuthUser) => {
//     setUser(authUser);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the AuthContext
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return context;
// };

// export default AuthContext;