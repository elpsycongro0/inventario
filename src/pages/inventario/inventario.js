import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ref, onValue } from "firebase/database";//database
import { database } from '../../Firebase/firebase';//database ref o  firebase.js
import EditableTable from './components/editableTable';

const { Search } = Input;
const { Title} = Typography;

function Inventario(){
  
  const [articles, setArticles] =useState([]);
  const [allArticles, setAllArticles] =useState([]);
  const columns = [
    {
      title: 'Articulo',
      dataIndex: 'articulo',
      editable: true,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      editable: true,
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
      editable: true,
    },
    
  ];

  useEffect(() =>{
    const articulosRef = ref(database, "Articulos/");
    onValue(articulosRef, (snapshot) => {
      const data = snapshot.val();
      const articleList = [];
      for(let i in data){
        for(let j in data[i]){
          let articleObject = {}
          articleObject["articulo"] = i
          articleObject["nombre"] = data[i][j]["detalles"]["Nombre"]
          articleList.push(articleObject);
        }
      }
      setArticles(articleList);
      setAllArticles(articleList)
    })
    
  }, []);

  function onSearch(query){
    const newData = [];
    query = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    for(let i in allArticles){
      let normlizedArticulo = allArticles[i]["articulo"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      let normlizedNombre = allArticles[i]["nombre"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      if(normlizedArticulo.includes(query) || normlizedNombre.includes(query)){
        newData.push(allArticles[i]);
      }
    }
    setArticles(newData);
  }

  return (
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Search placeholder="Buscar"  allowClear style={{ width: 200}}  onSearch={onSearch}/>
        <Link to="/principal">
          <Button type="primary" style={{float: "right"}} icon={<ArrowLeftOutlined />} ></Button>
        </Link>
      </div>
      <div>
        <Title level={3}>INVENTARIO</Title>
      </div>
      <div>
        <EditableTable data={articles}  preColums={columns}></EditableTable>
        
      </div>
    </div>
  );
}

export default Inventario