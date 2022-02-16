import {React, useState} from 'react';
import {Input, Carousel , Table, Tag } from 'antd';

const { Search } = Input;

const dataSource = [
  {
    key: '1',
    categoria: 'Maquinaria',
    articulo: 'Alimentadores',
    cantidad: 6,
    fotos: 'Alimentadores',
  },
  {
    key: '2',
    categoria: 'Maquinaria',
    articulo: 'Generadores',
    cantidad: 1,
    fotos: 'Generadores'
  },
  {
    key: '3',
    categoria: 'Maquinaria',
    articulo: 'Compresoras',
    cantidad: 3,
    fotos: 'Compresoras',
  },
  {
    key: '4',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '5',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '6',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '7',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '8',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '9',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '10',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '11',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
  {
    key: '12',
    categoria: 'Otros',
    articulo: 'nombre de articulo',
    cantidad: 99,
    fotos: 'laURL',
  },
];



function Principal() {  
  const [images, setImages] =useState([]);
  const contentStyle = {
    maxHeight: '50vh',
    maxWidth: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  }; 

  const columns = [
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Articulo',
      dataIndex: 'articulo',
      key: 'articulo',
      render: (text, record) => (
        <div>
            <a href={"/articulos/"+text}>{text}</a>
        </div>
      ),
    },
    {
      title: 'Cant.',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: 'Fotos',
      dataIndex: 'fotos',
      key: 'fotos',
      render: (text, record) => (
        <div>
        <Tag color='geekblue' onClick={verFotos} value={record.fotos}>
          VER
        </Tag>
      </div>
      ),
    }
  ];
  
  function verFotos(e){
    let imgCount = 1;
    let imgCountToStr = ("00" + imgCount).slice(-2);
    let url = "./" + Object.values(e.target)[1]['value']+imgCountToStr+".jpg";
    let allImages = [];
    allImages = allImages.concat(url);
    imgCount += 1;
    imgCountToStr = ("00" + imgCount).slice(-2);
    url = "./" + Object.values(e.target)[1]['value']+imgCountToStr+".jpg";
    allImages = allImages.concat(url);
    imgCount += 1;
    imgCountToStr = ("00" + imgCount).slice(-2);
    url = "./" + Object.values(e.target)[1]['value']+imgCountToStr+".jpg";
    allImages = allImages.concat(url);
    console.log(allImages);
    setImages(allImages);
  }
  
  return (
    <div>
      <Search placeholder="Buscar" allowClear style={{ width: 200, padding:"5px" }} />{/*onSearch={onSearch}*/}
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        size="small" 
        pagination={{ pageSize: 10}} 
      />
      <Carousel >
        {images.map( (image, c) => {
          return(
            <div key={c}>
              <img style={contentStyle} src={image}/>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default Principal;