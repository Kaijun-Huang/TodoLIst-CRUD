import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const SignUpPage = () => {
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const checkTokenValid = async () => {
  //     try {
  //       const token = localStorage.getItem('authToken');
  //       if (token) {
  //         const result = await checkPermission(token); // =T/F
  //         if (result) {
  //           navigate('/todos');
  //         }
  //       }
  //       return;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   checkTokenValid();
  // }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  const handleClick = async () => {
    try {
      if (
        username.length !== 0 &&
        email.length !== 0 &&
        password.length !== 0
      ) {
        const success = await register({ username, email, password });
        if (success) {
          Swal.fire({
            position: 'top',
            title: '註冊成功！',
            timer: 1000,
            icon: 'success',
            showConfirmButton: false,
          });
          return;
        }
        Swal.fire({
          position: 'top',
          title: '註冊失敗！',
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
      <h1>建立您的帳號</h1>

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
          type={'text'}
          placeholder={'請輸入Email'}
          label={'Email'}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
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

      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
