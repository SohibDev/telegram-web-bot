import React, { useCallback, useEffect, useState } from "react";
import { getData } from "./constants/db";
import Card from "./components/card/Card";
import "./App.css";
import Cart from "./components/cart/Cart";

const courses = getData();
const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

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
      telegram.sendData(
        JSON.stringify({ products: cartItems, queryID: queryID })
      );
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData]);

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle form submission, like sending data to a server
    // For example, you can log the data to the console for now
    console.log("Phone:", phone);
    console.log("Message:", message);
    console.log("Email:", email);
    console.log("Selected Option:", selectedOption);
  };

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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phone">Raqamingiz:</label>
          <input
            placeholder="Masalan: +998992745597"
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div>
          <label htmlFor="message">Tavsif yozing:</label>
          <textarea
            placeholder="Tavsifingiz..."
            id="message"
            value={message}
            onChange={handleMessageChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            placeholder="Masalan: sohibjonuzoqov01@gmail.com"
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="selectOption">Turlari:</label>
          <select
            id="selectOption"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option className="options" value="">Ro'yxat</option>
            <option className="options" value="option1">Medevek</option>
            <option className="options" value="option2">Tort</option>
            <option className="options" value="option3">Napalyon</option>
          </select>
        </div>
        <button type="submit">Yuborish</button>
      </form>
    </div>
  );
};

export default App;
