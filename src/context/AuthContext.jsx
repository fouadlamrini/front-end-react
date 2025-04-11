import { createContext, useContext, useState, useEffect , useCallback } from 'react';
import api from '../api/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check  user  auth
  useEffect(() => {
    const checkAuth = async (credentials) => {
      
      try {
        if (token) {
          console.log(token) ;
          const user = JSON.parse(localStorage.getItem('user'));
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  },[]);


  const hasRole = useCallback((requiredRoleOrRoles) => {
    if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
        return false;
    }
    const userRole = user.roles[0].name;
    if (!userRole) return false;

    const requiredRoles = Array.isArray(requiredRoleOrRoles) ? requiredRoleOrRoles : [requiredRoleOrRoles];

    return requiredRoles.includes(userRole);

}, [user]);

  const login = async (credentials) => {
    console.log(credentials);
    try {
      const { data } = await api.post('/login', credentials);
      console.log(data) ;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await api.post('/register', credentials);
    
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, message: error.response?.data?.message || 'Register failed' };
    }
  };


  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated,
      loading,
      hasRole,
      login,
      register,
      logout,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);