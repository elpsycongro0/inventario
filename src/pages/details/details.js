import React from 'react';

import {Tabs, Table} from 'antd';

const {TabPane} = Tabs;
const dataSource = [
  {
    key: '1',
    atributo: 'Nombre',
    valor: 'COMPRESOR DE AIRE',
  },
  {
    key: '2',
    atributo: 'Tipo',
    valor: 'GA307 PAU307392',
  },
  {
    key: '3',
    atributo: 'Elemento compresor',
    valor: 'PAU716880',
  },
  {
    key: '4',
    atributo: 'Motor',
    valor: 'GU34613',
  },
  {
    key: '5',
    atributo: 'Estado',
    valor: 'Operativo',
  },
];
const dataSource2 = [
  {
    key: '1',
    fecha: '15/02/2022',
    ocurrencia: 'REPARACIÓN',
    descripcion: 'Cambio de contractor y tarjeta de control',
  },
  {
    key: '2',
    fecha: '10/02/2022',
    ocurrencia: 'ALQUILER',
    descripcion: 'Alquiler el dia xxxx a tal persona a $$$ monto por n dias',
  },
];

function Details(){
  const columns = [
    {
      title: 'Atributo',
      dataIndex: 'atributo',
      key: 'atributo',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
    },
  ];
  const columns2 = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Ocurrencia',
      dataIndex: 'ocurrencia',
      key: 'ocurrencia',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ];
  
  return(
    <div>
      <Tabs  defaultActiveKey="1" >
        <TabPane tab="Detalles" key="1">
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            pagination={{ hideOnSinglePage:true, pageSize: 100}} 
          />;
        </TabPane>
        <TabPane tab="Historial" key="2">
        <Table 
            dataSource={dataSource2} 
            columns={columns2} 
            pagination={{ hideOnSinglePage:true, pageSize: 100}} 
          />;
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Details;