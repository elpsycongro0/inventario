import { React , useEffect } from 'react';
import { Image } from 'antd';
import { database, storage } from './../../../Firebase/firebase'

function ImageViewer({imageList}) {
  
  // useEffect(() => {
  //   const

  // }, []);
  return(
    <div>
      {imageList.map((image, c) => 
        <div key={c}>
          <Image src={image}></Image>
        </div>
      )};
      
    </div>
  );
}
export default ImageViewer;