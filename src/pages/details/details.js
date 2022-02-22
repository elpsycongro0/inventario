import { React, useEffect, useState} from 'react';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button, Tabs, DatePicker } from 'antd';
import { database } from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue } from "firebase/database";//database

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

const EditableTable = ({data, setData, saveData, preColums}) => {
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
      title: 'Descripcion',
      dataIndex: 'descripcion',
      editable: true,
    },
  ];

  const [detailData, setDetailData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
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
      console.log(tempEntryList);
      setHistoryData(tempEntryList);
    })
  }, []);

  function saveData(data){
    const entryObject = {};
    for(let i in data){
      entryObject[data[i]["atributo"]] = data[i]["valor"];
    }
    console.log(entryObject);
    const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
    set(articulosRef,entryObject);
  }
  function saveDataHistorial(data, row){
    let key = ""
    for(let i in data){
      if(data[i]["fecha"]===row["fecha"] && data[i]["ocurrencia"]===row["ocurrencia"] && data[i]["descripcion"]===row["descripcion"]){
        key = data[i]["key"];
      }
    }
    const historialRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial/"+key);
    set(historialRef,row);
  }
  function nuevaEntrada(){
    if(tabState===1){
      console.log(1);
      const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/detalles");
      const entryObject = {};
      for(let i in detailData){
        entryObject[detailData[i]["atributo"]] = detailData[i]["valor"];
      }
      entryObject["Nuevo atributo"] = "valor";
      set(articulosRef,entryObject);
    }
    if(tabState==="2"){
      console.log(2);
      const articulosRef = ref(database, "Articulos/"+searchParams.get("name")+"/"+searchParams.get("id")+"/historial");
      const entryObject = {
        fecha :new Date().toISOString().split('T')[0],
        ocurrencia: "OCURRENCIA",
        descripcion: "descripcion",
      }
      
      push(articulosRef,entryObject);
    }
  }
  function manageOnChange(key){
    setTabState(key);
  }
  
  return(
    <div>
      <div className ="contentHeader" style={{padding: "5px"}}>
        <Button type="primary" style={{float: "right"}} icon={<PlusOutlined />} onClick={nuevaEntrada}></Button>
        <Button type="primary" style={{float: "right"}} icon={<ArrowLeftOutlined />} href={"/articulos?name="+searchParams.get("name")}></Button>
      </div>
      <Tabs  defaultActiveKey="1" style={{width: "100%"}} onChange={manageOnChange}>
        <TabPane tab="Detalles" key="1">
          <EditableTable data={detailData} setData={setDetailData} saveData={saveData} preColums={columns}></EditableTable>
        </TabPane>
        <TabPane tab="Historial" key="2">
          <EditableTable data={historyData} setData={setHistoryData} saveData={saveDataHistorial} preColums={columns2}></EditableTable>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Details;