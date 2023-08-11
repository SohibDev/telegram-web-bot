import React, { useCallback, useEffect, useState } from "react";
import { getData } from "./constants/db";
import Card from "./components/card/Card";
import "./App.css";
import Cart from "./components/cart/Cart";

const courses = getData();
const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = (item) => {
    const existItems = cartItems.find((c) => c.id == item.id);

    if (existItems) {
      const newData = cartItems.map((c) =>
        c.id == item.id
          ? { ...existItems, quantity: existItems.quantity + 1 }
          : c
      );
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const existItems = cartItems.find((c) => c.id == item.id);
    console.log(`ExistItems:`, existItems);

    if (existItems.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== existItems.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItems.id
          ? { ...existItems, quantity: existItems.quantity - 1 }
          : c
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = `Sotib olish :)`;
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    const queryID = telegram.initdataUnsave?.query_id;

    if (queryID) {
      fetch(`http://localhost:8000/web_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItems),
      });
    } else {
      telegram.sendData(JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData]);

  return (
    <div>
      <h1 className="heading">Course</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {courses.map((course) => (
          <>
            <Card
              key={course.id}
              course={course}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default App;
