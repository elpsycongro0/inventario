import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Input, Button, Avatar, Breadcrumb, Layout } from 'antd';
import { LogoutOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.min.css';
import { Typography } from 'antd';

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Principal from "./pages/principal/principal";
import Articulos from "./pages/articulos/articulos";
import Details from "./pages/details/details"

const { Title } = Typography;
const { Header, Footer, Sider, Content} = Layout;

function App() {
  return(
    <div className="App">
      <Layout>
        <Header style={{minHeight: "8vh", padding:20}}>
          <Button type="primary" danger style={{float:'right'}} icon={<LogoutOutlined />} href="/login">Salir</Button>
          <Title style={{color:'white'}} level={3}>LOGO WEB</Title>
        </Header>
        <Layout style={{minHeight: "92vh"}}>
          <Content style={{padding: '10px'}}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login/" element={<Login />} />
                <Route path="principal/" element={<Principal />} />
                <Route path="articulos/*" element={<Articulos />} />
                <Route path="details/*" element={<Details />} />
              </Routes>
            </BrowserRouter>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
export default App;
