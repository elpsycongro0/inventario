import {React, useState} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Input, Button, Avatar, Breadcrumb, Layout } from 'antd';
import { LogoutOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.min.css';
import { Typography } from 'antd';

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Principal from "./pages/principal/principal";
import Articulos from "./pages/articulos/articulos";
import Details from "./pages/details/details"
import { app } from './Firebase/firebase';
import { is } from '@babel/types';

const { Title } = Typography;
const { Header, Footer, Sider, Content} = Layout;

function LogButton({isLogged, setisLogged}){
  function logout(){
    setisLogged(false);
  }
  if(isLogged){
    return(
      <Button type="primary" danger style={{float:'right'}} icon={<LogoutOutlined />} onClick={logout} href="/login">Salir</Button>
    );
  }
  else{
    return(
      <Button type="primary" style={{float:'right'}} icon={<UserOutlined />} href="/login">Ingresar</Button>
    );
  }
}
function App() {
  const[isLogged,setisLogged] = useState(false);
  function requireAuth(nextState, replace, next) {
    console.log("cheka login");
    if (!isLogged) {
      replace({
        pathname: "/login",
        state: {nextPathname: nextState.location.pathname}
      });
    }
    next();
  }  
  return(
    <div className="App">
      <Layout>
        <Header style={{minHeight: "8vh", padding:20}}>
          <LogButton isLogged={isLogged} setisLogged={setisLogged}></LogButton>
          <Title style={{color:'white'}} level={3}>LOGO WEB</Title>
        </Header>
        <Layout style={{minHeight: "92vh"}}>
          <Content style={{padding: '10px'}}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login/" element={<Login isLogged={isLogged} setisLogged={setisLogged}/>} />
                <Route path="principal/" element={!isLogged ? <Navigate to="/login" /> : <Principal />}/>
                <Route path="articulos/*" element={!isLogged ? <Navigate to="/login" /> : <Articulos />}/>
                <Route path="details/*" element={!isLogged ? <Navigate to="/login" /> : <Details />}/>
              </Routes>
            </BrowserRouter>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
export default App;
