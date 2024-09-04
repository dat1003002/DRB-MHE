import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Typography } from '@material-tailwind/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.3.148:5001/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard/home');
    } catch (error) {
      setError('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <section className="m-8 flex gap-4 justify-center">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center flex justify-center">
          <img src="/img/logo.png" alt="" className="w-[150px]" />
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium flex">
              Tên Đăng Nhập
            </Typography>
            <Input
              size="lg"
              placeholder="Vui lòng nhập username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Mật Khẩu
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="Nhập mật khẩu"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <Typography color="red" className="text-center">{error}</Typography>}

          <Button className="mt-6" fullWidth type="submit">
            Đăng Nhập
          </Button>
        </form>
      </div>
      <ToastContainer /> {/* Đặt ở đây */}
    </section>
  );
}

export default SignIn;
