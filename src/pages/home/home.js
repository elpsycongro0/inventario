import React from 'react';
import { Breadcrumb, Layout } from 'antd';
const { Header, Footer, Sider, Content} = Layout;

function Home() {
  return(
    <div>
            <Breadcrumb style={{margin:'16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Trabajos</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background:'#fff', padding: 24}}>
              <img style={{margin:"auto",maxHeight: "70vh", maxWidth: "100%"}} src="web1.jpg"></img>
            </div>
    </div>
  );
}

export default Home;