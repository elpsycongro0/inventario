import { React, useEffect, useState } from 'react';
import { Input, Button, Image } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import { Typography } from 'antd';

import Card from "./components/card";
import { database } from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue } from "firebase/database";//database

const { Title } = Typography;
const { Search } = Input;

function Articulos(){
  let images = ["", "", ""];
  let [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);

  useEffect(() =>{
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name"));
    onValue(articulosRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      for(let i in data){
        let entryObject = data[i];
        entryObject["key"] = i;
        tempEntryList.push(entryObject);
      }
      setData(tempEntryList);
    })
  }, []);

  function nuevoArticulo(){
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name"));
    push(articulosRef,{
      detalles:{Nombre: (searchParams.get("name")) + "nuevo"},
    });
  }
  return (
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Search placeholder="Buscar"  allowClear style={{ width: 200}} />{/*onSearch={onSearch}*/}
        <Button type="primary" style={{float: "right"}} icon={<PlusOutlined />} onClick={nuevoArticulo}></Button>
        <Button type="primary" style={{float: "right"}} icon={<ArrowLeftOutlined />} href="/principal"></Button>
      </div>
      <div>
        <Title level={3}>{searchParams.get("name")}</Title>
      </div>
      {data.map( (articulo, c) => {
        return(
          <div key={articulo.key}>
            <Card images = {images} id={articulo.key} title={articulo.detalles.Nombre}/>
          </div>
        );
      })}
    </div>
  );
}

export default Articulos