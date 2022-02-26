import React from 'react';
import {Carousel} from 'antd';
import { Typography, Image } from 'antd';
import { useSearchParams } from "react-router-dom";

import "./card.css";
const { Title } = Typography;

function Card(props) {
  let [searchParams, setSearchParams] = useSearchParams();
  const images = props.images;
  return(
    <div className ="cardContainer">
      <a href={"/details/?name="+searchParams.get("name")+"&id="+props.id }><Title level={5}>{props.title}</Title></a>
    </div>
  );
}
export default Card;