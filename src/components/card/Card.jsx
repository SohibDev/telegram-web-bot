import React, { useState } from "react";
import "./card.css";
import Button from "../button/Button";

const Card = (props) => {
  const [count, setCount] = useState(0);

  const increament = () => {
    setCount((prev) => prev + 1);
    onAddItem(course);
  };
  const decreament = () => {
    setCount((prev) => prev - 1);
    onRemoveItem(course);
  };

  const { course, onAddItem, onRemoveItem } = props;
  return (
    <div className="card">
      <span className={`${count !== 0 ? "card__badge" : "card__badge-hidden"}`}>
        {count}
      </span>

      <div className="image__container">
        <img
          src={course.Image}
          alt={course.title}
          width={"100%"}
          height={"230px"}
        />
      </div>

      <div className="card__body">
        <h2 className="card__title">{course.title}</h2>
        <div className="card-price">
          {course.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </div>

      <div className="hr"></div>

      <div className="btn__container">
        <Button title="+" type="add" onClick={increament} />
        {count !== 0 && <Button title="-" type="remove" onClick={decreament} />}
      </div>
    </div>
  );
};

export default Card;
