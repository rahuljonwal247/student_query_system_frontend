import { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: { id: string; role: 'student' | 'resolver' } | null;
  login: (user: { id: string; role: 'student' | 'resolver' }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = (user: { id: string; role: 'student' | 'resolver' }) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
