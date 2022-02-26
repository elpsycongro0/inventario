import { React , useEffect } from 'react';
import { Image, Button } from 'antd';
import { database, storage } from './../../../Firebase/firebase'

import "./imageViewer.css"

function ImageViewer({imageList, borrarImagen}) {
  
  // useEffect(() => {
  //   const

  // }, []);
  function handleOnClick(e){
    const url = Object.values(e.currentTarget)[1].enlace;
    borrarImagen(url);
  }
  return(
    <div>
      {imageList.map((image, c) => 
        <div className="container" key={c}>
          <Image src={image}></Image>
          <Button danger onClick={handleOnClick} enlace={image} value="2">BORRAR</Button>
        </div>
      )};
      
    </div>
  );
}
export default ImageViewer;

