import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

const DEMO_LIBRARIAN = {
  id: 1,
  name: 'Sarah J.',
  fullName: 'Sarah Jenkins',
  email: 'sarah.librarian@academichub.edu',
  role: 'librarian',
  student_id: null,
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};

const DEMO_STUDENT = {
  id: 2,
  name: 'Karie Berlinn',
  fullName: 'Karie Berlinn',
  email: 'karie.berlinn@student.academichub.edu',
  role: 'student',
  student_id: '22401',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('academic_hub_user');
    return saved ? JSON.parse(saved) : DEMO_LIBRARIAN;
  });
  const [token, setToken] = useState(() => localStorage.getItem('academic_hub_token') || 'demo_token_123');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('academic_hub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('academic_hub_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data && response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('academic_hub_token', response.data.token);
        return { success: true };
      }
    } catch (err) {
      // If offline or demo
      if (email.toLowerCase().includes('librarian') || email.toLowerCase().includes('sarah')) {
        setUser(DEMO_LIBRARIAN);
        return { success: true };
      } else {
        setUser(DEMO_STUDENT);
        return { success: true };
      }
    }
  };

  const switchDemoAccount = (role) => {
    if (role === 'student') {
      setUser(DEMO_STUDENT);
      localStorage.setItem('academic_hub_user', JSON.stringify(DEMO_STUDENT));
    } else {
      setUser(DEMO_LIBRARIAN);
      localStorage.setItem('academic_hub_user', JSON.stringify(DEMO_LIBRARIAN));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('academic_hub_token');
    localStorage.removeItem('academic_hub_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLibrarian: user?.role === 'librarian' || user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        logout,
        switchDemoAccount,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
