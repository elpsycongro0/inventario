import React, {useEffect, useState} from 'react';
import { Breadcrumb, Button, Layout } from 'antd';
import {app, database} from '../../Firebase/firebase';//database ref o  firebase.js
import { ref, set, push, onValue} from "firebase/database";//database

const { Header, Footer, Sider, Content} = Layout;

function Notes (){//temp
  const [temp, setTemp] = useState("");
  const [backendData, setBackendData] = useState([]);

  const noteRootStyle = {
    border: "2px #0af solid",
    borderRadius: 9,
    margin: 20,
    backgroundColor: "#efefef",
    padding: 6
  };
  function handleOnChange(e){
    setTemp(e.target.value);
  }
  function createTempEntry(){
    const tempRef = ref(database, "Temp");
    // const tempRef = database.ref("Temp");
    const tempentry ={
      title: temp,
      description: "some description",
      createdate: Date.now(),
    };
    push(tempRef,tempentry);
  }
  useEffect(() =>{
    const tempRef = ref(database, "Temp");
    onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      const tempEntryList = [];
      for(let i in data){
        tempEntryList.push(data[i]);
      }
      setBackendData(tempEntryList);
    })
  }, []);

  return (
    <div style={{ width: 400 }}>
      <div>
        <input type="text" onChange={handleOnChange}/>
        <Button onClick={createTempEntry}>+</Button>
      </div>
      {backendData.map((ele, idx) => 
        <div style={noteRootStyle} key={idx}>
          <h3>{ele.title}</h3>
          <p>{ele.description}</p>
          <small>{new Date(ele.createdate).toString()}</small>
        </div>
      )}
    </div>
  );

}
//#######################END NOTES#######################
function Home() {
  return(
    <div>
            <Breadcrumb style={{margin:'16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Trabajos</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background:'#fff', padding: 24}}>
              <img style={{margin:"auto",maxHeight: "70vh", maxWidth: "100%"}} src="web1.jpg"></img>
            </div>
            {/* <div style={{ display: "flex", justifyContent: "center" }}>
              <Notes/>
            </div> */}
    </div>
  );
}

export default Home;