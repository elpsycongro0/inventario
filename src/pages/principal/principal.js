import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Input, Carousel , Table, Tag, InputNumber, Popconfirm, Form, Typography, Button, Image } from 'antd';
import { database } from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue, get, child, remove } from "firebase/database";//database
import UserProfile from '../miscelanea/userProfile';

const { Search } = Input;


//#########################
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({data, setData, imageUpdate, preColums, deleteData}) => {
  const [form] = Form.useForm();
  
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      categoria: '',
      articulo: '',
      cantidad: '',
      fotos: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const deleteEntry = (record) => {
    // if(record["atributo"]==="Nombre"){
    //   setEditingKey('');
    //   return;
    // }
    deleteData(record);
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const inventarioRef = ref(database, "Inventario/"+key);
        set(inventarioRef,row);
        const item = newData[index];
        if(row["articulo"] != item["articulo"]){
          const refToEdit = ref(database, "Articulos/");
          const childO = child(refToEdit, item["articulo"]);
          get(childO).then(function(snapshot) {
            set(child(refToEdit, row["articulo"]), snapshot.val());
            remove(childO);
          });
        }
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = preColums.concat([
    {
      title: 'Op.',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Guardar
            </Typography.Link>
            <Popconfirm title="Quieres cancelar la edición?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
            <Popconfirm title="Eliminar entrada?" onConfirm={() => deleteEntry(record)}>
              <a> Eliminar</a>
            </Popconfirm>
          </span>
        ) : (
          <div>
            <Tag color='geekblue' disabled={editingKey !== ''} onClick={() => edit(record)}>
              EDITAR
            </Tag>
            <Tag color='geekblue' onClick={verFotos} value={record.articulo}>
              VER
            </Tag>
          </div>
          
        );
      },
    },
  ]);

  
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'cantidad' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  function verFotos(e){
    const articulosRef = ref(database, "Articulos/"+Object.values(e.target)[1]['value']);
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
      console.log(tempImgList);
      imageUpdate(tempImgList);
    })
    
  }
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

//###########################
function Principal() {  
  const [images, setImages] =useState([]);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
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
      width: "30%",
      editable: true,
    },
    {
      title: 'Articulo',
      dataIndex: 'articulo',
      width: "40%",
      editable: true,
      render: (text, record) => (
        <div>
            <Link to={"/articulos?name="+text}>{text}</Link>
              
        </div>
      ),
    },
    {
      title: 'Cant.',
      dataIndex: 'cantidad',
      width: "10%",
      editable: true,
    },
  ];

  useEffect(() =>{
    const inventarioRef = ref(database, "Inventario");
    onValue(inventarioRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      for(let i in data){
        let entryObject = data[i];
        entryObject["key"] = i;
        tempEntryList.push(entryObject);
        //console.log(entryObject);
      }
      setData(tempEntryList);
      setAllData(tempEntryList);
    })
  }, []);

  function onSearch(query){
    console.log();
    const newData = [];
    query = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    for(let i in allData){
      let normlizedArticulo = allData[i]["articulo"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      let normlizedCategoria = allData[i]["articulo"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      if(normlizedArticulo.includes(query) || normlizedCategoria.includes(query)){
        newData.push(allData[i]);
      }
    }
    setData(newData);
  }

  function nuevoArticulo(){
    const inventarioRef = ref(database, "Inventario");
    const entry ={
      categoria: 'none',
      articulo: 'none',
      cantidad: 0,
    };
    push(inventarioRef,entry);
  }

  function deleteData(entry){
    const inventarioRef = ref(database, "Inventario/");
    const articulosRef = ref(database, "Articulos/");

    set(child(inventarioRef,entry["key"]),null);
    set(child(articulosRef,entry["articulo"]),null);
  }

  return (
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Search placeholder="Buscar"  allowClear onSearch={onSearch} style={{ width: 200}} />
        <Button type="primary" style={{float: "right"}} onClick={nuevoArticulo}>Nuevo Articulo</Button>
      </div>
      <EditableTable data={data} setData={setData} imageUpdate={setImages} preColums={columns} deleteData={deleteData}/>
      <Carousel >
        {images.map( (image, c) => {
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
      
    </div>
  );
}

export default Principal;