import { createContext, useContext, useState, useEffect } from 'react';
import { register, login, checkPermission } from 'api/auth';
import * as jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';

export const AuthContext = createContext({
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null,
});

//把useContext(AuthContext)統一包成useAuth, 到comp就不用多import這兩個
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const checkTokenValid = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsAuthenticated(false);
          setPayload(null);
          return;
        }

        const result = await checkPermission(token);
        if (result) {
          setIsAuthenticated(true);
          const tempPayload = jwt.decode(token);
          // 會回傳一個物件{
          // exp:1684918428
          // iat:1684916628
          // name:"kj08"
          // sub:"1c112b08-3aca-4e12-9dff-4fccd7e504d8"
          // }
          setPayload(tempPayload);
        } else {
          setIsAuthenticated(false);
          setPayload(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkTokenValid();
  }, [pathname]); //要偵測「路徑是否變化」
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          // payload是用jwt從authToken解析出來的
          id: payload.sub, //subject
          name: payload.name,
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          }); //打api拿資料後, 解析authToken做成payload
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
            return success;
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
