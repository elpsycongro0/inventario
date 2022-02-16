import React from 'react';
import {Carousel} from 'antd';
import { Typography } from 'antd';

import "./card.css";
const { Title } = Typography;

function Card(props) {
  const images = props.images;
  return(
    <div className ="cardContainer">
      <Carousel >
        {images.map( (image, c) => {
          return(
            <div className ="cardImage" key={c}>
              <img src={image}/>
            </div>
          );
        })}
      </Carousel>
      <a href="/details/asdf"><Title level={5}>{props.title}</Title></a>
    </div>
  );
}
export default Card;