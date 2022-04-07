import {React, useState} from 'react';
import { Input, Button, Layout } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import UserProfile from '../miscelanea/userProfile';

const { Title } = Typography;
const {Content} = Layout;



function Login({isLogged, setisLogged}) {
  const [usuario, setUsuario] = useState('')
  const [contra, setContra] = useState('')
  function handleUserChange(e){
    setUsuario(e.target.value);
  }
  function handleContraChange(e){
    setContra(e.target.value)
  }
  function handleLogin(){
    UserProfile.setName("entro");
    if(usuario === "admin" && contra === "abcd1234"){
      
      setisLogged(true);
    }
  }
  return(
    <div style={{padding:"20px", background:'#fff', margin:"auto", maxWidth:"80vw", }}>
      {UserProfile.getName()}
      <Title level={2}>INGRESAR</Title>
      <Title level={4}>USUARIO</Title>
      <Input size="large" placeholder="Ingrese su usuario" prefix={<UserOutlined />} onChange={handleUserChange}/>
      <Title level={4}>CONTRASEÑA</Title>
      <Input.Password
        size="large" 
        placeholder="Ingrese su contraseña" 
        prefix={<LockOutlined />} 
        onChange={handleContraChange}
      />
      <br />
      <br />
      <Link to="/principal">
        <Button type="primary" onClick={handleLogin}>Iniciar Sesión</Button>
      </Link>
    </div>
  );
}

export default Login;
