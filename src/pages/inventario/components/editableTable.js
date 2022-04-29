import { React, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';

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
  const columns = preColums
  // const columns = preColums.concat([
  //   {
  //     title: 'Op.',
  //     dataIndex: 'operation',
  //     render: (_, record) => {
  //       const editable = isEditing(record);
  //       return editable ? (
  //         <span>
  //           <Typography.Link
  //             onClick={() => save(record.key)}
  //             style={{
  //               marginRight: 8,
  //             }}
  //           >
  //             Guardar
  //           </Typography.Link>
  //           <Popconfirm title="Cancelar edición?" onConfirm={cancel}>
  //             <a>Cancelar</a>
  //           </Popconfirm>
  //           <Popconfirm title="Eliminar entrada?" onConfirm={() => deleteEntry(record)}>
  //             <a> Eliminar</a>
  //           </Popconfirm>
  //         </span>
  //       ) : (
  //         <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
  //           Editar
  //         </Typography.Link>
  //       );
  //     },
  //   },
  // ]);
  
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

export default EditableTable