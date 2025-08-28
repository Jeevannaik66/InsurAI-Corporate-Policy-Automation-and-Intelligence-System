import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(); // ✅ Create Auth Context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('authToken');
    if (loggedInUser) {
      setUser(loggedInUser);
      navigate('/dashboard'); // ✅ Redirect logged-in users to dashboard
    }
  }, [navigate]); // ✅ Fix missing dependency warning

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
