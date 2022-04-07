import React from 'react';
import { Link } from 'react-router-dom';
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
      <Link to={"/details/?name="+searchParams.get("name")+"&id="+props.id }>
        <Title level={5}>{props.title}</Title>
      </Link>
    </div>
  );
}
export default Card;