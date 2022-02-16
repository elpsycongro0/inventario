import React from 'react';
import { Input, Button, Layout } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Title } = Typography;
const {Content} = Layout;



function Login() {
  return(
    <div style={{padding:"20px", background:'#fff', margin:"auto", maxWidth:"80vw", }}>
      <Title level={2}>INGRESAR</Title>
      <Title level={4}>USUARIO</Title>
      <Input size="large" placeholder="Ingrese su usuario" prefix={<UserOutlined />} />
      <Title level={4}>CONTRASEÑA</Title>
      <Input.Password
        size="large" 
        placeholder="Ingrese su contraseña" 
        prefix={<LockOutlined />} 
      />
      <br />
      <br />
      <Button type="primary" href="/principal">Iniciar Sesión</Button>
    </div>
  );
}

export default Login;
