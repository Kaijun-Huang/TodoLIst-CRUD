import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// import { useAuth } from 'context/AuthContext';
import { AuthContext } from 'context/AuthContext';

const LoginPage = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // add this
  const { login, isAuthenticated } = useContext(AuthContext);
  // const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  const handleClick = async () => {
    try {
      if (username.length !== 0 && password.length !== 0) {
        const success = await login({ username, password });
        if (success) {
          Swal.fire({
            position: 'top',
            title: '登入成功！',
            timer: 1000,
            icon: 'success',
            showConfirmButton: false,
          });
          return;
        }
        Swal.fire({
          position: 'top',
          title: '登入失敗！',
          timer: 1000,
          icon: 'error',
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          type={'text'}
          placeholder={'請輸入帳號'}
          label={'帳號'}
          value={username}
          onChange={(e) => {
            setusername(e.target.value);
          }}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type={'password'}
          placeholder={'請輸入密碼'}
          label={'密碼'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </AuthInputContainer>

      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
