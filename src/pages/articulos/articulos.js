import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Carousel, Image } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import { Typography } from 'antd';

import Card from "./components/card";
import { database } from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue } from "firebase/database";//database
import UserProfile from '../miscelanea/userProfile';

const { Title } = Typography;
const { Search } = Input;

function Articulos(){
  const contentStyle = {
    maxHeight: '50vh',
    maxWidth: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  }; 

  let images = ["", "", ""];
  let [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [imagesGen, setImagesGen] =useState([]);

  useEffect(() =>{
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name"));
    onValue(articulosRef, (snapshot) => {
      const data = snapshot.val();
      const tempImgList = [];
      for(let i in data){
        for(let j in data[i]["imagenes"]){
          if(data[i]["imagenes"][j]["url"]){
            tempImgList.push(data[i]["imagenes"][j]["url"]);
          }
        }
      }
      setImagesGen(tempImgList);
    })
    
    onValue(articulosRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      for(let i in data){
        let entryObject = data[i];
        const tempImgList = [];
        for(let j in data[i]["imagenes"]){
          if(data[i]["imagenes"][j]["url"]){
            tempImgList.push(data[i]["imagenes"][j]["url"]);
          }
        }
        entryObject["key"] = i;
        entryObject["listaImagenes"] = tempImgList;
        tempEntryList.push(entryObject);
      }
      setData(tempEntryList);
      setAllData(tempEntryList);
    })
  }, []);
  function onSearch(query){
    const newData = [];
    query = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    for(let i in allData){
      let normlizedEntry = allData[i]["detalles"]["Nombre"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      if(normlizedEntry.includes(query)){
        newData.push(allData[i]);
      }
    }
    setData(newData);
  }
  function nuevoArticulo(){
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name"));
    push(articulosRef,{
      detalles:{Nombre: (searchParams.get("name")) + "nuevo"},
    });
  }
  return (
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Search placeholder="Buscar"  allowClear style={{ width: 200}} onSearch={onSearch} />
        <Button type="primary" style={{float: "right"}} icon={<PlusOutlined />} onClick={nuevoArticulo}></Button>
        <Link to="/principal">
          <Button type="primary" style={{float: "right"}} icon={<ArrowLeftOutlined />} ></Button>
        </Link>
      </div>
      <div>
        <Title level={3}>{searchParams.get("name")}</Title>
      </div>
      <Carousel >
        {imagesGen.map( (image, c) => {
          return(
            <div key={c}>
              <Image 
              style={contentStyle} 
              src={image}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
              />
            </div>
          );
        })}
      </Carousel>
      {data.map( (articulo, c) => {
        return(
          <div key={articulo.key}>
            <Card images = {articulo.listaImagenes} id={articulo.key} title={articulo.detalles.Nombre}/>
          </div>
        );
      })}
    </div>
  );
}

export default Articulos