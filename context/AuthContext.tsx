import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  password: string;
}

const DEMO_USER: User = {
  name: 'Conta demo',
  email: 'teste@agendei.com',
  password: 'senha123456',
};

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [registeredUser, setRegisteredUser] = useState<User>(DEMO_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function login(email: string, password: string) {
    const success =
      email.trim().toLowerCase() === registeredUser.email.toLowerCase() &&
      password === registeredUser.password;

    if (success) {
      setIsLoggedIn(true);
    }

    return success;
  }

  function register(name: string, email: string, password: string) {
    setRegisteredUser({ name, email: email.trim().toLowerCase(), password });
  }

  function logout() {
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>');
  }
  return context;
}
