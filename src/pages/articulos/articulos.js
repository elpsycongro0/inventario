import React from 'react';
import {Input, Button} from 'antd';

import Card from "./components/card";

const { Search } = Input;

function Articulos(){
  let images = ["../Alimentadores01.jpg", "../Alimentadores02.jpg", "../Alimentadores03.jpg"];
  const contentStyle = {
    maxHeight: '50vh',
    maxWidth: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Search placeholder="Buscar"  allowClear style={{ width: 200}} />{/*onSearch={onSearch}*/}
        <Button type="primary" style={{float: "right"}} href="/principal">Regresar</Button>
      </div>
      <Card images = {images} title="ALIMENTADOR01"/>
      <Card images = {images} title="ALIMENTADOR02"/>
      <Card images = {images} title="ALIMENTADOR03"/>
    </div>
  );
}

export default Articulos