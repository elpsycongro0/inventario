import { React, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button, Tabs, Divider, Progress } from 'antd';
import { database, storage } from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue, get, child } from "firebase/database";//database
import { uploadBytesResumable, getDownloadURL, ref as sRef, deleteObject } from "firebase/storage";
import UserProfile from '../miscelanea/userProfile';

import ImageViewer from './components/imageViewer';

const { Title } = Typography;

const {TabPane} = Tabs;

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

const EditableTable = ({data, setData, saveData, preColums, deleteData}) => {
  const [form] = Form.useForm();
  //const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const deleteEntry = (record) => {
    //console.log(record);
    deleteData(record);
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
        saveData(newData, row);
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
            <Popconfirm title="Cancelar edición?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
            <Popconfirm title="Eliminar entrada?" onConfirm={() => deleteEntry(record)}>
              <a> Eliminar</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Editar
          </Typography.Link>
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
        inputType: col.dataIndex === 'fecha' ? 'DatePicker' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
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
        pagination={{ hideOnSinglePage:true, pageSize: 100}} 
      />
    </Form>
  );
};


//···###########################

function Details(){
  const columns = [
    {
      title: 'Atributo',
      dataIndex: 'atributo',
      editable: true,
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      editable: true,
    },
  ];
  const columns2 = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      editable: true,
    },
    {
      title: 'Ocurrencia',
      dataIndex: 'ocurrencia',
      editable: true,
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
      editable: true,
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      editable: true,
    },
  ];

  const [detailData, setDetailData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imageList, setImageList] = useState([]);
  const [tabState, setTabState] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  


  useEffect(() =>{
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
    onValue(articulosRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      let c = 1;
      for(let i in data){
        let entryObject = {};
        entryObject["key"] = c++;
        entryObject["atributo"] = i;
        entryObject["valor"] = data[i];
        tempEntryList.push(entryObject);
      }
      setDetailData(tempEntryList);
    })
  }, []);

  useEffect(() =>{
    const historialRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial");
    onValue(historialRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      let c = 1;
      for(let i in data){
        let entryObject = data[i];
        entryObject["key"] = i;
        tempEntryList.push(entryObject);
      }
      tempEntryList.sort((a, b) => {
        let da = new Date(a["fecha"]),
        db = new Date(b["fecha"]);
        return db - da;
      });
      setHistoryData(tempEntryList);
    })
  }, []);
  useEffect(() =>{
    const imagenesRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/imagenes");
    onValue(imagenesRef, (snapshot) => {
      const data = snapshot.val();
      const tempImgList = [];
      for(let i in data){
        if(data[i]["url"]){
          tempImgList.push(data[i]["url"]);
        }
      }
      setImageList(tempImgList);
    })
  }, []);

  function saveData(data){
    const entryObject = {};
    for(let i in data){
      entryObject[data[i]["atributo"]] = data[i]["valor"];
    }
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
    set(articulosRef,entryObject);
  }
  function saveDataHistorial(data, row){
    let key = "";
    let date = "";
    for(let i in data){
      if(data[i]["fecha"]===row["fecha"] && data[i]["ocurrencia"]===row["ocurrencia"] && data[i]["descripcion"]===row["descripcion"]){
        key = data[i]["key"];
        date = data[i]["date"];
      }
    }
    const historialRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial/"+key);
    row["date"] = date;
    set(historialRef,row);
  }
  function deleteData(record){
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
    set(child(articulosRef,record["atributo"]),null);
  }
  function deleteDataHistorial(record){
    console.log(record);
    const historialRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial/");
    set(child(historialRef,record["key"]),null);
  }
  function nuevaEntrada(){
    if(tabState==="1"){
      const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
      const entryObject = {};
      for(let i in detailData){
        entryObject[detailData[i]["atributo"]] = detailData[i]["valor"];
      }
      entryObject["Nuevo atributo"] = "valor";
      set(articulosRef,entryObject);
    }
    if(tabState==="2"){
      const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial");
      const entryObject = {
        fecha :new Date().toISOString().split('T')[0],
        costo: "0",
        ocurrencia: "OCURRENCIA",
        descripcion: "descripcion",
        date: Date.now(),
      }
      
      push(articulosRef,entryObject);
    }
  }
  function manageOnChange(key){
    setTabState(key);
  };
  function handleImageInputChange(e){
    if(e.target.files[0]){
      const imagenesRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/imagenes");
      get(child(imagenesRef,'contador')).then((snapshot) => {
        let contador;
        if (snapshot.exists()) {
          contador = snapshot.val();
        } else {
          set(child(imagenesRef,'contador'),0);
          contador = 0;
        }
        set(child(imagenesRef,'contador'),contador+1);
        //upload image and get url
        let nombreImagen = searchParams.get("name")+searchParams.get("id")+"-"+contador.toString()+".jpg";
        const imgRef = sRef(storage,"images/"+nombreImagen);
        const uploadTask = uploadBytesResumable(imgRef, e.target.files[0]);
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const uploadprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + uploadprogress + '% done');
            setProgress(uploadprogress);
          },
          (error) => {},
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //db image add
              push(imagenesRef, {
                nombre: nombreImagen,
                url: downloadURL,
              });
            });
          }
        );
      });
    }
    
  };
  function borrarImagen(url){
    const imagenesRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/imagenes");
    get(imagenesRef).then((snapshot) => {
      for(let i in snapshot.val()){
        if(snapshot.val()[i]["url"]===url)
          //console.log(snapshot.val()[i]["nombre"]);
          //borrar
          set(child(imagenesRef,i),null);
          const imgRef = sRef(storage,"images/"+snapshot.val()[i]["nombre"]);
          deleteObject(imgRef);
      }
    });
  }
  return(
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Button type="primary" style={{float: "right"}} icon={<PlusOutlined />} onClick={nuevaEntrada}></Button>
        <Link to={"/articulos?name="+searchParams.get("name")}>
          <Button type="primary" style={{float: "right"}} icon={<ArrowLeftOutlined />} ></Button>
        </Link>
      </div>
      
      <Tabs  defaultActiveKey="1" style={{width: "100%"}} onChange={manageOnChange}>
        <TabPane tab="Detalles" key="1">
          <EditableTable data={detailData} setData={setDetailData} saveData={saveData} deleteData={deleteData} preColums={columns}></EditableTable>
        </TabPane>
        <TabPane tab="Historial" key="2">
          <EditableTable data={historyData} setData={setHistoryData} saveData={saveDataHistorial} deleteData={deleteDataHistorial} preColums={columns2}></EditableTable>
        </TabPane>
        <TabPane tab="Imágenes" key="3">
          <div>
            <Title level={5}>Subir imagen</Title>
            <Input type="file" onChange={handleImageInputChange}></Input>
            <Progress percent={progress} size="small" />
            <Divider/>
            <ImageViewer imageList={imageList} borrarImagen={borrarImagen}></ImageViewer>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Details;